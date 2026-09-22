import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  FiCalendar,
  FiCheckCircle,
  FiEdit2,
  FiMapPin,
  FiPause,
  FiPlay,
  FiSun,
  FiXCircle,
} from "react-icons/fi";
import {
  cancelSubscription,
  clearVacation,
  getDeliveries,
  getSubscription,
  pauseSubscription,
  restoreDay,
  resumeSubscription,
  setVacation,
  skipDay,
  updateSubscription,
} from "../api/subscriptions";
import Modal from "../components/Modal";
import { QuantityStepper, StatusBadge, WeekdayPicker } from "../components/SubscriptionBits";
import { useToast } from "../context/ToastContext";
import { useWallet } from "../context/useWallet";
import {
  WEEKDAYS,
  addDays,
  formatDay,
  hourLabel,
  parseDay,
  relativeDay,
  rupees,
  scheduleLabel,
} from "../utils/format";
import { PRODUCT_FALLBACK } from "../utils/images";
import { displayStatus, vacationState } from "../utils/subscription";
import "./SubscriptionDetail.css";

const TILE = {
  UPCOMING: { title: (d) => rupees(d.amount), hint: "Tap to skip" },
  SKIPPED: { title: () => "Skipped", hint: "Tap to restore" },
  VACATION: { title: () => "Vacation" },
  PAUSED: { title: () => "Paused" },
  PENDING: { title: (d) => (d.amount ? rupees(d.amount) : "Locked"), hint: "Locked" },
  SCHEDULED: { title: () => "Paid", hint: "On its way" },
  DELIVERED: { title: () => "Delivered" },
  MISSED: { title: () => "Missed", hint: "Not charged" },
  REFUNDED: { title: () => "Refunded" },
  NONE: { title: () => "" },
};

const FREQUENCIES = [
  { code: "DAILY", label: "Every day", plan: "Daily Delivery" },
  { code: "ALTERNATE_DAYS", label: "Alternate days", plan: "Daily Delivery" },
  { code: "CUSTOM_DAYS", label: "Selected days", plan: "Daily Delivery" },
  { code: "WEEKLY", label: "Once a week (8% off)", plan: "Weekly Essentials" },
  { code: "MONTHLY", label: "Every 30 days (10% off)", plan: "Monthly Smart Saver" },
];

const SLOTS = [
  { code: "MORNING", label: "Morning, 6 – 8 AM" },
  { code: "EVENING", label: "Evening, 5 – 7 PM" },
];

function SubscriptionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { balance, refresh: refreshWallet } = useWallet();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyDate, setBusyDate] = useState(null);
  const [working, setWorking] = useState(false);
  const [history, setHistory] = useState([]);

  const [modal, setModal] = useState(null); // "edit" | "vacation" | "address" | "cancel"
  const [edit, setEdit] = useState(null);
  const [vac, setVac] = useState({ from: "", to: "" });
  const [addr, setAddr] = useState(null);

  const created = location.state?.created;

  const fail = useCallback(
    (err) => {
      if (err.status === 401) navigate("/login", { state: { from: location.pathname } });
      else if (err.status === 404) setError("This subscription could not be found.");
      else toast.error(err.message);
    },
    [navigate, location.pathname, toast]
  );

  const loadHistory = useCallback(async () => {
    try {
      const d = await getDeliveries({ subscriptionId: id, size: 10 });
      setHistory(d.content);
    } catch {
      /* history is secondary - the page still works without it */
    }
  }, [id]);

  const load = useCallback(async () => {
    try {
      setDetail(await getSubscription(id));
    } catch (err) {
      fail(err);
    } finally {
      setLoading(false);
    }
  }, [id, fail]);

  useEffect(() => {
    load();
    loadHistory();
  }, [load, loadHistory]);

  /** Run a mutation that returns the fresh detail, then update everything that depends on it. */
  const run = async (fn, message) => {
    setWorking(true);
    try {
      const next = await fn();
      setDetail(next);
      if (message) toast.success(message);
      refreshWallet();
      return true;
    } catch (err) {
      fail(err);
      return false;
    } finally {
      setWorking(false);
    }
  };

  const onTile = async (day) => {
    if (!day.editable || busyDate) return;
    setBusyDate(day.date);
    try {
      const next =
        day.state === "SKIPPED" ? await restoreDay(id, day.date) : await skipDay(id, day.date);
      setDetail(next);
      toast.success(
        day.state === "SKIPPED"
          ? `${formatDay(day.date)} restored`
          : `${formatDay(day.date)} skipped – you won't be charged`
      );
      refreshWallet();
    } catch (err) {
      fail(err);
    } finally {
      setBusyDate(null);
    }
  };

  if (loading) {
    return (
      <div className="kd-container page-body">
        <div className="kd-skel sdet__skel-head" />
        <div className="kd-skel sdet__skel-body" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="kd-container page-body">
        <div className="kd-empty">
          <div className="kd-empty__icon">🔍</div>
          <h2>{error || "Something went wrong"}</h2>
          <Link to="/subscriptions" className="kd-btn kd-btn--primary">
            Back to subscriptions
          </Link>
        </div>
      </div>
    );
  }

  const s = detail.subscription;
  const cutoff = hourLabel(detail.cutoffHour);
  const cancelled = s.status === "CANCELLED";
  const paused = s.status === "PAUSED";
  const vacation = vacationState(s);
  const short = s.nextDeliveryDate && s.status === "ACTIVE" && balance < Number(s.pricePerDelivery);

  const openEdit = () => {
    setEdit({
      quantity: s.quantity,
      frequency: s.frequency,
      daysOfWeek: s.daysOfWeek?.length ? s.daysOfWeek : ["MON", "WED", "FRI"],
      slot: s.slot,
    });
    setModal("edit");
  };

  const openVacation = () => {
    const from = s.vacationStart && vacation ? s.vacationStart : detail.firstEditableDate;
    setVac({
      from: from < detail.firstEditableDate ? detail.firstEditableDate : from,
      to: s.vacationEnd && vacation ? s.vacationEnd : addDays(detail.firstEditableDate, 6),
    });
    setModal("vacation");
  };

  const openAddress = () => {
    setAddr({ ...s.address });
    setModal("address");
  };

  const saveEdit = async () => {
    const needsDays = edit.frequency === "CUSTOM_DAYS" || edit.frequency === "WEEKLY";
    const ok = await run(
      () =>
        updateSubscription(id, {
          quantity: edit.quantity,
          frequency: edit.frequency,
          daysOfWeek: needsDays ? edit.daysOfWeek : [],
          slot: edit.slot,
        }),
      "Subscription updated"
    );
    if (ok) setModal(null);
  };

  const saveVacation = async () => {
    const ok = await run(() => setVacation(id, vac.from, vac.to), "Vacation set – enjoy the break");
    if (ok) setModal(null);
  };

  const endVacation = async () => {
    const ok = await run(() => clearVacation(id), "Welcome back – deliveries resume");
    if (ok) setModal(null);
  };

  const saveAddress = async (e) => {
    e.preventDefault();
    const ok = await run(() => updateSubscription(id, { address: addr }), "Delivery address updated");
    if (ok) setModal(null);
  };

  const doCancel = async () => {
    const ok = await run(() => cancelSubscription(id), "Subscription cancelled");
    if (ok) setModal(null);
  };

  return (
    <>
      <header className="page-head">
        <div className="kd-container">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/subscriptions">Subscriptions</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{s.productName}</span>
          </nav>

          <h1 className="sdet__title">{s.productName}</h1>
          <p>
            {s.quantity} × {scheduleLabel(s)} · {s.slotLabel}
          </p>
          <div className="sdet__head-badges">
            <StatusBadge status={displayStatus(s)} />
            <span className="sdet__plan">{s.planName}</span>
          </div>
        </div>
      </header>

      <div className="kd-container page-body">
        {created && (
          <div className="sdet__created" role="status">
            <FiCheckCircle aria-hidden="true" />
            <div>
              <strong>You're subscribed.</strong>{" "}
              {short ? (
                <>
                  Add at least {rupees(Number(s.pricePerDelivery) - balance)} to your wallet before{" "}
                  {cutoff} on {formatDay(addDays(s.nextDeliveryDate, -1))} so the first delivery goes out.{" "}
                  <Link to="/wallet">Top up now →</Link>
                </>
              ) : (
                <>First delivery {relativeDay(s.nextDeliveryDate)}. We'll charge your wallet the night before.</>
              )}
            </div>
          </div>
        )}

        {!created && short && (
          <div className="sdet__warn" role="status">
            Your wallet has {rupees(balance)} – not enough for the next delivery of{" "}
            {rupees(s.pricePerDelivery)}. <Link to="/wallet">Top up</Link> before {cutoff} the night before.
          </div>
        )}

        <div className="sdet">
          <div className="sdet__main">
            {/* ---- calendar ---- */}
            <section className="kd-panel">
              <div className="sdet__section-head">
                <h2>
                  <FiCalendar aria-hidden="true" /> Next 14 days
                </h2>
                <span className="sdet__cutoff">Changes close {cutoff} the night before</span>
              </div>

              <div className="cal" role="list">
                {detail.calendar.map((d) => {
                  const date = parseDay(d.date);
                  const tile = TILE[d.state] ?? TILE.NONE;
                  const isBusy = busyDate === d.date;
                  const Tag = d.editable ? "button" : "div";

                  return (
                    <Tag
                      key={d.date}
                      role="listitem"
                      type={d.editable ? "button" : undefined}
                      className={`cal__day cal__day--${d.state.toLowerCase()} ${
                        d.editable ? "is-editable" : ""
                      } ${isBusy ? "is-busy" : ""}`}
                      onClick={d.editable ? () => onTile(d) : undefined}
                      disabled={d.editable ? Boolean(busyDate) || working : undefined}
                      aria-label={`${formatDay(d.date, {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}: ${d.state.toLowerCase()}${d.editable ? `. ${tile.hint}` : ""}`}
                    >
                      <span className="cal__dow">
                        {date.toLocaleDateString("en-IN", { weekday: "short" })}
                      </span>
                      <span className="cal__num">{date.getDate()}</span>
                      <span className="cal__state">
                        {isBusy ? <span className="kd-spinner" aria-hidden="true" /> : tile.title(d)}
                      </span>
                      {tile.hint && d.state !== "NONE" && (
                        <span className="cal__hint">{d.editable || d.state !== "SKIPPED" ? tile.hint : ""}</span>
                      )}
                    </Tag>
                  );
                })}
              </div>

              <ul className="cal__legend" aria-label="Legend">
                <li><i className="lg lg--upcoming" /> Upcoming</li>
                <li><i className="lg lg--scheduled" /> Paid</li>
                <li><i className="lg lg--skipped" /> Skipped</li>
                <li><i className="lg lg--vacation" /> Vacation / paused</li>
                <li><i className="lg lg--missed" /> Missed</li>
              </ul>
            </section>

            {/* ---- history ---- */}
            <section className="kd-panel">
              <div className="sdet__section-head">
                <h2>Recent deliveries</h2>
              </div>

              {history.length === 0 ? (
                <p className="sdet__muted">
                  Nothing yet. Each delivery appears here once it is scheduled at {cutoff} the
                  night before.
                </p>
              ) : (
                <ul className="sdet__history">
                  {history.map((d) => (
                    <li key={d.id}>
                      <span>
                        <strong>{relativeDay(d.deliveryDate)}</strong>
                        <small>
                          {d.quantity} × · {d.slotLabel}
                          {d.note && d.status !== "DELIVERED" ? ` · ${d.note}` : ""}
                        </small>
                      </span>
                      <StatusBadge status={d.status} />
                      <b>{d.status === "MISSED" ? "—" : rupees(d.amount)}</b>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* ---- side ---- */}
          <aside className="sdet__side">
            <section className="kd-panel sdet__summary">
              <div className="sdet__product">
                <img
                  src={s.productImageUrl || PRODUCT_FALLBACK}
                  alt=""
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = PRODUCT_FALLBACK;
                  }}
                />
                <div>
                  <span className="sdet__label">Per delivery</span>
                  <strong className="sdet__price">{rupees(s.pricePerDelivery)}</strong>
                  {s.discountPercent > 0 && (
                    <span className="kd-badge kd-badge--gold">
                      Saving {rupees(s.savingsPerDelivery)} ({s.discountPercent}%)
                    </span>
                  )}
                </div>
              </div>

              <dl className="sdet__facts">
                <div>
                  <dt>Next delivery</dt>
                  <dd>{s.nextDeliveryDate ? relativeDay(s.nextDeliveryDate) : "—"}</dd>
                </div>
                <div>
                  <dt>Schedule</dt>
                  <dd>{scheduleLabel(s)}</dd>
                </div>
                <div>
                  <dt>Next 30 days</dt>
                  <dd>≈ {rupees(s.estimatedMonthly)}</dd>
                </div>
                <div>
                  <dt>Started</dt>
                  <dd>{formatDay(s.startDate, { day: "numeric", month: "short", year: "numeric" })}</dd>
                </div>
                {vacation && (
                  <div>
                    <dt>Vacation</dt>
                    <dd>
                      {formatDay(s.vacationStart)} – {formatDay(s.vacationEnd)}
                    </dd>
                  </div>
                )}
              </dl>

              {!cancelled && (
                <div className="sdet__actions">
                  <button className="kd-btn kd-btn--outline kd-btn--block" onClick={openEdit} disabled={working}>
                    <FiEdit2 aria-hidden="true" /> Change quantity or schedule
                  </button>

                  <div className="sdet__actions-row">
                    {paused ? (
                      <button
                        className="kd-btn kd-btn--primary"
                        onClick={() => run(() => resumeSubscription(id), "Deliveries resumed")}
                        disabled={working}
                      >
                        <FiPlay aria-hidden="true" /> Resume
                      </button>
                    ) : (
                      <button
                        className="kd-btn kd-btn--ghost"
                        onClick={() => run(() => pauseSubscription(id), "Paused – no deliveries until you resume")}
                        disabled={working}
                      >
                        <FiPause aria-hidden="true" /> Pause
                      </button>
                    )}

                    <button className="kd-btn kd-btn--ghost" onClick={openVacation} disabled={working}>
                      <FiSun aria-hidden="true" /> {vacation ? "Vacation" : "Vacation mode"}
                    </button>
                  </div>
                </div>
              )}
            </section>

            <section className="kd-panel sdet__address">
              <div className="sdet__section-head">
                <h2>
                  <FiMapPin aria-hidden="true" /> Delivering to
                </h2>
                {!cancelled && (
                  <button className="sdet__link" onClick={openAddress}>
                    Edit
                  </button>
                )}
              </div>
              <p>
                <strong>{s.address.name}</strong> · {s.address.phone}
                <br />
                {s.address.address}
                <br />
                {s.address.city} – {s.address.pincode}
              </p>
            </section>

            {!cancelled && (
              <button className="sdet__cancel" onClick={() => setModal("cancel")}>
                <FiXCircle aria-hidden="true" /> Cancel subscription
              </button>
            )}
          </aside>
        </div>
      </div>

      {/* ---------------- modals ---------------- */}

      <Modal
        open={modal === "edit"}
        title="Change your subscription"
        onClose={() => setModal(null)}
        footer={
          <>
            <button className="kd-btn kd-btn--ghost" onClick={() => setModal(null)}>
              Cancel
            </button>
            <button className="kd-btn kd-btn--primary" onClick={saveEdit} disabled={working}>
              {working ? "Saving…" : "Save changes"}
            </button>
          </>
        }
      >
        {edit && (
          <div className="sdet__form">
            <div className="kd-field">
              <span className="kd-label">Quantity per delivery</span>
              <QuantityStepper value={edit.quantity} onChange={(q) => setEdit({ ...edit, quantity: q })} />
            </div>

            <label className="kd-field">
              <span className="kd-label">How often</span>
              <select
                className="kd-select"
                value={edit.frequency}
                onChange={(e) => {
                  const f = e.target.value;
                  setEdit({
                    ...edit,
                    frequency: f,
                    daysOfWeek: f === "WEEKLY" ? [edit.daysOfWeek[0] ?? "MON"] : edit.daysOfWeek,
                  });
                }}
              >
                {FREQUENCIES.map((f) => (
                  <option key={f.code} value={f.code}>
                    {f.label} – {f.plan}
                  </option>
                ))}
              </select>
            </label>

            {(edit.frequency === "CUSTOM_DAYS" || edit.frequency === "WEEKLY") && (
              <div className="kd-field">
                <span className="kd-label">{edit.frequency === "WEEKLY" ? "Delivery day" : "Delivery days"}</span>
                <WeekdayPicker
                  value={edit.daysOfWeek}
                  onChange={(d) => setEdit({ ...edit, daysOfWeek: d })}
                  single={edit.frequency === "WEEKLY"}
                  days={WEEKDAYS}
                />
              </div>
            )}

            <label className="kd-field">
              <span className="kd-label">Delivery slot</span>
              <select
                className="kd-select"
                value={edit.slot}
                onChange={(e) => setEdit({ ...edit, slot: e.target.value })}
              >
                {SLOTS.map((o) => (
                  <option key={o.code} value={o.code}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            <p className="sdet__muted">
              Applies from {formatDay(detail.firstEditableDate)}. Deliveries already scheduled stay as they are.
            </p>
          </div>
        )}
      </Modal>

      <Modal
        open={modal === "vacation"}
        title="Vacation mode"
        onClose={() => setModal(null)}
        footer={
          <>
            {vacation && (
              <button className="kd-btn kd-btn--danger" onClick={endVacation} disabled={working}>
                End vacation
              </button>
            )}
            <button className="kd-btn kd-btn--primary" onClick={saveVacation} disabled={working || !vac.from || !vac.to}>
              {working ? "Saving…" : vacation ? "Update dates" : "Set vacation"}
            </button>
          </>
        }
      >
        <p>No deliveries and no charges between these dates. Everything resumes automatically after.</p>
        <div className="sdet__form sdet__form--row">
          <label className="kd-field">
            <span className="kd-label">Away from</span>
            <input
              className="kd-input"
              type="date"
              min={detail.firstEditableDate}
              value={vac.from}
              onChange={(e) =>
                setVac((v) => ({ from: e.target.value, to: v.to && v.to < e.target.value ? e.target.value : v.to }))
              }
            />
          </label>
          <label className="kd-field">
            <span className="kd-label">Back on</span>
            <input
              className="kd-input"
              type="date"
              min={vac.from || detail.firstEditableDate}
              max={vac.from ? addDays(vac.from, 89) : undefined}
              value={vac.to}
              onChange={(e) => setVac((v) => ({ ...v, to: e.target.value }))}
            />
          </label>
        </div>
      </Modal>

      <Modal open={modal === "address"} title="Delivery address" onClose={() => setModal(null)}>
        {addr && (
          <form className="sdet__form" onSubmit={saveAddress}>
            <label className="kd-field">
              <span className="kd-label">Name</span>
              <input className="kd-input" value={addr.name} onChange={(e) => setAddr({ ...addr, name: e.target.value })} required />
            </label>
            <label className="kd-field">
              <span className="kd-label">Mobile number</span>
              <input className="kd-input" inputMode="tel" value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} required />
            </label>
            <label className="kd-field">
              <span className="kd-label">Flat, building and street</span>
              <input className="kd-input" value={addr.address} onChange={(e) => setAddr({ ...addr, address: e.target.value })} required />
            </label>
            <div className="sdet__form--row">
              <label className="kd-field">
                <span className="kd-label">City</span>
                <input className="kd-input" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} required />
              </label>
              <label className="kd-field">
                <span className="kd-label">Pincode</span>
                <input className="kd-input" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} value={addr.pincode}
                  onChange={(e) => setAddr({ ...addr, pincode: e.target.value })} required />
              </label>
            </div>
            <button className="kd-btn kd-btn--primary kd-btn--block" type="submit" disabled={working}>
              {working ? "Saving…" : "Save address"}
            </button>
          </form>
        )}
      </Modal>

      <Modal
        open={modal === "cancel"}
        title="Cancel this subscription?"
        tone="danger"
        size="sm"
        onClose={() => setModal(null)}
        footer={
          <>
            <button className="kd-btn kd-btn--ghost" onClick={() => setModal(null)}>
              Keep it
            </button>
            <button className="kd-btn kd-btn--danger" onClick={doCancel} disabled={working}>
              Cancel subscription
            </button>
          </>
        }
      >
        <p>
          No more deliveries of <strong>{s.productName}</strong> after anything already scheduled.
          There is no fee, and your wallet balance stays yours. Want a break instead?{" "}
          <button className="sdet__link" onClick={() => { setModal(null); run(() => pauseSubscription(id), "Paused instead"); }}>
            Pause it
          </button>
          .
        </p>
      </Modal>
    </>
  );
}

export default SubscriptionDetail;
