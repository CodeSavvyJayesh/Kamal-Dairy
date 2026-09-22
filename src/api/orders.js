import { api } from "./client";

export const getMyOrders = () => api("/api/orders/my-orders", { auth: true });

/** Admin: every order, newest first. */
export const getAdminOrders = (page = 0, size = 20) =>
  api(`/api/admin/orders?page=${page}&size=${size}`, { auth: true });

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
