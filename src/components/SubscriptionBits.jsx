import { FiMinus, FiPlus } from "react-icons/fi";
import "./SubscriptionBits.css";

/** Status pill for subscriptions and deliveries. */
const STATUS = {
  ACTIVE: { label: "Active", tone: "green" },
  PAUSED: { label: "Paused", tone: "gold" },
  CANCELLED: { label: "Cancelled", tone: "grey" },
  VACATION: { label: "On vacation", tone: "gold" },
  SCHEDULED: { label: "Scheduled", tone: "green" },
  DELIVERED: { label: "Delivered", tone: "green" },
  MISSED: { label: "Missed", tone: "red" },
  REFUNDED: { label: "Refunded", tone: "blue" },
  // cart orders
  PLACED: { label: "Placed", tone: "blue" },
  CONFIRMED: { label: "Confirmed", tone: "blue" },
  OUT_FOR_DELIVERY: { label: "Out for delivery", tone: "gold" },
};

export function StatusBadge({ status, label }) {
  const s = STATUS[status] ?? { label: status, tone: "grey" };
  return (
    <span className={`kd-status kd-status--${s.tone}`}>
      <span className="kd-status__dot" aria-hidden="true" />
      {label ?? s.label}
    </span>
  );
}

export function QuantityStepper({ value, onChange, min = 1, max = 10, disabled, label = "Quantity" }) {
  return (
    <div className="kd-stepper" role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
      >
        <FiMinus />
      </button>

      <output aria-live="polite">{value}</output>

      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
      >
        <FiPlus />
      </button>
    </div>
  );
}

/** Seven round toggles, Monday first. */
export function WeekdayPicker({ value = [], onChange, single = false, days }) {
  const toggle = (code) => {
    if (single) {
      onChange([code]);
      return;
    }
    onChange(value.includes(code) ? value.filter((d) => d !== code) : [...value, code]);
  };

  return (
    <div className="kd-weekdays" role={single ? "radiogroup" : "group"} aria-label="Delivery days">
      {days.map((d) => {
        const on = value.includes(d.code);
        return (
          <button
            key={d.code}
            type="button"
            role={single ? "radio" : "checkbox"}
            aria-checked={on}
            className={`kd-weekdays__day ${on ? "is-on" : ""}`}
            onClick={() => toggle(d.code)}
          >
            {d.short}
          </button>
        );
      })}
    </div>
  );
}
