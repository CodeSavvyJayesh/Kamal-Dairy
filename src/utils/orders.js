/** Order lifecycle and stock helpers shared by customer and admin pages. */

export const ORDER_STEPS = [
  { status: "PLACED", label: "Placed", at: "createdAt" },
  { status: "CONFIRMED", label: "Confirmed", at: "confirmedAt" },
  { status: "OUT_FOR_DELIVERY", label: "Out for delivery", at: "outForDeliveryAt" },
  { status: "DELIVERED", label: "Delivered", at: "deliveredAt" },
];

const RANK = { PLACED: 0, CONFIRMED: 1, OUT_FOR_DELIVERY: 2, DELIVERED: 3 };

/** How far along the four steps an order is (0–3), or -1 when cancelled. */
export const stepIndex = (order) =>
  order?.status === "CANCELLED" ? -1 : RANK[order?.status] ?? RANK.DELIVERED;

export const isOpenOrder = (order) =>
  ["PLACED", "CONFIRMED", "OUT_FOR_DELIVERY"].includes(order?.status);

/** The one button an admin needs next, or null when the order is finished. */
export const NEXT_ACTION = {
  PLACED: { status: "CONFIRMED", label: "Confirm" },
  CONFIRMED: { status: "OUT_FOR_DELIVERY", label: "Send out" },
  OUT_FOR_DELIVERY: { status: "DELIVERED", label: "Delivered" },
};

/** Short customer-facing line for where the order is. */
export const STATUS_NOTE = {
  PLACED: "We have your order and will confirm it shortly.",
  CONFIRMED: "Confirmed. We are packing your order.",
  OUT_FOR_DELIVERY: "On its way to you now.",
  DELIVERED: "Delivered. Enjoy!",
  CANCELLED: "This order was cancelled.",
};

export const LOW_STOCK = 5;

/**
 * Stock state for a product (or cart row). stock null means the product is
 * not tracked and is always available.
 */
export function stockState(stock) {
  if (stock === null || stock === undefined) {
    return { tracked: false, out: false, low: false, left: null };
  }
  const left = Math.max(0, Number(stock));
  return { tracked: true, out: left === 0, low: left > 0 && left <= LOW_STOCK, left };
}
