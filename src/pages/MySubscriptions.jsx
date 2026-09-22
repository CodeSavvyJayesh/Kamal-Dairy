import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiChevronDown, FiPause, FiPlay, FiPlus } from "react-icons/fi";
import {
  getDeliveries,
  listSubscriptions,
  pauseSubscription,
  resumeSubscription,
} from "../api/subscriptions";
import { StatusBadge } from "../components/SubscriptionBits";
import { useToast } from "../context/ToastContext";
import { useWallet } from "../context/useWallet";
import { relativeDay, rupees, rupeesShort, scheduleLabel } from "../utils/format";
import { PRODUCT_FALLBACK } from "../utils/images";
import { displayStatus, vacationState } from "../utils/subscription";
import "./MySubscriptions.css";

function MySubscriptions() {
  const navigate = useNavigate();
  const toast = useToast();
  const { balance, forecast, refresh: refreshWallet } = useWallet();

  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(null);

  const [deliveries, setDeliveries] = useState([]);
  const [dPage, setDPage] = useState(0);
  const [dHasMore, setDHasMore] = useState(false);
  const [dLoading, setDLoading] = useState(false);

  const fail = useCallback(
    (err) => {
      if (err.status === 401) navigate("/login", { state: { from: "/subscriptions" } });
      else setError(err.message);
    },
    [navigate]
  );

  const loadDeliveries = useCallback(
    async (page) => {
      setDLoading(true);
      try {
        const d = await getDeliveries({ page, size: 8 });
        setDeliveries((list) => (page === 0 ? d.content : [...list, ...d.content]));
        setDHasMore(!d.last);
        setDPage(page);
      } catch (err) {
        fail(err);
      } finally {
        setDLoading(false);
      }
    },
    [fail]
  );

  const load = useCallback(async () => {
    try {
      setSubs(await listSubscriptions());
      setError(null);
    } catch (err) {
      fail(err);
    } finally {
      setLoading(false);
    }
  }, [fail]);

  useEffect(() => {
    load();
    loadDeliveries(0);
    refreshWallet();
  }, [load, loadDeliveries, refreshWallet]);

  const toggle = async (sub) => {
    setBusy(sub.id);
    try {
      const res =
        sub.status === "PAUSED" ? await resumeSubscription(sub.id) : await pauseSubscription(sub.id);
      setSubs((list) => list.map((s) => (s.id === sub.id ? res.subscription : s)));
      toast.success(
        res.subscription.status === "PAUSED"
          ? `${sub.productName} paused`
          : `${sub.productName} resumed`
      );
      refreshWallet();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(null);
    }
  };

  const open = subs.filter((s) => s.status !== "CANCELLED");
  const past = subs.filter((s) => s.status === "CANCELLED");

  const stats = useMemo(() => {
    const active = open.filter((s) => s.status === "ACTIVE");
    const next = active.map((s) => s.nextDeliveryDate).filter(Boolean).sort()[0] ?? null;
    const monthly = active.reduce((sum, s) => sum + Number(s.estimatedMonthly || 0), 0);
    return { active: active.length, next, monthly };
  }, [open]);

  const short = forecast?.nextChargeAmount && balance < Number(forecast.nextChargeAmount);

  return (
    <>
      <header className="page-head">
        <div className="kd-container">
          <span className="kd-eyebrow">My subscriptions</span>
          <h1>Your deliveries</h1>
          <p>Skip, pause or change anything up to 11 PM the night before.</p>
        </div>
      </header>

      <div className="kd-container page-body">
        {error && <p className="kd-alert">{error}</p>}

        <div className="msubs__top">
          <Link to="/wallet" className={`msubs__wallet ${short ? "is-short" : ""}`}>
            <span className="msubs__wallet-label">Wallet</span>
            <strong>{rupees(balance)}</strong>
            <span className="msubs__wallet-meta">
              {short
                ? "Too low for your next delivery"
                : forecast?.coveredUntil
                ? `Covers you until ${relativeDay(forecast.coveredUntil)}`
                : "Add money to start deliveries"}
            </span>
            <span className="msubs__wallet-cta">
              Top up <FiArrowRight aria-hidden="true" />
            </span>
          </Link>

          <div className="msubs__stat kd-card">
            <strong>{stats.active}</strong>
            <span>Active plans</span>
          </div>
          <div className="msubs__stat kd-card">
            <strong>{stats.next ? relativeDay(stats.next) : "—"}</strong>
            <span>Next delivery</span>
          </div>
          <div className="msubs__stat kd-card">
            <strong>{rupeesShort(Math.round(stats.monthly))}</strong>
            <span>About per month</span>
          </div>
        </div>

        <div className="msubs__bar">
          <h2>Plans</h2>
          <Link to="/subscription" className="kd-btn kd-btn--primary kd-btn--sm">
            <FiPlus aria-hidden="true" /> New subscription
          </Link>
        </div>

        {loading ? (
          <div className="msubs__list">
            {Array.from({ length: 2 }).map((_, i) => (
              <div className="scard kd-card scard--skel" key={i}>
                <div className="kd-skel scard__skel-img" />
                <div className="scard__skel-lines">
                  <div className="kd-skel" />
                  <div className="kd-skel" />
                </div>
              </div>
            ))}
          </div>
        ) : open.length === 0 ? (
          <div className="kd-empty">
            <div className="kd-empty__icon">🥛</div>
            <h2>No subscriptions yet</h2>
            <p>Set up fresh milk every morning, paneer every week, or ghee every month.</p>
            <Link to="/subscription" className="kd-btn kd-btn--primary kd-btn--lg">
              Browse plans
            </Link>
          </div>
        ) : (
          <div className="msubs__list">
            {open.map((s) => {
              const vac = vacationState(s);
              return (
                <article className="scard kd-card" key={s.id}>
                  <Link to={`/subscriptions/${s.id}`} className="scard__media" tabIndex={-1}>
                    <img
                      src={s.productImageUrl || PRODUCT_FALLBACK}
                      alt=""
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = PRODUCT_FALLBACK;
                      }}
                    />
                  </Link>

                  <div className="scard__body">
                    <div className="scard__title">
                      <h3>
                        <Link to={`/subscriptions/${s.id}`}>{s.productName}</Link>
                      </h3>
                      <StatusBadge status={displayStatus(s)} />
                    </div>

                    <p className="scard__line">
                      {s.quantity} × {scheduleLabel(s)} · {s.slotLabel}
                    </p>

                    <div className="scard__tags">
                      <span className="kd-badge">{s.planName}</span>
                      {s.discountPercent > 0 && (
                        <span className="kd-badge kd-badge--gold">{s.discountPercent}% off</span>
                      )}
                      {vac === "upcoming" && (
                        <span className="kd-badge kd-badge--gold">Vacation from {relativeDay(s.vacationStart)}</span>
                      )}
                      {s.skippedDates?.length > 0 && (
                        <span className="kd-badge">
                          {s.skippedDates.length} skipped
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="scard__side">
                    <div className="scard__next">
                      <span>Next</span>
                      <strong>{s.nextDeliveryDate ? relativeDay(s.nextDeliveryDate) : "—"}</strong>
                    </div>
                    <div className="scard__price">
                      <strong>{rupees(s.pricePerDelivery)}</strong>
                      <span>per delivery</span>
                    </div>

                    <div className="scard__actions">
                      <button
                        className="kd-btn kd-btn--ghost kd-btn--sm"
                        onClick={() => toggle(s)}
                        disabled={busy === s.id}
                      >
                        {s.status === "PAUSED" ? (
                          <>
                            <FiPlay aria-hidden="true" /> Resume
                          </>
                        ) : (
                          <>
                            <FiPause aria-hidden="true" /> Pause
                          </>
                        )}
                      </button>
                      <Link to={`/subscriptions/${s.id}`} className="kd-btn kd-btn--outline kd-btn--sm">
                        Manage
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {past.length > 0 && (
          <details className="msubs__past">
            <summary>
              Past subscriptions ({past.length}) <FiChevronDown aria-hidden="true" />
            </summary>
            <ul>
              {past.map((s) => (
                <li key={s.id}>
                  <Link to={`/subscriptions/${s.id}`}>{s.productName}</Link>
                  <span>
                    {s.quantity} × {scheduleLabel(s)}
                  </span>
                  <StatusBadge status="CANCELLED" />
                </li>
              ))}
            </ul>
          </details>
        )}

        <section className="msubs__history">
          <h2>Delivery history</h2>

          {deliveries.length === 0 && !dLoading ? (
            <p className="msubs__none">
              Deliveries appear here once they are scheduled, the night before each one.
            </p>
          ) : (
            <ul className="dlist kd-card">
              {deliveries.map((d) => (
                <li className="dlist__row" key={d.id}>
                  <span className="dlist__date">
                    <strong>{relativeDay(d.deliveryDate)}</strong>
                    <small>{d.slotLabel}</small>
                  </span>
                  <span className="dlist__what">
                    {d.productName} <small>× {d.quantity}</small>
                    {d.note && d.status !== "DELIVERED" && <em>{d.note}</em>}
                  </span>
                  <StatusBadge status={d.status} />
                  <span className={`dlist__amt ${d.status === "MISSED" ? "is-zero" : ""}`}>
                    {d.status === "MISSED" ? "Not charged" : rupees(d.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {dHasMore && (
            <button
              className="kd-btn kd-btn--ghost kd-btn--sm msubs__more"
              onClick={() => loadDeliveries(dPage + 1)}
              disabled={dLoading}
            >
              {dLoading ? "Loading…" : "Show older"}
            </button>
          )}
        </section>
      </div>
    </>
  );
}

export default MySubscriptions;
