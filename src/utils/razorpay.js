/**
 * Opens Razorpay Checkout for an order created by our backend and resolves
 * with Razorpay's signed receipt ({ razorpay_order_id, razorpay_payment_id,
 * razorpay_signature }). The receipt must be sent back to the server for
 * verification - resolving here proves nothing on its own.
 *
 * Why a failed attempt does NOT reject: Razorpay keeps its modal open after a
 * failure so the customer can retry. If we rejected on the first failure, a
 * successful retry would land in an already-settled promise and the money
 * would be taken without the wallet ever being credited. So failures are
 * remembered, and the promise only rejects when the customer closes the modal.
 */
export function openRazorpay({ order, description, prefill = {} }) {
  return new Promise((resolve, reject) => {
    if (!window.Razorpay) {
      reject(new Error("Payment library failed to load. Please refresh and try again."));
      return;
    }

    let lastError = null;
    let settled = false;

    const rzp = new window.Razorpay({
      key: order.key,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: "Kamal Dairy",
      description,
      theme: { color: "#0b3d2e" },
      prefill,

      handler: (response) => {
        settled = true;
        resolve(response);
      },

      modal: {
        ondismiss: () => {
          if (settled) return;
          const err = new Error(lastError || "Payment cancelled.");
          err.cancelled = !lastError;
          reject(err);
        },
      },
    });

    rzp.on("payment.failed", (resp) => {
      lastError = resp?.error?.description || "Payment failed. Please try again.";
    });

    rzp.open();
  });
}
