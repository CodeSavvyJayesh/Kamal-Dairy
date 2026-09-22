import { useCallback, useEffect, useMemo, useState } from "react";
import { FiArrowDownRight, FiArrowUpRight, FiMinus, FiRefreshCw } from "react-icons/fi";
import { getSalesAnalytics } from "../../api/analytics";
import { rupees, rupeesShort } from "../../utils/format";
import BarList from "../charts/BarList";
import RevenueColumns from "../charts/RevenueColumns";
import Sparkline from "../charts/Sparkline";
import { longDay, shortDay } from "../charts/format";
import "./AdminInsights.css";

const RANGES = [7, 30, 90];

/*
 * Two categorical slots, brand-derived and validated for the light surface
 * (dataviz validate_palette: lightness, chroma, contrast pass; CVD 7.7 sits in
 * the floor band, so identity also rides the legend, the 2px gaps between
 * segments, the tooltip and the table view - never colour alone).
 */
const SERIES = [
  { key: "cartRevenue", label: "Cart orders", color: "#1f8464" },
  { key: "subscriptionRevenue", label: "Subscriptions", color: "#b9792a" },
];

/** Signed change against the previous period; colour follows whether up is good. */
function Delta({ now, before, upIsGood = true }) {
  const a = Number(now) || 0;
  const b = Number(before) || 0;

  if (a === 0 && b === 0) {
    return (
      <span className="idelta is-flat">
        <FiMinus aria-hidden="true" /> No change
      </span>
    );
  }
  if (b === 0) {
    return <span className="idelta is-flat">New this period</span>;
  }

  const pct = Math.round(((a - b) / b) * 100);
  if (pct === 0) {
    return (
      <span className="idelta is-flat">
        <FiMinus aria-hidden="true" /> Same as before
      </span>
    );
  }
  const up = pct > 0;
  const good = up === upIsGood;
  return (
    <span className={`idelta ${good ? "is-good" : "is-bad"}`}>
      {up ? <FiArrowUpRight aria-hidden="true" /> : <FiArrowDownRight aria-hidden="true" />}
      {up ? "+" : "−"}
      {Math.abs(pct)}% <span className="idelta__vs">vs previous</span>
    </span>
  );
}

function Tile({ label, value, children, hero = false }) {
  return (
    <div className={`itile kd-card ${hero ? "itile--hero" : ""}`}>
      <span className="itile__label">{label}</span>
      <strong className="itile__value">{value}</strong>
      {children}
    </div>
  );
}

