import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import "./Payment.css";

function Payment() {

  const navigate = useNavigate();
  const location = useLocation();

  const shipping = location.state?.shipping || {};

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [method, setMethod] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await api("/api/cart", { auth: true });
        setCartItems(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.status === 401) {
          navigate("/login");
          return;
        }
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePayment = async () => {

    if (!method) {
      setError("Please select a payment method.");
      return;
    }

    if (!window.Razorpay) {
      setError("Payment library failed to load. Please refresh and try again.");
      return;
    }

    setError(null);
    setPaying(true);

    try {

      // The server decides the amount from the cart. There is no amount
      // parameter here any more, and this endpoint now requires a login.
      const order = await api("/api/payment/create-order", {
        method: "POST",
        auth: true,
      });

      const options = {
        key: order.key,              // publishable key, supplied by the backend
        amount: order.amount,        // paise, server computed
        currency: order.currency,
        name: "Kamal Dairy",
        description: "Dairy order",
        order_id: order.orderId,

        prefill: {
          name: shipping.name || "",
          contact: shipping.phone || "",
        },

        handler: async (response) => {
          try {
            // Hand the signed receipt back for verification. The backend checks
            // the HMAC signature against its Razorpay secret before it will
            // create an order, so "payment done" is no longer just a claim
            // the browser makes.
            await api("/api/orders/place", {
              method: "POST",
              auth: true,
              body: {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              },
            });

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

        modal: {
          ondismiss: () => setPaying(false),
        },
      };

      const rzp = new window.Razorpay(options);

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

  if (loading) {
    return (
      <section className="payment-page">
        <h1>Payment</h1>
        <p style={{ textAlign: "center" }}>Loading...</p>
      </section>
    );
  }

  return (
    <section className="payment-page">

      <h1>Payment</h1>

      <h2 className="pay-total">Total: Rs {total}</h2>

      {error && (
        <p style={{ textAlign: "center", color: "#c0392b" }}>{error}</p>
      )}

      <div className="payment-box">

        <label>
          <input
            type="radio"
            name="method"
            value="upi"
            checked={method === "upi"}
            onChange={(e) => setMethod(e.target.value)}
          />
          UPI Payment
        </label>

        <label>
          <input
            type="radio"
            name="method"
            value="card"
            checked={method === "card"}
            onChange={(e) => setMethod(e.target.value)}
          />
          Credit / Debit Card
        </label>

        {/* Cash on Delivery is intentionally not offered yet. The old page
            listed it but still routed the customer through Razorpay, which
            charged them online while telling them they were paying on delivery. */}
        <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>
          Cash on Delivery is coming soon.
        </p>

        <button
          onClick={handlePayment}
          disabled={paying || cartItems.length === 0}
        >
          {paying ? "Processing..." : `Pay Rs ${total}`}
        </button>

      </div>

    </section>
  );
}

export default Payment;
