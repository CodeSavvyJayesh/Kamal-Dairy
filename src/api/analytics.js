import { api } from "./client";

/** Admin: the last `days` days (7–365) compared with the same number of days before. */
export const getSalesAnalytics = (days = 30) =>
  api(`/api/admin/analytics/sales?days=${days}`, { auth: true });
