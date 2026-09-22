import { api } from "./client";

// ------------------------------------------------------------------ customer

export const getMyOrders = () => api("/api/orders/my-orders", { auth: true });

/** Only while the order is still PLACED. Refunds to the Kamal Wallet. */
export const cancelOrder = (id, reason) =>
  api(`/api/orders/${id}/cancel`, { method: "POST", auth: true, body: { reason } });

/** The delivery address saved on an order, in the shape the checkout form uses. */
export function addressOf(order) {
  if (!order?.deliveryAddress) return null;
  return {
    name: order.deliveryName || "",
    phone: order.deliveryPhone || "",
    address: order.deliveryAddress || "",
    city: order.deliveryCity || "",
    pincode: order.deliveryPincode || "",
  };
}

/** The address on the customer's most recent order that has one. */
export function latestAddress(orders) {
  const withAddress = (Array.isArray(orders) ? orders : [])
    .filter((o) => o?.deliveryAddress)
    .sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  return addressOf(withAddress[0]);
}

// --------------------------------------------------------------------- admin

/** Newest first. status: ALL, OPEN, PLACED, CONFIRMED, OUT_FOR_DELIVERY, DELIVERED, CANCELLED. */
export const getAdminOrders = (page = 0, size = 20, status = "ALL") =>
  api(`/api/admin/orders?page=${page}&size=${size}&status=${encodeURIComponent(status)}`, { auth: true });

export const getAdminOrderStats = () => api("/api/admin/orders/stats", { auth: true });

export const advanceOrder = (id, status) =>
  api(`/api/admin/orders/${id}/status`, { method: "POST", auth: true, body: { status } });

export const adminCancelOrder = (id, reason) =>
  api(`/api/admin/orders/${id}/cancel`, { method: "POST", auth: true, body: { reason } });

// --------------------------------------------------------------------- stock

/** Exact count after a stock take. null stops tracking (always available). */
export const setStock = (productId, stock) =>
  api(`/api/admin/products/${productId}/stock`, { method: "PUT", auth: true, body: { stock } });

/** A delivery arrived: add units on top of what is there. */
export const restock = (productId, quantity) =>
  api(`/api/admin/products/${productId}/restock`, { method: "POST", auth: true, body: { quantity } });

export const getStockAlerts = () => api("/api/admin/products/stock-alerts", { auth: true });
