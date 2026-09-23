import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiCheck, FiDownload, FiMapPin, FiRotateCcw, FiStar, FiTruck, FiX } from "react-icons/fi";
import { cancelOrder, downloadInvoice, getMyOrders, hasInvoice } from "../api/orders";
import { getMyReviews } from "../api/reviews";
import Modal from "../components/Modal";
import ReviewForm from "../components/ReviewForm";
import { Stars } from "../components/Stars";
import { StatusBadge } from "../components/SubscriptionBits";
import { useToast } from "../context/ToastContext";
import { useWallet } from "../context/useWallet";
import { formatDateTime, rupees } from "../utils/format";
import { ORDER_STEPS, STATUS_NOTE, isOpenOrder, stepIndex } from "../utils/orders";
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

const CANCEL_REASONS = ["Ordered by mistake", "Need it at a different address", "Ordered twice", "Other"];

/** Four-step progress: placed, confirmed, out for delivery, delivered. */
function Tracker({ order }) {
  const current = stepIndex(order);

  return (
    <ol className="track" aria-label={`Order status: ${order.statusLabel || order.status}`}>
      {ORDER_STEPS.map((step, i) => {
        const done = i < current || (i === current && order.status === "DELIVERED");
        const now = i === current && order.status !== "DELIVERED";
        const at = order[step.at];

        return (
          <li
            key={step.status}
            className={`track__step ${done ? "is-done" : ""} ${now ? "is-now" : ""}`}
            aria-current={now ? "step" : undefined}
          >
            <span className="track__dot" aria-hidden="true">
              {done ? <FiCheck /> : step.status === "OUT_FOR_DELIVERY" && now ? <FiTruck /> : null}
            </span>
            <span className="track__label">{step.label}</span>
            {at && (done || now) && <span className="track__time">{formatDateTime(at)}</span>}
          </li>
        );
      })}
    </ol>
  );
}

