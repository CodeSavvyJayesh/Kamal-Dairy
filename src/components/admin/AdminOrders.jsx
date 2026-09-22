import { useCallback, useEffect, useState } from "react";
import { FiAlertTriangle, FiArrowRight, FiPrinter, FiRefreshCw, FiX } from "react-icons/fi";
import {
  adminCancelOrder,
  advanceOrder,
  getAdminOrderStats,
  getAdminOrders,
} from "../../api/orders";
import { useToast } from "../../context/ToastContext";
import { formatDateTime, rupees } from "../../utils/format";
import { NEXT_ACTION, isOpenOrder } from "../../utils/orders";
import Modal from "../Modal";
import { StatusBadge } from "../SubscriptionBits";
import "./AdminSubscriptions.css";
import "./AdminOrders.css";

const PAGE_SIZE = 20;

const FILTERS = [
  { key: "OPEN", label: "To do", count: (s) => s.open },
  { key: "PLACED", label: "New", count: (s) => s.placed },
  { key: "CONFIRMED", label: "Confirmed", count: (s) => s.confirmed },
  { key: "OUT_FOR_DELIVERY", label: "Out for delivery", count: (s) => s.outForDelivery },
  { key: "DELIVERED", label: "Delivered", count: (s) => s.delivered },
  { key: "CANCELLED", label: "Cancelled", count: (s) => s.cancelled },
  { key: "ALL", label: "All", count: () => null },
];

/**
 * Order desk: what needs doing, one button to move each order on, and a
 * cancel that refunds the customer's wallet and restocks the shelf.
 */
