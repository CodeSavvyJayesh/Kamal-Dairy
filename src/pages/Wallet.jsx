import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowDownLeft,
  FiArrowUpRight,
  FiCalendar,
  FiLock,
  FiPlus,
  FiRotateCcw,
  FiShoppingBag,
} from "react-icons/fi";
import { createTopup, getTransactions, verifyTopup } from "../api/wallet";
import { useToast } from "../context/ToastContext";
import { useWallet } from "../context/useWallet";
import { formatDateTime, relativeDay, rupees, rupeesShort } from "../utils/format";
import { openRazorpay } from "../utils/razorpay";
import "./Wallet.css";

const PRESETS = [200, 500, 1000, 2000];

const SOURCE = {
  TOPUP: { label: "Top-up", icon: <FiPlus /> },
  SUBSCRIPTION: { label: "Subscription", icon: <FiCalendar /> },
  ORDER: { label: "Order", icon: <FiShoppingBag /> },
  REFUND: { label: "Refund", icon: <FiRotateCcw /> },
  ADJUSTMENT: { label: "Adjustment", icon: <FiPlus /> },
};

function Wallet() {
  const navigate = useNavigate();
  const toast = useToast();
  const { wallet, balance, forecast, loading, refresh, setWallet } = useWallet();

  const [amount, setAmount] = useState(500);
  const [custom, setCustom] = useState("");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState(null);

  const [txns, setTxns] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [txLoading, setTxLoading] = useState(true);

  const min = Number(wallet?.minTopup ?? 50);
  const max = Number(wallet?.maxTopup ?? 10000);

  const loadTxns = useCallback(async (p) => {
    setTxLoading(true);
    try {
      const data = await getTransactions(p, 15);
      setTxns((list) => (p === 0 ? data.content : [...list, ...data.content]));
      setHasMore(!data.last);
      setPage(p);
    } catch (err) {
      if (err.status === 401) navigate("/login");
      else setError(err.message);
    } finally {
      setTxLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    refresh();
    loadTxns(0);
  }, [refresh, loadTxns]);

  // Suggest the amount that tops the wallet up to cover the next 7 days.
  const suggestion = useMemo(() => {
    const need = Number(forecast?.next7DaysAmount ?? 0) - balance;
    if (need <= 0) return null;
    return Math.min(max, Math.max(min, Math.ceil(need / 50) * 50));
  }, [forecast, balance, min, max]);

  const chosen = custom !== "" ? Number(custom) : amount;
  const validAmount = Number.isInteger(chosen) && chosen >= min && chosen <= max;

  const handleTopup = async () => {
    if (!validAmount) {
      setError(`Enter a whole amount between ${rupeesShort(min)} and ${rupeesShort(max)}.`);
      return;
    }

    setError(null);
    setPaying(true);

    try {
      const order = await createTopup(chosen);
      const receipt = await openRazorpay({ order, description: "Wallet top-up" });
      const updated = await verifyTopup(receipt);

      setWallet(updated);
      setCustom("");
      toast.success(`${rupeesShort(chosen)} added to your wallet`);
      loadTxns(0);
    } catch (err) {
      if (err.status === 401) {
        navigate("/login");
        return;
      }
      if (!err.cancelled) setError(err.message);
    } finally {
      setPaying(false);
    }
  };

  const low = forecast?.lowBalance;
  const short = forecast?.nextChargeAmount && balance < Number(forecast.nextChargeAmount);

  return (
    <>
      <header className="page-head">
        <div className="kd-container">
          <span className="kd-eyebrow">Kamal Wallet</span>
          <h1>Your wallet</h1>
          <p>
            Top up once and every delivery is paid automatically, the night before it
            arrives. Use it at checkout too.
          </p>
        </div>
      </header>

      <div className="kd-container page-body">
        {error && <p className="kd-alert">{error}</p>}

        <div className="wallet">
          <div className="wallet__left">
            {/* ---- balance card ---- */}
            <section className="wcard" aria-label="Wallet balance">
              <div className="wcard__glow" aria-hidden="true" />
              <span className="wcard__label">Available balance</span>

              <strong className="wcard__balance">
                {loading && !wallet ? (
                  <span className="kd-skel wcard__skel" />
                ) : (
                  rupees(balance)
                )}
              </strong>

              <div className="wcard__meta">
                {forecast?.activeSubscriptions ? (
                  forecast.coveredUntil ? (
                    <span>
                      Covers {forecast.deliveriesCovered}{" "}
                      {forecast.deliveriesCovered === 1 ? "delivery" : "deliveries"} · until{" "}
                      <b>{relativeDay(forecast.coveredUntil)}</b>
                    </span>
                  ) : (
                    <span>Not enough for your next delivery</span>
                  )
                ) : (
                  <span>No active subscriptions</span>
                )}
                <span className="wcard__brand">
                  Kamal <em>Dairy</em>
                </span>
              </div>
            </section>

            {(low || short) && (
              <div className={`wallet__warn ${short ? "is-urgent" : ""}`} role="status">
                <strong>{short ? "Your next delivery will be missed" : "Balance running low"}</strong>
                <span>
                  {short
                    ? `${relativeDay(forecast.nextChargeDate)}'s delivery needs ${rupees(
                        forecast.nextChargeAmount
                      )}. Top up before 11 PM the night before.`
                    : `The next 7 days of deliveries total ${rupees(forecast.next7DaysAmount)}.`}
                </span>
              </div>
            )}

            {/* ---- top-up ---- */}
            <section className="kd-panel wallet__topup">
              <h2>Add money</h2>

              <div className="wallet__presets" role="radiogroup" aria-label="Amount">
                {suggestion && !PRESETS.includes(suggestion) && (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={custom === "" && amount === suggestion}
                    className={`wallet__preset wallet__preset--suggest ${
                      custom === "" && amount === suggestion ? "is-on" : ""
                    }`}
                    onClick={() => {
                      setAmount(suggestion);
                      setCustom("");
                    }}
                  >
                    {rupeesShort(suggestion)}
                    <small>covers 7 days</small>
                  </button>
                )}

                {PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    role="radio"
                    aria-checked={custom === "" && amount === p}
                    className={`wallet__preset ${custom === "" && amount === p ? "is-on" : ""}`}
                    onClick={() => {
                      setAmount(p);
                      setCustom("");
                    }}
                  >
                    {rupeesShort(p)}
                  </button>
                ))}
              </div>

              <label className="kd-field wallet__custom">
                <span className="kd-label">Or enter an amount</span>
                <div className="wallet__input">
                  <span aria-hidden="true">₹</span>
                  <input
                    className="kd-input"
                    type="number"
                    inputMode="numeric"
                    min={min}
                    max={max}
                    step="1"
                    placeholder={`${min} – ${max}`}
                    value={custom}
                    onChange={(e) => setCustom(e.target.value.replace(/[^\d]/g, ""))}
                  />
                </div>
              </label>

              <button
                className="kd-btn kd-btn--primary kd-btn--lg kd-btn--block"
                onClick={handleTopup}
                disabled={paying || !validAmount}
              >
                {paying ? (
                  <>
                    <span className="kd-spinner" aria-hidden="true" /> Processing…
                  </>
                ) : (
                  <>
                    <FiPlus aria-hidden="true" /> Add {validAmount ? rupeesShort(chosen) : "money"}
                  </>
                )}
              </button>

              <p className="wallet__secure">
                <FiLock aria-hidden="true" /> Paid through Razorpay. The balance is credited only
                after the payment is verified by our server.
              </p>
            </section>

            {forecast?.activeSubscriptions > 0 && (
              <section className="kd-panel wallet__forecast">
                <h2>Coming up</h2>
                <dl>
                  <div>
                    <dt>Next charge</dt>
                    <dd>
                      {forecast.nextChargeDate
                        ? `${rupees(forecast.nextChargeAmount)} · ${relativeDay(forecast.nextChargeDate)}`
                        : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt>Next 7 days</dt>
                    <dd>{rupees(forecast.next7DaysAmount)}</dd>
                  </div>
                  <div>
                    <dt>Active plans</dt>
                    <dd>{forecast.activeSubscriptions}</dd>
                  </div>
                </dl>
                <Link to="/subscriptions" className="wallet__link">
                  Manage subscriptions →
                </Link>
              </section>
            )}
          </div>

          {/* ---- ledger ---- */}
          <section className="kd-panel wallet__ledger">
            <h2>Transactions</h2>

            {txLoading && txns.length === 0 ? (
              <ul className="ledger">
                {Array.from({ length: 5 }).map((_, i) => (
                  <li className="ledger__row" key={i}>
                    <span className="kd-skel ledger__skel-icon" />
                    <span className="kd-skel ledger__skel-line" />
                  </li>
                ))}
              </ul>
            ) : txns.length === 0 ? (
              <div className="ledger__empty">
                <span aria-hidden="true">🪙</span>
                <p>No transactions yet. Your first top-up will show up here.</p>
              </div>
            ) : (
              <ul className="ledger">
                {txns.map((t) => {
                  const credit = t.type === "CREDIT";
                  const src = SOURCE[t.source] ?? SOURCE.ADJUSTMENT;

                  return (
                    <li className="ledger__row" key={t.id}>
                      <span className={`ledger__icon ${credit ? "is-credit" : "is-debit"}`} aria-hidden="true">
                        {credit ? <FiArrowDownLeft /> : <FiArrowUpRight />}
                      </span>

                      <div className="ledger__main">
                        <strong>{t.description || src.label}</strong>
                        <span>
                          {src.label} · {formatDateTime(t.createdAt)}
                        </span>
                      </div>

                      <div className="ledger__amount">
                        <strong className={credit ? "is-credit" : "is-debit"}>
                          {credit ? "+" : "−"}
                          {rupees(t.amount)}
                        </strong>
                        <span>Bal. {rupees(t.balanceAfter)}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {hasMore && (
              <button
                className="kd-btn kd-btn--ghost kd-btn--sm ledger__more"
                onClick={() => loadTxns(page + 1)}
                disabled={txLoading}
              >
                {txLoading ? "Loading…" : "Show older"}
              </button>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default Wallet;
