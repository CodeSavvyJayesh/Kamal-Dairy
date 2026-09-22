import { useMemo, useRef, useState } from "react";
import { rupees } from "../../utils/format";
import { longDay, niceTicks, rupeesAxis, shortDay } from "./format";
import { useWidth } from "./useWidth";
import "./Charts.css";

const H = 260;
const M = { top: 22, right: 8, bottom: 28, left: 52 };
const GAP = 2; // surface gap between stacked segments
const R = 4; // rounded data end

/** Column with only its top corners rounded, square on the baseline. */
function colPath(x, y, w, h, round) {
  if (h <= 0) return "";
  const r = round ? Math.min(R, w / 2, h) : 0;
  return `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`;
}

/**
 * Revenue by day, stacked: cart orders at the base, subscriptions on top.
 * Hovering or focusing a day shows every value for it; the peak day carries
 * the one direct label.
 */
function RevenueColumns({ data, series }) {
  const wrapRef = useRef(null);
  const width = useWidth(wrapRef);
  const [active, setActive] = useState(null);

  const innerW = Math.max(120, width - M.left - M.right);
  const innerH = H - M.top - M.bottom;

  const { ticks, max, peak } = useMemo(() => {
    let mx = 0;
    let pk = -1;
    data.forEach((d, i) => {
      const t = Number(d.revenue);
      if (t > mx) {
        mx = t;
        pk = i;
      }
    });
    const tk = niceTicks(mx);
    return { ticks: tk, max: tk[tk.length - 1] || 1, peak: pk };
  }, [data]);

  const band = innerW / Math.max(1, data.length);
  const barW = Math.max(2, Math.min(24, band * 0.62));
  const y = (v) => M.top + innerH - (Number(v) / max) * innerH;
  const labelEvery = Math.max(1, Math.ceil(data.length / Math.max(2, Math.floor(innerW / 64))));

  const [a, b] = series; // a = base (cart), b = top (subscriptions)
  const activeDay = active === null ? null : data[active];
  const tipX = active === null ? 0 : M.left + band * (active + 0.5);

  return (
    <div className="kchart" ref={wrapRef}>
      <svg
        width={width}
        height={H}
        role="img"
        aria-label={`Revenue by day, ${data.length} days. Use the table view for every value.`}
        onMouseLeave={() => setActive(null)}
      >
        {/* gridlines + y ticks */}
        {ticks.map((t) => (
          <g key={t}>
            <line className="kchart__grid" x1={M.left} x2={M.left + innerW} y1={y(t)} y2={y(t)} />
            <text className="kchart__tick" x={M.left - 8} y={y(t)} dy="0.32em" textAnchor="end">
              {rupeesAxis(t)}
            </text>
          </g>
        ))}

        {data.map((d, i) => {
          const x = M.left + band * i + (band - barW) / 2;
          const base = Number(d[a.key]);
          const top = Number(d[b.key]);
          const hBase = (base / max) * innerH;
          const hTop = (top / max) * innerH;
          const yBase = M.top + innerH - hBase;
          const gap = hBase > 0 && hTop > 0 ? GAP : 0;
          const yTop = yBase - hTop;
          const dim = active !== null && active !== i;

          return (
            <g key={d.date} className={dim ? "is-dim" : ""}>
              <path d={colPath(x, yBase, barW, hBase, hTop <= 0)} fill={a.color} />
              <path d={colPath(x, yTop, barW, Math.max(0, hTop - gap), true)} fill={b.color} />
              {i === peak && Number(d.revenue) > 0 && (
                <text className="kchart__peak" x={x + barW / 2} y={yTop - 6} textAnchor="middle">
                  {rupeesAxis(d.revenue)}
                </text>
              )}
            </g>
          );
        })}

        {/* baseline + x labels */}
        <line className="kchart__axis" x1={M.left} x2={M.left + innerW} y1={M.top + innerH} y2={M.top + innerH} />
        {data.map((d, i) =>
          (data.length - 1 - i) % labelEvery === 0 ? (
            <text
              key={`x${d.date}`}
              className="kchart__tick"
              x={M.left + band * (i + 0.5)}
              y={H - 8}
              textAnchor="middle"
            >
              {shortDay(d.date)}
            </text>
          ) : null
        )}

        {/* hit targets: the whole day band, taller and wider than the mark */}
        {data.map((d, i) => (
          <rect
            key={`h${d.date}`}
            className="kchart__hit"
            x={M.left + band * i}
            y={M.top}
            width={band}
            height={innerH}
            tabIndex={0}
            role="button"
            aria-label={`${longDay(d.date)}: ${rupees(d.revenue)} total, ${a.label} ${rupees(d[a.key])}, ${b.label} ${rupees(d[b.key])}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onBlur={() => setActive(null)}
          />
        ))}
      </svg>

      {activeDay && (
        <div
          className="kchart__tip"
          style={{ left: Math.min(Math.max(tipX, 90), width - 90), top: 4 }}
          role="status"
        >
          <span className="kchart__tip-date">{longDay(activeDay.date)}</span>
          <strong className="kchart__tip-total">{rupees(activeDay.revenue)}</strong>
          {[b, a].map((s) => (
            <span className="kchart__tip-row" key={s.key}>
              <i style={{ background: s.color }} aria-hidden="true" />
              <b>{rupees(activeDay[s.key])}</b> {s.label}
            </span>
          ))}
          <span className="kchart__tip-meta">
            {activeDay.orders} {activeDay.orders === 1 ? "order" : "orders"} · {activeDay.deliveries}{" "}
            {activeDay.deliveries === 1 ? "delivery" : "deliveries"}
          </span>
        </div>
      )}
    </div>
  );
}

export default RevenueColumns;
