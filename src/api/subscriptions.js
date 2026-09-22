import { api } from "./client";

const base = "/api/subscriptions";

// ---- public
export const getPlans = () => api(`${base}/plans`);
export const previewSubscription = (body) => api(`${base}/preview`, { method: "POST", body });

// ---- signed in
export const listSubscriptions = () => api(base, { auth: true });
export const createSubscription = (body) => api(base, { method: "POST", auth: true, body });
export const getSubscription = (id) => api(`${base}/${id}`, { auth: true });
export const updateSubscription = (id, body) =>
  api(`${base}/${id}`, { method: "PUT", auth: true, body });

export const pauseSubscription = (id) => api(`${base}/${id}/pause`, { method: "POST", auth: true });
export const resumeSubscription = (id) => api(`${base}/${id}/resume`, { method: "POST", auth: true });
export const cancelSubscription = (id) => api(`${base}/${id}/cancel`, { method: "POST", auth: true });

export const setVacation = (id, from, to) =>
  api(`${base}/${id}/vacation`, { method: "PUT", auth: true, body: { from, to } });
export const clearVacation = (id) =>
  api(`${base}/${id}/vacation`, { method: "DELETE", auth: true });

export const skipDay = (id, date) =>
  api(`${base}/${id}/skips`, { method: "POST", auth: true, body: { date } });
export const restoreDay = (id, date) =>
  api(`${base}/${id}/skips/${date}`, { method: "DELETE", auth: true });

export const getDeliveries = ({ subscriptionId, page = 0, size = 10 } = {}) =>
  api(
    `${base}/deliveries?page=${page}&size=${size}` +
      (subscriptionId ? `&subscriptionId=${subscriptionId}` : ""),
    { auth: true }
  );

// ---- admin
const admin = "/api/admin/subscriptions";
export const getAdminStats = () => api(`${admin}/stats`, { auth: true });
export const getDispatch = (date) =>
  api(`${admin}/dispatch${date ? `?date=${date}` : ""}`, { auth: true });
export const markDelivered = (id) =>
  api(`${admin}/deliveries/${id}/delivered`, { method: "POST", auth: true });
export const refundDelivery = (id, reason) =>
  api(`${admin}/deliveries/${id}/refund`, { method: "POST", auth: true, body: { reason } });
export const runGeneration = (date) =>
  api(`${admin}/run${date ? `?date=${date}` : ""}`, { method: "POST", auth: true });
