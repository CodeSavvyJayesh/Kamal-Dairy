import { useState } from "react";
import "./Charts.css";

/**
 * Ranked horizontal bars, one colour (the rows are names, not a scale).
 * Value at the tip; hover or focus shows the detail line.
 *
 * rows: [{ key, label, value, display, detail }]
 */
function BarList({ rows, empty = "Nothing yet." }) {
  const [active, setActive] = useState(null);
  const max = Math.max(0, ...rows.map((r) => Number(r.value) || 0));

  if (rows.length === 0 || max === 0) {
    return <p className="kbars__empty">{empty}</p>;
  }

  return (
    <ul className="kbars">
      {rows.map((r) => {
        const pct = max ? (Number(r.value) / max) * 100 : 0;
        return (
          <li
            key={r.key}
            className={`kbars__row ${active === r.key ? "is-active" : ""}`}
            tabIndex={0}
            onMouseEnter={() => setActive(r.key)}
            onMouseLeave={() => setActive(null)}
            onFocus={() => setActive(r.key)}
            onBlur={() => setActive(null)}
            aria-label={`${r.label}: ${r.display}${r.detail ? `, ${r.detail}` : ""}`}
          >
            <span className="kbars__label">{r.label}</span>
            <span className="kbars__track">
              {pct > 0 && <span className="kbars__bar" style={{ width: `${Math.max(pct, 1.5)}%` }} />}
              <span className="kbars__value">{r.display}</span>
            </span>
            {r.detail && active === r.key && (
              <span className="kbars__tip" role="status">
                {r.detail}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default BarList;
