/**
 * Formatting helpers shared by the wallet and subscription screens.
 *
 * Dates from the API are plain "YYYY-MM-DD" strings (a delivery day, not an
 * instant). new Date("2026-09-23") would parse that as UTC midnight and show
 * the previous day for anyone west of UTC, so dates are always built from
 * their parts in local time.
 */

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const INR_WHOLE = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** ₹1,250.00 */
export const rupees = (value) => INR.format(Number(value || 0));

/** ₹1,250 when whole, ₹80.96 otherwise */
export const rupeesShort = (value) => {
  const n = Number(value || 0);
  return Number.isInteger(n) ? INR_WHOLE.format(n) : INR.format(n);
};

export function parseDay(iso) {
  if (!iso) return null;
  const [y, m, d] = String(iso).slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function toISODay(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(iso, n) {
  const d = parseDay(iso);
  d.setDate(d.getDate() + n);
  return toISODay(d);
}

export const todayISO = () => toISODay(new Date());

/** "Wed, 23 Sep" */
export function formatDay(iso, options) {
  const d = parseDay(iso);
  if (!d) return "";
  return d.toLocaleDateString(
    "en-IN",
    options ?? { weekday: "short", day: "numeric", month: "short" }
  );
}

/** "Today", "Tomorrow" or "Wed, 23 Sep" */
export function relativeDay(iso) {
  if (!iso) return "";
  const today = todayISO();
  if (iso === today) return "Today";
  if (iso === addDays(today, 1)) return "Tomorrow";
  return formatDay(iso);
}

/** "22 Sep, 2:05 pm" for ledger timestamps (server sends local IST datetimes) */
export function formatDateTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function hourLabel(hour) {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
}

export const WEEKDAYS = [
  { code: "MON", short: "Mon", letter: "M" },
  { code: "TUE", short: "Tue", letter: "T" },
  { code: "WED", short: "Wed", letter: "W" },
  { code: "THU", short: "Thu", letter: "T" },
  { code: "FRI", short: "Fri", letter: "F" },
  { code: "SAT", short: "Sat", letter: "S" },
  { code: "SUN", short: "Sun", letter: "S" },
];

/** "Mon, Wed, Fri" */
export const weekdayList = (codes = []) =>
  WEEKDAYS.filter((d) => codes.includes(d.code))
    .map((d) => d.short)
    .join(", ");

/** "Every day", "Mon, Wed, Fri", "Saturdays", "Every 30 days" */
export function scheduleLabel(sub) {
  if (!sub) return "";
  if (sub.frequency === "WEEKLY" && sub.daysOfWeek?.length === 1) {
    const d = WEEKDAYS.find((w) => w.code === sub.daysOfWeek[0]);
    return d ? `Every ${d.short}` : sub.frequencyLabel;
  }
  if (sub.frequency === "CUSTOM_DAYS") return weekdayList(sub.daysOfWeek);
  return sub.frequencyLabel;
}