function AdminInsights({ onError }) {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [table, setTable] = useState(false);
  const [rankBy, setRankBy] = useState("revenue");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await getSalesAnalytics(days));
    } catch (err) {
      onError(err);
    } finally {
      setLoading(false);
    }
  }, [days, onError]);

  useEffect(() => {
    load();
  }, [load]);

  const cur = data?.current;
  const prev = data?.previous;

  const daily = useMemo(() => data?.daily ?? [], [data]);
  const revenueTrend = useMemo(() => daily.map((d) => d.revenue), [daily]);
  const orderTrend = useMemo(() => daily.map((d) => d.orders), [daily]);

  const products = useMemo(
    () =>
      (data?.topProducts ?? []).map((p) => ({
        key: p.productId,
        label: p.name,
        value: rankBy === "revenue" ? Number(p.revenue) : p.units,
        display: rankBy === "revenue" ? rupees(p.revenue) : `${p.units} units`,
        detail: `${p.units} units · ${p.cartUnits} in orders, ${p.subscriptionUnits} by subscription · ${rupees(p.revenue)}`,
      })),
    [data, rankBy]
  );

  const plans = useMemo(
    () =>
      (data?.plans ?? []).map((p) => ({
        key: p.plan,
        label: p.planName,
        value: Number(p.revenue),
        display: rupees(p.revenue),
        detail: `${p.deliveries} ${p.deliveries === 1 ? "delivery" : "deliveries"} · ${p.activeSubscriptions} active now`,
      })),
    [data]
  );

  const payments = useMemo(() => {
    const p = data?.payments;
    if (!p) return [];
    const rows = [
      { key: "online", label: "Online (Razorpay)", value: Number(p.online) },
      { key: "wallet", label: "Wallet – cart orders", value: Number(p.walletOrders) },
      { key: "subs", label: "Wallet – subscriptions", value: Number(p.subscriptions) },
    ];
    const total = rows.reduce((s, r) => s + r.value, 0);
    return rows.map((r) => ({
      ...r,
      display: `${rupees(r.value)} · ${total ? Math.round((r.value / total) * 100) : 0}%`,
    }));
  }, [data]);

  if (!data) {
    return (
      <div className="insights">
        <div className="insights__kpis">
          {Array.from({ length: 5 }).map((_, i) => (
            <div className="kd-card itile" key={i}>
              <span className="kd-skel insights__skel-sm" />
              <span className="kd-skel insights__skel-lg" />
            </div>
          ))}
        </div>
        <div className="kd-panel insights__card">
          <div className="kd-skel insights__skel-chart" />
        </div>
      </div>
    );
  }

  const noSales = Number(cur.revenue) === 0 && cur.orders === 0 && cur.deliveries === 0;
  const walletShare = (() => {
    const p = data.payments;
    const all = Number(p.online) + Number(p.walletOrders) + Number(p.subscriptions);
    return all ? Math.round(((Number(p.walletOrders) + Number(p.subscriptions)) / all) * 100) : 0;
  })();

  return (
    <div className="insights">
      {/* one filter row, scoping everything below */}
      <div className="insights__bar">
        <div className="insights__ranges" role="radiogroup" aria-label="Date range">
          {RANGES.map((r) => (
            <button
              key={r}
              role="radio"
              aria-checked={days === r}
              className={`bchip ${days === r ? "is-on" : ""}`}
              onClick={() => setDays(r)}
            >
              Last {r} days
            </button>
          ))}
        </div>
        <span className="insights__period">
          {shortDay(data.from)} – {shortDay(data.to)} · compared with the {data.days} days before
        </span>
        <button className="kd-btn kd-btn--ghost kd-btn--sm" onClick={load} disabled={loading} aria-label="Refresh">
          <FiRefreshCw aria-hidden="true" className={loading ? "is-spinning" : ""} />
        </button>
      </div>

      <div className={`insights__body ${loading ? "is-refetching" : ""}`} aria-busy={loading}>
        <div className="insights__kpis">
          <Tile label="Revenue" value={rupees(cur.revenue)} hero>
            <Delta now={cur.revenue} before={prev.revenue} />
            <span className="itile__sub">
              {rupeesShort(cur.cartRevenue)} from orders · {rupeesShort(cur.subscriptionRevenue)} from subscriptions
            </span>
            <Sparkline values={revenueTrend} label="Revenue trend" />
          </Tile>

          <Tile label="Orders" value={cur.orders}>
            <Delta now={cur.orders} before={prev.orders} />
            <Sparkline values={orderTrend} label="Orders trend" />
          </Tile>

          <Tile label="Average order" value={rupees(cur.averageOrderValue)}>
            <Delta now={cur.averageOrderValue} before={prev.averageOrderValue} />
            <span className="itile__sub">Cart orders only</span>
          </Tile>

          <Tile label="Buyers" value={cur.buyers}>
            <Delta now={cur.buyers} before={prev.buyers} />
            <span className="itile__sub">
              {cur.newBuyers} new · {cur.buyers - cur.newBuyers} returning
            </span>
          </Tile>

          <Tile label="Refunded" value={rupees(cur.refunded)}>
            <Delta now={cur.refunded} before={prev.refunded} upIsGood={false} />
            <span className="itile__sub">
              {cur.cancelledOrders} cancelled {cur.cancelledOrders === 1 ? "order" : "orders"}
            </span>
          </Tile>
        </div>

        {/* ---- revenue by day ---- */}
        <section className="kd-panel insights__card" aria-labelledby="ins-rev">
          <header className="insights__card-head">
            <div>
              <h2 id="ins-rev">Revenue by day</h2>
              <p>What the dairy kept each day: cancelled orders and refunded deliveries are left out.</p>
            </div>
            <div className="insights__card-tools">
              <ul className="ilegend" aria-label="Legend">
                {SERIES.map((s) => (
                  <li key={s.key}>
                    <i style={{ background: s.color }} aria-hidden="true" />
                    {s.label}
                  </li>
                ))}
              </ul>
              <button className="kd-btn kd-btn--ghost kd-btn--sm" onClick={() => setTable((t) => !t)} aria-pressed={table}>
                {table ? "Show chart" : "Show table"}
              </button>
            </div>
          </header>

          {noSales ? (
            <div className="insights__empty">
              <span aria-hidden="true">📈</span>
              <p>No sales in these {data.days} days yet. Orders and subscription deliveries will show up here.</p>
            </div>
          ) : table ? (
            <div className="insights__table-wrap">
              <table className="insights__table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th className="num">Cart orders</th>
                    <th className="num">Subscriptions</th>
                    <th className="num">Total</th>
                    <th className="num">Orders</th>
                    <th className="num">Deliveries</th>
                  </tr>
                </thead>
                <tbody>
                  {[...daily].reverse().map((d) => (
                    <tr key={d.date}>
                      <td>{longDay(d.date)}</td>
                      <td className="num">{rupees(d.cartRevenue)}</td>
                      <td className="num">{rupees(d.subscriptionRevenue)}</td>
                      <td className="num">
                        <b>{rupees(d.revenue)}</b>
                      </td>
                      <td className="num">{d.orders}</td>
                      <td className="num">{d.deliveries}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <RevenueColumns data={daily} series={SERIES} />
          )}
        </section>

        <div className="insights__grid">
          {/* ---- best sellers ---- */}
          <section className="kd-panel insights__card" aria-labelledby="ins-top">
            <header className="insights__card-head">
              <div>
                <h2 id="ins-top">Best sellers</h2>
                <p>Cart orders and subscriptions together.</p>
              </div>
              <div className="insights__toggle" role="radiogroup" aria-label="Rank by">
                {["revenue", "units"].map((k) => (
                  <button
                    key={k}
                    role="radio"
                    aria-checked={rankBy === k}
                    className={`bchip ${rankBy === k ? "is-on" : ""}`}
                    onClick={() => setRankBy(k)}
                  >
                    {k === "revenue" ? "Revenue" : "Units"}
                  </button>
                ))}
              </div>
            </header>
            <BarList rows={[...products].sort((a, b) => b.value - a.value)} empty="No products sold in these days." />
          </section>

          {/* ---- customers ---- */}
          <section className="kd-panel insights__card" aria-labelledby="ins-cust">
            <header className="insights__card-head">
              <div>
                <h2 id="ins-cust">Customers</h2>
                <p>Who bought in these days, and whether they had bought before.</p>
              </div>
            </header>

            <div className="icust">
              <div>
                <strong>{data.customers.newBuyers}</strong>
                <span>First-time buyers</span>
              </div>
              <div>
                <strong>{data.customers.returningBuyers}</strong>
                <span>Returning buyers</span>
              </div>
            </div>

            <div className="imeter" aria-label={`${data.customers.repeatRatePercent}% of buyers came back`}>
              <div className="imeter__head">
                <span>Came back</span>
                <b>{data.customers.repeatRatePercent}%</b>
              </div>
              <div className="imeter__track">
                <div className="imeter__fill" style={{ width: `${data.customers.repeatRatePercent}%` }} />
              </div>
              <p className="imeter__note">
                {data.customers.buyers === 0
                  ? "No buyers in these days yet."
                  : `${data.customers.returningBuyers} of ${data.customers.buyers} buyers had ordered before.`}
              </p>
            </div>
          </section>

          {/* ---- subscriptions ---- */}
          <section className="kd-panel insights__card" aria-labelledby="ins-subs">
            <header className="insights__card-head">
              <div>
                <h2 id="ins-subs">Subscription earnings</h2>
                <p>Charged deliveries in these days, by plan.</p>
              </div>
            </header>

            <div className="isubs">
              <div>
                <strong>{rupees(data.subscriptions.monthlyRecurringRevenue)}</strong>
                <span>Expected per month</span>
              </div>
              <div>
                <strong>{data.subscriptions.active}</strong>
                <span>Active · {data.subscriptions.paused} paused</span>
              </div>
              <div>
                <strong>{rupees(data.subscriptions.walletFloat)}</strong>
                <span>Held in wallets</span>
              </div>
            </div>

            <BarList rows={plans} empty="No subscription deliveries in these days." />
          </section>

          {/* ---- payments ---- */}
          <section className="kd-panel insights__card" aria-labelledby="ins-pay">
            <header className="insights__card-head">
              <div>
                <h2 id="ins-pay">How customers pay</h2>
                <p>{walletShare}% of revenue came through the Kamal Wallet.</p>
              </div>
            </header>
            <BarList rows={payments} empty="No payments in these days." />
          </section>
        </div>
      </div>
    </div>
  );
}

export default AdminInsights;
