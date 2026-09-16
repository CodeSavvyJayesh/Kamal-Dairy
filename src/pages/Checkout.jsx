import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Checkout.css";

const EMPTY = { name: "", phone: "", address: "", city: "", pincode: "" };

function Checkout() {
  const navigate = useNavigate();
  const { items, total, loading } = useCart();

  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    navigate("/payment", { state: { shipping: form } });
  };

  return (
    <>
      <header className="page-head">
        <div className="kd-container">
          <ol className="steps" aria-label="Checkout progress">
            <li className="is-done">
              <span>1</span> Cart
            </li>
            <li className="is-current" aria-current="step">
              <span>2</span> Delivery
            </li>
            <li>
              <span>3</span> Payment
            </li>
          </ol>

          <h1>Where should we deliver?</h1>
          <p>We deliver across Mumbai, every day between 6 AM and 10 PM.</p>
        </div>
      </header>

      <div className="kd-container page-body">
        {error && <p className="kd-alert">{error}</p>}

        <div className="checkout">
          <form className="checkout__form kd-panel" onSubmit={handleSubmit}>
            <h2>Delivery details</h2>

            <div className="checkout__grid">
              <label className="kd-field checkout__full">
                <span className="kd-label">Full name</span>
                <input
                  className="kd-input"
                  name="name"
                  placeholder="Kavita Dhamal"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                />
              </label>

              <label className="kd-field">
                <span className="kd-label">Phone number</span>
                <input
                  className="kd-input"
                  name="phone"
                  inputMode="numeric"
                  placeholder="10-digit mobile"
                  value={form.phone}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  title="10 digit phone number"
                  autoComplete="tel-national"
                  required
                />
              </label>

              <label className="kd-field">
                <span className="kd-label">Pincode</span>
                <input
                  className="kd-input"
                  name="pincode"
                  inputMode="numeric"
                  placeholder="400002"
                  value={form.pincode}
                  onChange={handleChange}
                  pattern="[0-9]{6}"
                  title="6 digit pincode"
                  autoComplete="postal-code"
                  required
                />
              </label>

              <label className="kd-field checkout__full">
                <span className="kd-label">Address</span>
                <input
                  className="kd-input"
                  name="address"
                  placeholder="Flat, building, street, landmark"
                  value={form.address}
                  onChange={handleChange}
                  autoComplete="street-address"
                  required
                />
              </label>

              <label className="kd-field checkout__full">
                <span className="kd-label">City</span>
                <input
                  className="kd-input"
                  name="city"
                  placeholder="Mumbai"
                  value={form.city}
                  onChange={handleChange}
                  autoComplete="address-level2"
                  required
                />
              </label>
            </div>

            <button
              className="kd-btn kd-btn--primary kd-btn--lg kd-btn--block"
              disabled={loading || items.length === 0}
            >
              Continue to payment
            </button>
          </form>

          <aside className="checkout__summary kd-panel">
            <h2>Order summary</h2>

            {loading ? (
              <div className="checkout__skel">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div className="kd-skel checkout__skel-line" key={i} />
                ))}
              </div>
            ) : items.length === 0 ? (
              <>
                <p className="checkout__empty">Your cart is empty.</p>
                <Link to="/products" className="kd-btn kd-btn--outline kd-btn--block">
                  Browse products
                </Link>
              </>
            ) : (
              <>
                <ul className="checkout__items">
                  {items.map((item) => (
                    <li key={item.id}>
                      <span className="checkout__item-name">
                        {item.productName}
                        <em>× {item.quantity}</em>
                      </span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>

                <div className="checkout__total">
                  <span>Total</span>
                  <strong>₹{total.toFixed(2)}</strong>
                </div>

                <Link to="/cart" className="checkout__edit">
                  Edit cart
                </Link>
              </>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}

export default Checkout;