function AdminOrders({ onError, onLowStock }) {
  const toast = useToast();

  const [filter, setFilter] = useState("OPEN");
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  const [cancelling, setCancelling] = useState(null);
  const [reason, setReason] = useState("");

  const loadStats = useCallback(async () => {
    try {
      setStats(await getAdminOrderStats());
    } catch (err) {
      onError(err);
    }
  }, [onError]);

  const load = useCallback(
    async (p) => {
      setLoading(true);
      try {
        const data = await getAdminOrders(p, PAGE_SIZE, filter);
        setOrders((list) => (p === 0 ? data.content : [...list, ...data.content]));
        setHasMore(!data.last);
        setTotal(data.totalElements);
        setPage(p);
      } catch (err) {
        onError(err);
      } finally {
        setLoading(false);
      }
    },
    [onError, filter]
  );

  useEffect(() => {
    load(0);
  }, [load]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const refreshAll = () => {
    load(0);
    loadStats();
  };

  // Replace the row in place; drop it if it no longer matches the filter.
  const applyUpdate = (updated) => {
    const stillMatches =
      filter === "ALL" ||
      (filter === "OPEN" ? isOpenOrder(updated) : updated.status === filter);
    setOrders((list) =>
      stillMatches
        ? list.map((o) => (o.id === updated.id ? updated : o))
        : list.filter((o) => o.id !== updated.id)
    );
    if (!stillMatches) setTotal((t) => Math.max(0, t - 1));
    loadStats();
  };

  const move = async (order) => {
    const next = NEXT_ACTION[order.status];
    if (!next) return;

    setBusy(order.id);
    try {
      const updated = await advanceOrder(order.id, next.status);
      applyUpdate(updated);
      toast.success(`Order #${order.id} · ${updated.statusLabel}`);
    } catch (err) {
      toast.error(err.message);
      if (err.status === 409) refreshAll();
    } finally {
      setBusy(null);
    }
  };

  const confirmCancel = async () => {
    const target = cancelling;
    setBusy(target.id);
    try {
      const updated = await adminCancelOrder(target.id, reason.trim());
      applyUpdate(updated);
      setCancelling(null);
      toast.success(`Order #${target.id} cancelled · ${rupees(updated.refundedAmount || 0)} refunded`);
      onLowStock?.();
    } catch (err) {
      toast.error(err.message);
      if (err.status === 409) {
        setCancelling(null);
        refreshAll();
      }
    } finally {
      setBusy(null);
    }
  };

  const current = FILTERS.find((f) => f.key === filter);

  return (
    <div className="asubs aorders">
      <div className="admin__stats asubs__stats">
        <div className="admin__stat kd-card aorders__stat--hot">
          <strong>{stats?.placed ?? "–"}</strong>
          <span>New, to confirm</span>
        </div>
        <div className="admin__stat kd-card">
          <strong>{stats?.confirmed ?? "–"}</strong>
          <span>Confirmed, to pack</span>
        </div>
        <div className="admin__stat kd-card">
          <strong>{stats?.outForDelivery ?? "–"}</strong>
          <span>Out for delivery</span>
        </div>
        <div className="admin__stat kd-card">
          <strong>{stats?.delivered ?? "–"}</strong>
          <span>Delivered</span>
        </div>
        <div className={`admin__stat kd-card ${stats?.lowStockProducts ? "aorders__stat--warn" : ""}`}>
          <strong>{stats?.lowStockProducts ?? "–"}</strong>
          <span>Products low on stock</span>
        </div>
      </div>

      <section className="kd-panel asubs__panel">
        <header className="asubs__head">
          <div>
            <h2>{current?.label === "To do" ? "Orders to handle" : `${current?.label} orders`}</h2>
            <p>
              {total} {total === 1 ? "order" : "orders"} · newest first
            </p>
          </div>

          <div className="asubs__tools">
            <button
              className="kd-btn kd-btn--ghost kd-btn--sm"
              onClick={refreshAll}
              disabled={loading}
              aria-label="Refresh"
            >
              <FiRefreshCw aria-hidden="true" />
            </button>
            <button className="kd-btn kd-btn--ghost kd-btn--sm" onClick={() => window.print()}>
              <FiPrinter aria-hidden="true" /> Print
            </button>
          </div>
        </header>

        <div className="aorders__filters asubs__no-print" role="tablist" aria-label="Filter orders">
          {FILTERS.map((f) => {
            const n = stats ? f.count(stats) : null;
            return (
              <button
                key={f.key}
                role="tab"
                aria-selected={filter === f.key}
                className={`bchip ${filter === f.key ? "is-on" : ""}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
                {n !== null && n !== undefined && <span className="aorders__count">{n}</span>}
              </button>
            );
          })}
        </div>

        {loading && orders.length === 0 ? (
          <div className="asubs__skel">
            {Array.from({ length: 4 }).map((_, i) => (
              <div className="kd-skel" key={i} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="asubs__empty">
            <span aria-hidden="true">{filter === "OPEN" ? "🎉" : "📦"}</span>
            <p>{filter === "OPEN" ? "Nothing waiting. Every order is handled." : "No orders here."}</p>
          </div>
        ) : (
          <div className="asubs__table-wrap">
            <table className="asubs__table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Deliver to</th>
                  <th>Items</th>
                  <th className="num">Paid</th>
                  <th>Status</th>
                  <th className="asubs__no-print">
                    <span className="kd-sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const next = NEXT_ACTION[o.status];
                  return (
                    <tr key={o.id} className={o.status === "PLACED" ? "aorders__row--new" : ""}>
                      <td>
                        <strong>#{o.id}</strong>
                        <small>{formatDateTime(o.createdAt)}</small>
                      </td>

                      <td>
                        <strong>{o.deliveryName || "–"}</strong>
                        {o.deliveryPhone && (
                          <small>
                            <a href={`tel:${o.deliveryPhone}`}>{o.deliveryPhone}</a>
                          </small>
                        )}
                        <small className="aorders__email">{o.userEmail}</small>
                      </td>

                      <td className="asubs__addr">
                        {o.deliveryAddress ? (
                          <>
                            {o.deliveryAddress}, {o.deliveryCity}
                            <small className="aorders__pin">{o.deliveryPincode}</small>
                          </>
                        ) : (
                          <small>No address – placed before addresses were saved</small>
                        )}
                      </td>

                      <td>
                        <ul className="aorders__items">
                          {(o.items || []).map((i) => (
                            <li key={i.id}>
                              {i.productName} <b>× {i.quantity}</b>
                            </li>
                          ))}
                        </ul>
                      </td>

                      <td className="num">
                        <strong>{rupees(o.totalAmount)}</strong>
                        <small>{o.paymentMethod === "WALLET" ? "Wallet" : "Razorpay"}</small>
                      </td>

                      <td>
                        <StatusBadge status={o.status} label={o.statusLabel} />
                        {o.status === "CANCELLED" && (
                          <small className="aorders__why">
                            {o.cancelledBy === "CUSTOMER" ? "By customer" : "By you"}
                            {o.cancelReason ? ` · ${o.cancelReason}` : ""}
                          </small>
                        )}
                      </td>

                      <td className="asubs__actions asubs__no-print">
                        {next && (
                          <button
                            className="kd-btn kd-btn--primary kd-btn--sm"
                            onClick={() => move(o)}
                            disabled={busy === o.id}
                          >
                            {next.label} <FiArrowRight aria-hidden="true" />
                          </button>
                        )}
                        {isOpenOrder(o) && (
                          <button
                            className="kd-btn kd-btn--ghost kd-btn--sm"
                            onClick={() => {
                              setReason("");
                              setCancelling(o);
                            }}
                            disabled={busy === o.id}
                            aria-label={`Cancel order ${o.id}`}
                            title="Cancel and refund"
                          >
                            <FiX aria-hidden="true" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {hasMore && (
          <button
            className="kd-btn kd-btn--ghost kd-btn--sm aorders__more asubs__no-print"
            onClick={() => load(page + 1)}
            disabled={loading}
          >
            {loading ? "Loading…" : "Show older"}
          </button>
        )}
      </section>

      <Modal
        open={Boolean(cancelling)}
        title={cancelling ? `Cancel order #${cancelling.id}?` : ""}
        size="sm"
        tone="danger"
        onClose={() => busy === null && setCancelling(null)}
        footer={
          <>
            <button className="kd-btn kd-btn--ghost" onClick={() => setCancelling(null)} disabled={busy !== null}>
              Back
            </button>
            <button className="kd-btn kd-btn--danger" onClick={confirmCancel} disabled={busy !== null}>
              Cancel and refund {cancelling ? rupees(cancelling.totalAmount) : ""}
            </button>
          </>
        }
      >
        {cancelling && (
          <>
            <p className="aorders__warn">
              <FiAlertTriangle aria-hidden="true" />
              <span>
                {rupees(cancelling.totalAmount)} goes back to{" "}
                <strong>{cancelling.deliveryName || cancelling.userEmail}</strong>'s Kamal Wallet at once,
                the items return to stock, and they get an email.
              </span>
            </p>
            <label className="kd-field">
              <span className="kd-label">Reason the customer will see</span>
              <input
                className="kd-input"
                value={reason}
                maxLength={200}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Paneer batch did not pass our quality check"
              />
            </label>
          </>
        )}
      </Modal>
    </div>
  );
}

export default AdminOrders;
