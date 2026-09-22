import { api } from "./client";

export const resendOtp = (email) =>
  api("/api/auth/resend-otp", { method: "POST", body: { email } });

/** Always answers the same, whether or not the email is registered. */
export const forgotPassword = (email) =>
  api("/api/auth/forgot-password", { method: "POST", body: { email } });

/** Sets the new password and returns { token, role } - the user is signed in. */
export const resetPassword = (email, code, newPassword) =>
  api("/api/auth/reset-password", { method: "POST", body: { email, code, newPassword } });

/** Mirrors the server's rules so the form can guide before submitting. */
export const PASSWORD_RULES = [
  { id: "len", label: "8 or more characters", test: (p) => p.length >= 8 && p.length <= 72 },
  { id: "letter", label: "A letter", test: (p) => /[A-Za-z]/.test(p) },
  { id: "number", label: "A number", test: (p) => /\d/.test(p) },
];

export const passwordOk = (p) => PASSWORD_RULES.every((r) => r.test(p));