function Orders() {
  const navigate = useNavigate();
  const toast = useToast();
  const { refresh: refreshWallet } = useWallet();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [cancelling, setCancelling] = useState(null);
  const [reason, setReason] = useState(CANCEL_REASONS[0]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  // Holds the id of the order whose invoice is being fetched, not a boolean:
  // only that row's button should show as working.
  const [downloading, setDownloading] = useState(null);

  // productId -> the customer's review, for the "How was it?" buttons.
  const [myReviews, setMyReviews] = useState({});
  const [reviewing, setReviewing] = useState(null);

  const loadMyReviews = () =>
    getMyReviews()
      .then((list) => setMyReviews(Object.fromEntries((list || []).map((r) => [r.productId, r]))))
      .catch(() => {});

  useEffect(() => {
    loadMyReviews();
  }, []);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const data = await getMyOrders();
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

  const openCancel = (order) => {
    setReason(CANCEL_REASONS[0]);
    setNote("");
    setCancelling(order);
  };

  /**
   * Saves the invoice PDF. The button is per order, so the busy flag holds an
   * order id rather than a boolean - two orders can be asked for at once and
   * only the one being fetched shows as working.
   */
  const saveInvoice = async (order) => {
    setDownloading(order.id);
    try {
      const { invoiceNumber } = await downloadInvoice(order.id);
      toast.success(
        invoiceNumber ? `Invoice ${invoiceNumber} downloaded` : "Proforma invoice downloaded"
      );
    } catch (err) {
      if (err.status === 401) {
        navigate("/login");
        return;
      }
      toast.error(err.message);
    } finally {
      setDownloading(null);
    }
  };

  const confirmCancel = async () => {
    const target = cancelling;
    const why = reason === "Other" ? note.trim() || "Other" : reason;

    setBusy(true);
    try {
      const updated = await cancelOrder(target.id, why);
      setOrders((list) => list.map((o) => (o.id === updated.id ? updated : o)));
      setCancelling(null);
      toast.success(
        updated.refundedAmount
          ? `Order #${updated.id} cancelled. ${rupees(updated.refundedAmount)} is back in your wallet.`
          : `Order #${updated.id} cancelled.`
      );
      refreshWallet();
    } catch (err) {
      if (err.status === 401) {
        navigate("/login");
        return;
      }
      toast.error(err.message);
      // The dairy may have confirmed it meanwhile: show the real state.
      if (err.status === 409) {
        getMyOrders()
          .then((data) => setOrders(Array.isArray(data) ? data : []))
          .catch(() => {});
        setCancelling(null);
      }
    } finally {
      setBusy(false);
    }
  };

  // Newest first — the API returns insertion order.
  const sorted = [...orders].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
  const active = sorted.filter(isOpenOrder).length;

  return (
    <>
      <header className="page-head">
        <div className="kd-container">
          <span className="kd-eyebrow">Order history</span>
          <h1>My orders</h1>
          <p>
            {active > 0
              ? `${active} ${active === 1 ? "order is" : "orders are"} on the way. Track each one below.`
              : "Everything you have ordered, with what was in it and where it went."}
          </p>
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
              const count = (order.items || []).reduce((n, i) => n + (i.quantity || 0), 0);
              const cancelled = order.status === "CANCELLED";

              return (
                <article className={`order kd-card ${cancelled ? "is-cancelled" : ""}`} key={order.id}>
                  <header className="order__head">
                    <div>
                      <h2>Order #{order.id}</h2>
                      {date && <p className="order__date">{date}</p>}
                    </div>

                    <StatusBadge status={order.status} label={order.statusLabel} />
                  </header>

                  {cancelled ? (
                    <div className="order__cancelled">
                      <FiRotateCcw aria-hidden="true" />
                      <div>
                        <strong>
                          Cancelled {order.cancelledBy === "CUSTOMER" ? "by you" : "by Kamal Dairy"}
                          {order.cancelledAt && ` · ${formatDateTime(order.cancelledAt)}`}
                        </strong>
                        {order.cancelReason && <span>{order.cancelReason}</span>}
                        {order.refundedAmount > 0 && (
                          <span>
                            {rupees(order.refundedAmount)} refunded to your{" "}
                            <Link to="/wallet">Kamal Wallet</Link>
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
                      <Tracker order={order} />
                      {STATUS_NOTE[order.status] && (
                        <p className="order__note">{STATUS_NOTE[order.status]}</p>
                      )}
                    </>
                  )}

                  <ul className="order__items">
                    {(order.items || []).map((item) => (
                      <li key={item.id}>
                        <span className="order__item-name">
                          {item.productId ? (
                            <Link to={`/product/${item.productId}`}>{item.productName}</Link>
                          ) : (
                            item.productName
                          )}
                        </span>
                        <span className="order__item-qty">× {item.quantity}</span>
                        <span className="order__item-price">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {order.status === "DELIVERED" && (
                    <div className="order__rate">
                      <span className="order__rate-label">How was it?</span>
                      {[...new Map((order.items || []).filter((i) => i.productId).map((i) => [i.productId, i])).values()].map(
                        (item) => {
                          const mine = myReviews[item.productId];
                          return (
                            <button
                              key={item.productId}
                              type="button"
                              className={`order__rate-btn ${mine ? "is-done" : ""}`}
                              onClick={() => setReviewing(item)}
                              aria-label={mine ? `Edit your review of ${item.productName}` : `Rate ${item.productName}`}
                            >
                              {mine ? <Stars value={mine.rating} size="sm" /> : <FiStar aria-hidden="true" />}
                              <span>{mine ? item.productName : `Rate ${item.productName}`}</span>
                            </button>
                          );
                        }
                      )}
                    </div>
                  )}

                  {order.deliveryAddress && (
                    <div className="order__ship">
                      <FiMapPin aria-hidden="true" />
                      <p>
                        <span className="order__ship-label">
                          {order.status === "DELIVERED" ? "Delivered to" : "Delivering to"}
                        </span>
                        <strong>{order.deliveryName}</strong> · {order.deliveryPhone}
                        <br />
                        {order.deliveryAddress}, {order.deliveryCity} {order.deliveryPincode}
                      </p>
                    </div>
                  )}

                  <footer className="order__foot">
                    <span className="order__count">
                      {count} {count === 1 ? "item" : "items"} ·{" "}
                      {order.paymentMethod === "WALLET" ? "Paid from wallet" : "Paid online"}
                    </span>

                    <div className="order__foot-right">
                      {hasInvoice(order) && (
                        <button
                          className="kd-btn kd-btn--ghost kd-btn--sm order__invoice"
                          onClick={() => saveInvoice(order)}
                          disabled={downloading === order.id}
                          title={
                            order.invoiceNo
                              ? `Tax invoice ${order.invoiceNo}`
                              : "A proforma until the order is delivered"
                          }
                        >
                          <FiDownload aria-hidden="true" />
                          {downloading === order.id
                            ? "Preparing…"
                            : order.invoiceNo
                              ? "Invoice"
                              : "Proforma"}
                        </button>
                      )}
                      {order.cancellable && (
                        <button
                          className="kd-btn kd-btn--ghost kd-btn--sm order__cancel"
                          onClick={() => openCancel(order)}
                        >
                          <FiX aria-hidden="true" /> Cancel order
                        </button>
                      )}
                      <span className="order__total">
                        Total <strong>₹{Number(order.totalAmount).toFixed(2)}</strong>
                      </span>
                    </div>
                  </footer>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        open={Boolean(reviewing)}
        title={reviewing && myReviews[reviewing.productId] ? "Edit your review" : "Rate your purchase"}
        size="md"
        onClose={() => setReviewing(null)}
      >
        {reviewing && (
          <ReviewForm
            key={reviewing.productId}
            productId={reviewing.productId}
            productName={reviewing.productName}
            existing={myReviews[reviewing.productId] ?? null}
            onSaved={() => {
              setReviewing(null);
              loadMyReviews();
            }}
            onDeleted={() => {
              setReviewing(null);
              loadMyReviews();
            }}
            onCancel={() => setReviewing(null)}
          />
        )}
      </Modal>

      <Modal
        open={Boolean(cancelling)}
        title={cancelling ? `Cancel order #${cancelling.id}?` : ""}
        size="sm"
        onClose={() => !busy && setCancelling(null)}
        footer={
          <>
            <button className="kd-btn kd-btn--ghost" onClick={() => setCancelling(null)} disabled={busy}>
              Keep order
            </button>
            <button className="kd-btn kd-btn--danger" onClick={confirmCancel} disabled={busy}>
              {busy ? "Cancelling…" : "Cancel order"}
            </button>
          </>
        }
      >
        {cancelling && (
          <>
            <p className="order__modal-lead">
              {rupees(cancelling.totalAmount)} goes straight back to your{" "}
              <strong>Kamal Wallet</strong>, ready for your next order or subscription.
            </p>

            <fieldset className="order__reasons">
              <legend className="kd-label">Why are you cancelling?</legend>
              {CANCEL_REASONS.map((r) => (
                <label key={r} className={`order__reason ${reason === r ? "is-on" : ""}`}>
                  <input
                    type="radio"
                    name="cancel-reason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                  />
                  {r}
                </label>
              ))}
            </fieldset>

            {reason === "Other" && (
              <label className="kd-field">
                <span className="kd-label">Tell us more (optional)</span>
                <input
                  className="kd-input"
                  value={note}
                  maxLength={200}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Anything we should know"
                />
              </label>
            )}
          </>
        )}
      </Modal>
    </>
  );
}

export default Orders;
