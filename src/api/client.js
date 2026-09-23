import { jwtDecode } from "jwt-decode";

const BASE_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
    // 429s say how long to wait, so pages can show a countdown.
    this.retryAfter =
      data && typeof data === "object" && data.retryAfterSeconds
        ? Number(data.retryAfterSeconds)
        : null;
  }
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getRole() {
  return localStorage.getItem("role");
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
}

/**
 * A token is only usable if it parses AND has not expired.
 * jwt-decode was already a dependency but was never used, so the app happily
 * sent long-dead tokens and showed logged-in UI to logged-out users.
 */
export function isLoggedIn() {
  const token = getToken();
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);
    return typeof exp === "number" && exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function isAdmin() {
  return isLoggedIn() && getRole() === "ROLE_ADMIN";
}

/**
 * Single place where every request to the API goes.
 *
 *  - attaches the bearer token when auth: true
 *  - refuses to send an expired token and clears the stale session instead
 *  - turns the backend's JSON error body into a real Error with a readable
 *    message, so pages stop alerting "[object Object]" or raw JSON
 */
export async function api(path, options = {}) {
  const { method = "GET", body, auth = false } = options;

  const headers = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    if (!isLoggedIn()) {
      clearSession();
      throw new ApiError("Please log in to continue.", 401);
    }
    headers.Authorization = `Bearer ${getToken()}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  // Only a signed-in call can have an expired session. A 401 from the login
  // form itself is a wrong password, and its own message says so.
  if (res.status === 401 && auth) {
    clearSession();
    throw new ApiError("Your session has expired. Please log in again.", 401);
  }

  const text = await res.text();

  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && data.message) ||
      (typeof data === "string" && data.trim()) ||
      `Request failed (${res.status})`;

    throw new ApiError(message, res.status, data);
  }

  return data;
}

/**
 * Downloads a file the API returns as bytes - today, an invoice PDF or the
 * invoice register CSV.
 *
 * A plain <a href> cannot be used for these: the endpoints need the bearer
 * token, and a link carries no headers. So the file is fetched like any other
 * request, turned into a blob and saved through a temporary object URL.
 *
 * Errors still arrive as JSON, so a failure is read and rethrown as a normal
 * ApiError - the user sees "this order was cancelled", not a corrupt download.
 */
export async function download(path, fallbackName) {
  if (!isLoggedIn()) {
    clearSession();
    throw new ApiError("Please log in to continue.", 401);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  if (res.status === 401) {
    clearSession();
    throw new ApiError("Your session has expired. Please log in again.", 401);
  }

  if (!res.ok) {
    const text = await res.text();
    let data = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    const message =
      (data && typeof data === "object" && data.message) ||
      (typeof data === "string" && data.trim()) ||
      `Could not download the file (${res.status})`;
    throw new ApiError(message, res.status, data);
  }

  const blob = await res.blob();
  const name = fileNameFrom(res.headers.get("Content-Disposition")) || fallbackName;

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Revoking immediately can cancel the save in some browsers, so let the
  // click settle first.
  setTimeout(() => URL.revokeObjectURL(url), 2000);

  return { name, invoiceNumber: res.headers.get("X-Invoice-Number") || null };
}

/** Pulls the filename out of a Content-Disposition header, RFC 6266 form first. */
function fileNameFrom(header) {
  if (!header) return null;
  const encoded = /filename\*=UTF-8''([^;]+)/i.exec(header);
  if (encoded) {
    try {
      return decodeURIComponent(encoded[1]);
    } catch {
      /* fall through to the plain form */
    }
  }
  const plain = /filename="?([^";]+)"?/i.exec(header);
  return plain ? plain[1] : null;
}
