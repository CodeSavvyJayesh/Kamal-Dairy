import { api } from "./client";

// ------------------------------------------------------------------ public

export const getProduct = (id) => api(`/api/products/${id}/details`);

/** Summary + one page of published reviews. sort: recent | highest | lowest. */
export const getProductReviews = (id, { sort = "recent", stars = null, page = 0, size = 6 } = {}) =>
  api(
    `/api/products/${id}/reviews?sort=${sort}&page=${page}&size=${size}${stars ? `&stars=${stars}` : ""}`
  );

// ---------------------------------------------------------------- customer

export const getReviewEligibility = (productId) =>
  api(`/api/reviews/eligibility?productId=${productId}`, { auth: true });

export const getMyReviews = () => api("/api/reviews/mine", { auth: true });

/** Creates the review, or edits the caller's existing one for this product. */
export const saveReview = (productId, { rating, title, body }) =>
  api("/api/reviews", { method: "POST", auth: true, body: { productId, rating, title, body } });

export const deleteReview = (id) => api(`/api/reviews/${id}`, { method: "DELETE", auth: true });

// ------------------------------------------------------------------- admin

/** filter: ALL | LOW | UNANSWERED | HIDDEN */
export const getAdminReviews = (filter = "ALL", page = 0, size = 20) =>
  api(`/api/admin/reviews?filter=${filter}&page=${page}&size=${size}`, { auth: true });

export const getReviewStats = () => api("/api/admin/reviews/stats", { auth: true });

export const hideReview = (id, reason) =>
  api(`/api/admin/reviews/${id}/hide`, { method: "POST", auth: true, body: { text: reason } });

export const showReview = (id) => api(`/api/admin/reviews/${id}/show`, { method: "POST", auth: true });

/** Blank text removes the reply. */
export const replyToReview = (id, text) =>
  api(`/api/admin/reviews/${id}/reply`, { method: "PUT", auth: true, body: { text } });
