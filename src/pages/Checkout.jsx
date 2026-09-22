import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";
import { getMyOrders, latestAddress } from "../api/orders";
import { useCart } from "../context/CartContext";
import "./Checkout.css";

const EMPTY = { name: "", phone: "", address: "", city: "", pincode: "" };
const FIELDS = Object.keys(EMPTY);

const isBlank = (f) => FIELDS.every((k) => !String(f[k] ?? "").trim());
const sameAs = (a, b) => Boolean(a && b) && FIELDS.every((k) => (a[k] ?? "") === (b[k] ?? ""));

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items, total, loading } = useCart();

  // Coming back from Payment ("Change address") keeps what was typed.
  const incoming = location.state?.shipping;

  const [form, setForm] = useState(() => ({ ...EMPTY, ...(incoming || {}) }));
  const [saved, setSaved] = useState(null);
  const [error, setError] = useState(null);

  // Returning customers: fill in the address from their last order. Only
  // ever fills an empty form, so it never overwrites what someone is typing.
  useEffect(() => {
    if (incoming) return undefined;
    let alive = true;

    getMyOrders()
      .then((orders) => {
        const last = latestAddress(orders);
        if (!alive || !last) return;
        setSaved(last);
        setForm((f) => (isBlank(f) ? last : f));
      })
      .catch(() => {
        // Prefill is a convenience. If it fails the form still works.
      });

    return () => {
      alive = false;
    };
  }, [incoming]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const shipping = Object.fromEntries(
      FIELDS.map((k) => [k, String(form[k] ?? "").trim().replace(/\s+/g, " ")])
    );

    navigate("/payment", { state: { shipping } });
  };

  const prefilled = sameAs(form, saved);

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

            {prefilled && (
              <p className="checkout__saved" role="status">
                <FiMapPin aria-hidden="true" />
                <span>Filled in from your last order.</span>
                <button type="button" onClick={() => setForm(EMPTY)}>
                  Use a different address
                </button>
              </p>
            )}

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
