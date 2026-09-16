import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiCreditCard, FiLock, FiSmartphone } from "react-icons/fi";
import { api } from "../api/client";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import "./Payment.css";

const METHODS = [
  {
    id: "upi",
    icon: <FiSmartphone />,
    label: "UPI",
    hint: "GPay, PhonePe, Paytm and any UPI app",
  },
  {
    id: "card",
    icon: <FiCreditCard />,
    label: "Card",
    hint: "Credit, debit and net banking",
  },
];

function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const { items, total, loading, refresh } = useCart();

  const shipping = location.state?.shipping || {};

  const [method, setMethod] = useState("upi");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    if (!window.Razorpay) {
      setError("Payment library failed to load. Please refresh and try again.");
      return;
    }

    setError(null);
    setPaying(true);

    try {
      // The server decides the amount from the cart. There is no amount
      // parameter here, and this endpoint requires a login.
      const order = await api("/api/payment/create-order", {
        method: "POST",
        auth: true,
      });

      const rzp = new window.Razorpay({
        key: order.key, // publishable key, supplied by the backend
        amount: order.amount, // paise, server computed
        currency: order.currency,
        order_id: order.orderId,
        name: "Kamal Dairy",
        description: "Dairy order",
        theme: { color: "#0b3d2e" },

        prefill: {
          name: shipping.name || "",
          contact: shipping.phone || "",
          // Opens Razorpay's checkout on the method the customer picked,
          // instead of the radio buttons being purely decorative.
          method,
        },

        handler: async (response) => {
          try {
            // Hand the signed receipt back for verification. The backend checks
            // the HMAC signature against its Razorpay secret before creating an
            // order, so "payment done" is never just a claim the browser makes.
            await api("/api/orders/place", {
              method: "POST",
              auth: true,
              body: {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
            });

            await refresh();
            toast.success("Payment confirmed. Your order is on its way!");
            navigate("/orders");
          } catch (err) {
            setError(
              err.message ||
                "Payment went through but the order could not be confirmed. Please contact support."
            );
          } finally {
            setPaying(false);
          }
        },

        modal: { ondismiss: () => setPaying(false) },
      });

      rzp.on("payment.failed", (resp) => {
        setError(resp?.error?.description || "Payment failed. Please try again.");
        setPaying(false);
      });

      rzp.open();
    } catch (err) {
      if (err.status === 401) {
        navigate("/login");
        return;
      }
      setError(err.message);
      setPaying(false);
    }
  };

  return (
    <>
      <header className="page-head">
        <div className="kd-container">
          <ol className="steps" aria-label="Checkout progress">
            <li className="is-done"><span>1</span> Cart</li>
            <li className="is-done"><span>2</span> Delivery</li>
            <li className="is-current" aria-current="step"><span>3</span> Payment</li>
          </ol>

          <h1>Almost there</h1>
          <p>Choose how you would like to pay. You can review everything first.</p>
        </div>
      </header>

      <div className="kd-container page-body">
        {error && <p className="kd-alert">{error}</p>}

        <div className="pay">
          <div className="pay__main kd-panel">
            <h2>Payment method</h2>

            <div className="pay__methods" role="radiogroup" aria-label="Payment method">
              {METHODS.map((m) => (
                <label
                  key={m.id}
                  className={`pay__method ${method === m.id ? "is-selected" : ""}`}
                >
                  <input
                    type="radio"
                    name="method"
                    value={m.id}
                    checked={method === m.id}
                    onChange={(e) => setMethod(e.target.value)}
                  />

                  <span className="pay__method-icon" aria-hidden="true">
                    {m.icon}
                  </span>

                  <span className="pay__method-text">
                    <strong>{m.label}</strong>
                    <small>{m.hint}</small>
                  </span>

                  <span className="pay__radio" aria-hidden="true" />
                </label>
              ))}

              <div className="pay__method is-disabled">
                <span className="pay__method-icon" aria-hidden="true">💵</span>
                <span className="pay__method-text">
                  <strong>Cash on delivery</strong>
                  <small>Coming soon</small>
                </span>
              </div>
            </div>

            {shipping.address && (
              <div className="pay__ship">
                <h3>Delivering to</h3>
                <p>
                  {shipping.name} · {shipping.phone}
                  <br />
                  {shipping.address}, {shipping.city} {shipping.pincode}
                </p>
                <Link to="/checkout" className="pay__change">
                  Change address
                </Link>
              </div>
            )}
          </div>

          <aside className="pay__summary kd-panel">
            <h2>You pay</h2>

            <div className="pay__amount">
              <span>₹</span>
              {loading ? "—" : total.toFixed(2)}
            </div>

            <p className="pay__count">
              {items.length} {items.length === 1 ? "item" : "items"} · delivery free
            </p>

            <button
              className="kd-btn kd-btn--primary kd-btn--lg kd-btn--block"
              onClick={handlePayment}
              disabled={paying || loading || items.length === 0}
            >
              {paying ? (
                <>
                  <span className="kd-spinner" aria-hidden="true" />
                  Processing…
                </>
              ) : (
                `Pay ₹${total.toFixed(2)}`
              )}
            </button>

            <p className="pay__secure">
              <FiLock aria-hidden="true" />
              Secured by Razorpay. Card details never touch our servers.
            </p>
          </aside>
        </div>
      </div>
    </>
  );
}

export default Payment;
