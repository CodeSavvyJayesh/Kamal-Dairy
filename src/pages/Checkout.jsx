import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import "./Checkout.css";

function Checkout() {

  const navigate = useNavigate();

  // The summary is loaded from the server rather than carried in router state,
  // so a page refresh no longer empties it and the figures always match what
  // the backend will actually charge.
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    navigate("/payment", { state: { shipping: form } });
  };

  if (loading) {
    return (
      <section className="checkout-page">
        <h1 className="checkout-title">Shipping Details</h1>
        <p style={{ textAlign: "center" }}>Loading...</p>
      </section>
    );
  }

  return (
    <section className="checkout-page">

      <h1 className="checkout-title">Shipping Details</h1>

      {error && (
        <p style={{ textAlign: "center", color: "#c0392b" }}>{error}</p>
      )}

      <div className="checkout-container">

        <form className="checkout-form" onSubmit={handleSubmit}>

          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            pattern="[0-9]{10}"
            title="10 digit phone number"
            required
          />

          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
          />

          <input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
            required
          />

          <input
            name="pincode"
            placeholder="Pincode"
            value={form.pincode}
            onChange={handleChange}
            pattern="[0-9]{6}"
            title="6 digit pincode"
            required
          />

          <button className="checkout-btn" disabled={cartItems.length === 0}>
            Continue to Payment
          </button>

        </form>

        <div className="order-summary">

          <h2>Order Summary</h2>

          {cartItems.map((item) => (
            <div key={item.id} className="summary-item">
              <span>{item.productName} x {item.quantity}</span>
              <span>Rs {item.price * item.quantity}</span>
            </div>
          ))}

          <hr />

          <div className="summary-total">
            <span>Total</span>
            <span>Rs {total}</span>
          </div>

        </div>

      </div>

    </section>
  );
}

export default Checkout;
