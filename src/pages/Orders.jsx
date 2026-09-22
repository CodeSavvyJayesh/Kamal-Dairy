import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMapPin } from "react-icons/fi";
import { api } from "../api/client";
import "./Orders.css";

function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;

  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const data = await api("/api/orders/my-orders", { auth: true });
        if (alive) setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.status === 401) {
          navigate("/login");
          return;
        }
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [navigate]);

  // Newest first — the API returns insertion order.
  const sorted = [...orders].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));

  return (
    <>
      <header className="page-head">
        <div className="kd-container">
          <span className="kd-eyebrow">Order history</span>
          <h1>My orders</h1>
          <p>Everything you have ordered, with what was in it and what it cost.</p>
        </div>
      </header>

      <div className="kd-container page-body">
        {error && <p className="kd-alert">{error}</p>}

        {loading ? (
          <div className="orders">
            {Array.from({ length: 2 }).map((_, i) => (
              <div className="kd-card orders__skel" key={i}>
                <div className="kd-skel orders__skel-line orders__skel-line--sm" />
                <div className="kd-skel orders__skel-line" />
                <div className="kd-skel orders__skel-line" />
              </div>
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <div className="kd-empty">
            <div className="kd-empty__icon">📦</div>
            <h2>No orders yet</h2>
            <p>When you place your first order it will show up right here.</p>
            <Link to="/products" className="kd-btn kd-btn--primary kd-btn--lg">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="orders">
            {sorted.map((order) => {
              const date = formatDate(order.createdAt);
              const count = (order.items || []).reduce(
                (n, i) => n + (i.quantity || 0),
                0
              );

              return (
                <article className="order kd-card" key={order.id}>
                  <header className="order__head">
                    <div>
                      <h2>Order #{order.id}</h2>
                      {date && <p className="order__date">{date}</p>}
                    </div>

                    <span className="kd-badge order__status">
                      <span className="order__dot" aria-hidden="true" />
                      {order.paymentMethod === "WALLET" ? "Paid · Wallet" : "Paid"}
                    </span>
                  </header>

                  <ul className="order__items">
                    {(order.items || []).map((item) => (
                      <li key={item.id}>
                        <span className="order__item-name">{item.productName}</span>
                        <span className="order__item-qty">× {item.quantity}</span>
                        <span className="order__item-price">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {order.deliveryAddress && (
                    <div className="order__ship">
                      <FiMapPin aria-hidden="true" />
                      <p>
                        <span className="order__ship-label">Delivering to</span>
                        <strong>{order.deliveryName}</strong> · {order.deliveryPhone}
                        <br />
                        {order.deliveryAddress}, {order.deliveryCity} {order.deliveryPincode}
                      </p>
                    </div>
                  )}

                  <footer className="order__foot">
                    <span className="order__count">
                      {count} {count === 1 ? "item" : "items"}
                    </span>

                    <span className="order__total">
                      Total <strong>₹{Number(order.totalAmount).toFixed(2)}</strong>
                    </span>
                  </footer>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default Orders;
