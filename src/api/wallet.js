import { api } from "./client";

export const getWallet = () => api("/api/wallet", { auth: true });

export const getTransactions = (page = 0, size = 20) =>
  api(`/api/wallet/transactions?page=${page}&size=${size}`, { auth: true });

/** Step 1 of a top-up: the server creates a Razorpay order for this whole-rupee amount. */
export const createTopup = (amount) =>
  api("/api/wallet/topup", { method: "POST", auth: true, body: { amount } });

/** Step 2: the server verifies Razorpay's signature, then credits the wallet. */
export const verifyTopup = (receipt) =>
  api("/api/wallet/topup/verify", {
    method: "POST",
    auth: true,
    body: {
      razorpayOrderId: receipt.razorpay_order_id,
      razorpayPaymentId: receipt.razorpay_payment_id,
      razorpaySignature: receipt.razorpay_signature,
    },
  });

/** Pays the cart from the wallet. The delivery address travels with it. */
export const payCartWithWallet = (address) =>
  api("/api/orders/place-with-wallet", { method: "POST", auth: true, body: { address } });
