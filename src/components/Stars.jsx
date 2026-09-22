import { useState } from "react";
import "./Stars.css";

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

function StarShape() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <path d="M10 1.6l2.47 5.2 5.66.72-4.16 3.93 1.06 5.62L10 14.3l-5.03 2.77 1.06-5.62L1.87 7.52l5.66-.72z" />
    </svg>
  );
}

/** Read-only stars; fractional values fill part of a star. */
export function Stars({ value = 0, size = "md", label }) {
  const v = Math.max(0, Math.min(5, Number(value) || 0));
  return (
    <span
      className={`kstars kstars--${size}`}
      role="img"
      aria-label={label ?? `Rated ${v.toFixed(1).replace(/\.0$/, "")} out of 5`}
    >
      <span className="kstars__row kstars__row--empty">
        {[0, 1, 2, 3, 4].map((i) => (
          <StarShape key={i} />
        ))}
      </span>
      <span className="kstars__row kstars__row--full" style={{ width: `${(v / 5) * 100}%` }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <StarShape key={i} />
        ))}
      </span>
    </span>
  );
}

/** Five tappable stars. Arrow keys move, the label names the choice. */
export function StarInput({ value, onChange, disabled }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value || 0;

  const onKey = (e) => {
    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      onChange(Math.min(5, (value || 0) + 1));
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      onChange(Math.max(1, (value || 1) - 1));
    }
  };

  return (
    <div className="kstar-input">
      <div
        className="kstar-input__row"
        role="radiogroup"
        aria-label="Your rating"
        onMouseLeave={() => setHover(0)}
        onKeyDown={onKey}
      >
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} ${n === 1 ? "star" : "stars"}, ${LABELS[n]}`}
            tabIndex={value ? (value === n ? 0 : -1) : n === 1 ? 0 : -1}
            className={`kstar-input__star ${n <= shown ? "is-on" : ""}`}
            onMouseEnter={() => setHover(n)}
            onFocus={() => setHover(0)}
            onClick={() => onChange(n)}
            disabled={disabled}
          >
            <StarShape />
          </button>
        ))}
      </div>
      <span className="kstar-input__label" aria-live="polite">
        {shown ? LABELS[shown] : "Tap a star to rate"}
      </span>
    </div>
  );
}
