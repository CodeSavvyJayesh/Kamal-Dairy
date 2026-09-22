import { todayISO } from "./format";

/** "now" if today falls inside the vacation, "upcoming" if it is still ahead, else null. */
export function vacationState(sub) {
  if (!sub?.vacationStart || !sub?.vacationEnd) return null;
  const today = todayISO();
  if (sub.vacationEnd < today) return null;
  return sub.vacationStart <= today ? "now" : "upcoming";
}

/** Status to show on a card: an active subscription on vacation reads as "On vacation". */
export function displayStatus(sub) {
  if (sub.status === "ACTIVE" && vacationState(sub) === "now") return "VACATION";
  return sub.status;
}

export const PLAN_META = {
  daily: {
    name: "Daily Delivery",
    tagline: "Fresh milk at the door every morning, or on the days you choose.",
    icon: "\u{1F95B}",
    frequencies: ["DAILY", "ALTERNATE_DAYS", "CUSTOM_DAYS"],
    defaultCategory: "milk",
  },
  weekly: {
    name: "Weekly Essentials",
    tagline: "One drop a week on your chosen day, 8% off every time.",
    icon: "\u{1F9C0}",
    frequencies: ["WEEKLY"],
    defaultCategory: "paneer",
  },
  monthly: {
    name: "Monthly Smart Saver",
    tagline: "Pantry staples every 30 days at our lowest price.",
    icon: "\u{1F36F}",
    frequencies: ["MONTHLY"],
    defaultCategory: "ghee",
  },
};
