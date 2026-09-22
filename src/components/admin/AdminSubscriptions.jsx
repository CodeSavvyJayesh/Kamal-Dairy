import { useCallback, useEffect, useState } from "react";
import { FiCheck, FiPrinter, FiRefreshCw, FiRotateCcw, FiZap } from "react-icons/fi";
import {
  getAdminStats,
  getDispatch,
  markDelivered,
  refundDelivery,
  runGeneration,
} from "../../api/subscriptions";
import { useToast } from "../../context/ToastContext";
import { addDays, formatDay, hourLabel, rupees, rupeesShort, todayISO } from "../../utils/format";
import Modal from "../Modal";
import { StatusBadge } from "../SubscriptionBits";
import "./AdminSubscriptions.css";

/**
 * Operations desk: what goes out tomorrow, what went out today, and the
 * two actions an operator needs - confirm a delivery, or refund one.
 */
function AdminSubscriptions({ onError }) {
  const toast = useToast();

  const [stats, setStats] = useState(null);
  const [date, setDate] = useState(addDays(todayISO(), 1));
  const [dispatch, setDispatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);
  const [refunding, setRefunding] = useState(null);
  const [reason, setReason] = useState("");

  const today = todayISO();
  const tomorrow = addDays(today, 1);

  const loadStats = useCallback(async () => {
    try {
      setStats(await getAdminStats());
    } catch (err) {
      onError(err);
    }
  }, [onError]);

  const loadDispatch = useCallback(
    async (d) => {
      setLoading(true);
      try {
        setDispatch(await getDispatch(d));
      } catch (err) {
        onError(err);
      } finally {
        setLoading(false);
      }
    },
    [onError]
  );

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadDispatch(date);
  }, [date, loadDispatch]);

  const pastCutoff = stats ? new Date().getHours() >= stats.cutoffHour : false;
  const canGenerate =
    dispatch && !dispatch.generated && (date === today || (date === tomorrow && pastCutoff));

  const generate = async () => {
    setBusy("run");
    try {
      const r = await runGeneration(date);
      toast.success(
        r.ran
          ? `Generated ${formatDay(date)}: ${r.charged} charged, ${r.missedLowBalance + r.missedUnavailable} missed`
          : `${formatDay(date)} was already generated`
      );
      await Promise.all([loadDispatch(date), loadStats()]);
    } catch (err) {
      onError(err);
    } finally {
      setBusy(null);
    }
  };

  const deliver = async (row) => {
    setBusy(row.id);
    try {
      await markDelivered(row.id);
      toast.success(`${row.customerName}'s ${row.productName} marked delivered`);
      await loadDispatch(date);
    } catch (err) {
      onError(err);
    } finally {
      setBusy(null);
    }
  };

  const confirmRefund = async () => {
    const row = refunding;
    setBusy(row.id);
    try {
      await refundDelivery(row.id, reason.trim());
      toast.success(`${rupees(row.amount)} refunded to ${row.customerName}'s wallet`);
      setRefunding(null);
      setReason("");
      await Promise.all([loadDispatch(date), loadStats()]);
    } catch (err) {
      onError(err);
    } finally {
      setBusy(null);
    }
  };

  const groups = ["MORNING", "EVENING"]
    .map((slot) => ({
      slot,
      rows: (dispatch?.deliveries ?? []).filter((d) => d.slot === slot),
    }))
    .filter((g) => g.rows.length > 0);

  return (
    <div className="asubs">
      <div className="admin__stats asubs__stats">
        <div className="admin__stat kd-card">
          <strong>{stats?.activeSubscriptions ?? "—"}</strong>
          <span>Active subscriptions</span>
        </div>
        <div className="admin__stat kd-card">
          <strong>{stats?.tomorrowDeliveries ?? "—"}</strong>
          <span>
            Tomorrow · {stats ? rupeesShort(stats.tomorrowRevenue) : "—"}
            {stats && !stats.tomorrowGenerated ? " (projected)" : ""}
          </span>
        </div>
        <div className="admin__stat kd-card">
          <strong>{stats ? rupeesShort(Math.round(stats.monthlyRecurringRevenue)) : "—"}</strong>
          <span>Monthly recurring</span>
        </div>
        <div className="admin__stat kd-card">
          <strong>{stats ? rupeesShort(Math.round(stats.walletFloat)) : "—"}</strong>
          <span>Held in wallets</span>
        </div>
        <div className="admin__stat kd-card">
          <strong>{stats?.pausedSubscriptions ?? "—"}</strong>
          <span>Paused</span>
        </div>
      </div>

      <section className="kd-panel asubs__panel">
        <header className="asubs__head">
          <div>
            <h2>Dispatch sheet</h2>
            <p>
              {formatDay(date, { weekday: "long", day: "numeric", month: "long" })} ·{" "}
              {dispatch?.generated
                ? "generated and charged"
                : `generates at ${hourLabel(stats?.cutoffHour ?? 23)} the night before`}
            </p>
          </div>

          <div className="asubs__tools">
            <div className="asubs__quick" role="group" aria-label="Date">
              <button className={`bchip ${date === today ? "is-on" : ""}`} onClick={() => setDate(today)}>
                Today
              </button>
              <button className={`bchip ${date === tomorrow ? "is-on" : ""}`} onClick={() => setDate(tomorrow)}>
                Tomorrow
              </button>
            </div>
            <input
              className="kd-input asubs__date"
              type="date"
              value={date}
              onChange={(e) => e.target.value && setDate(e.target.value)}
              aria-label="Pick a date"
            />
            <button className="kd-btn kd-btn--ghost kd-btn--sm" onClick={() => loadDispatch(date)} aria-label="Refresh">
              <FiRefreshCw aria-hidden="true" />
            </button>
            <button className="kd-btn kd-btn--ghost kd-btn--sm" onClick={() => window.print()}>
              <FiPrinter aria-hidden="true" /> Print
            </button>
            {canGenerate && (
              <button className="kd-btn kd-btn--gold kd-btn--sm" onClick={generate} disabled={busy === "run"}>
                <FiZap aria-hidden="true" /> {busy === "run" ? "Generating…" : "Generate now"}
              </button>
            )}
          </div>
        </header>

        {dispatch && (
          <ul className="asubs__chips">
            <li><b>{dispatch.total}</b> total</li>
            <li><b>{dispatch.scheduled}</b> scheduled</li>
            <li><b>{dispatch.delivered}</b> delivered</li>
            <li className={dispatch.missed ? "is-warn" : ""}><b>{dispatch.missed}</b> missed</li>
            <li><b>{dispatch.refunded}</b> refunded</li>
            <li><b>{dispatch.totalUnits}</b> units</li>
            <li className="is-money"><b>{rupees(dispatch.revenue)}</b> collected</li>
          </ul>
        )}

        {loading ? (
          <div className="asubs__skel">
            {Array.from({ length: 4 }).map((_, i) => (
              <div className="kd-skel" key={i} />
            ))}
          </div>
        ) : !dispatch || dispatch.total === 0 ? (
          <div className="asubs__empty">
            <span aria-hidden="true">🚚</span>
            <p>
              {dispatch?.generated
                ? "No deliveries on this date."
                : "Nothing generated for this date yet. Deliveries appear here after the cutoff."}
            </p>
          </div>
        ) : (
          groups.map((g) => (
            <div className="asubs__group" key={g.slot}>
              <h3>
                {g.slot === "MORNING" ? "Morning run · 6 – 8 AM" : "Evening run · 5 – 7 PM"}
                <span>{g.rows.length}</span>
              </h3>

              <div className="asubs__table-wrap">
                <table className="asubs__table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Address</th>
                      <th>Item</th>
                      <th className="num">Amount</th>
                      <th>Status</th>
                      <th className="asubs__no-print">
                        <span className="kd-sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.rows.map((d) => (
                      <tr key={d.id} className={d.status === "MISSED" ? "is-missed" : ""}>
                        <td>
                          <strong>{d.customerName}</strong>
                          <small>
                            <a href={`tel:${d.phone}`}>{d.phone}</a>
                          </small>
                        </td>
                        <td className="asubs__addr">{d.address}</td>
                        <td>
                          {d.productName} <b>× {d.quantity}</b>
                          {d.note && d.status !== "SCHEDULED" && d.status !== "DELIVERED" && (
                            <small>{d.note}</small>
                          )}
                        </td>
                        <td className="num">{d.status === "MISSED" ? "—" : rupees(d.amount)}</td>
                        <td>
                          <StatusBadge status={d.status} />
                        </td>
                        <td className="asubs__actions asubs__no-print">
                          {d.status === "SCHEDULED" && date <= today && (
                            <button
                              className="kd-btn kd-btn--primary kd-btn--sm"
                              onClick={() => deliver(d)}
                              disabled={busy === d.id}
                              title="Mark delivered"
                            >
                              <FiCheck aria-hidden="true" /> Delivered
                            </button>
                          )}
                          {(d.status === "SCHEDULED" || d.status === "DELIVERED") && (
                            <button
                              className="kd-btn kd-btn--ghost kd-btn--sm"
                              onClick={() => {
                                setReason("");
                                setRefunding(d);
                              }}
                              disabled={busy === d.id}
                              title="Refund to wallet"
                            >
                              <FiRotateCcw aria-hidden="true" /> Refund
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </section>

      <Modal
        open={Boolean(refunding)}
        title="Refund this delivery?"
        size="sm"
        onClose={() => setRefunding(null)}
        footer={
          <>
            <button className="kd-btn kd-btn--ghost" onClick={() => setRefunding(null)}>
              Back
            </button>
            <button className="kd-btn kd-btn--danger" onClick={confirmRefund} disabled={busy === refunding?.id}>
              Refund {refunding ? rupees(refunding.amount) : ""}
            </button>
          </>
        }
      >
        {refunding && (
          <>
            <p>
              {rupees(refunding.amount)} goes back to <strong>{refunding.customerName}</strong>'s
              wallet for {refunding.productName} × {refunding.quantity}. They get an email.
            </p>
            <label className="kd-field">
              <span className="kd-label">Reason (shown to the customer)</span>
              <input
                className="kd-input"
                value={reason}
                maxLength={120}
                placeholder="e.g. Rider could not reach the address"
                onChange={(e) => setReason(e.target.value)}
              />
            </label>
          </>
        )}
      </Modal>
    </div>
  );
}

export default AdminSubscriptions;
