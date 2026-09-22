import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiCornerDownRight, FiEye, FiEyeOff, FiMessageSquare, FiRefreshCw } from "react-icons/fi";
import { getAdminReviews, getReviewStats, hideReview, replyToReview, showReview } from "../../api/reviews";
import { useToast } from "../../context/ToastContext";
import { formatDateTime } from "../../utils/format";
import Modal from "../Modal";
import { Stars } from "../Stars";
import "../Reviews.css";
import "./AdminSubscriptions.css";
import "./AdminOrders.css";
import "./AdminReviews.css";

const FILTERS = [
  { key: "ALL", label: "All" },
  { key: "LOW", label: "1–2 stars", count: (s) => s.low },
  { key: "UNANSWERED", label: "Not replied", count: (s) => s.unanswered },
  { key: "HIDDEN", label: "Hidden", count: (s) => s.hidden },
];

const MAX_REPLY = 500;

/** Moderation desk: read every review, reply in public, hide what should not be shown. */
function AdminReviews({ onError }) {
  const toast = useToast();

  const [filter, setFilter] = useState("ALL");
  const [stats, setStats] = useState(null);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  const [replying, setReplying] = useState(null);
  const [draft, setDraft] = useState("");
  const [hiding, setHiding] = useState(null);
  const [reason, setReason] = useState("");

  const loadStats = useCallback(async () => {
    try {
      setStats(await getReviewStats());
    } catch (err) {
      onError(err);
    }
  }, [onError]);

  const load = useCallback(
    async (p) => {
      setLoading(true);
      try {
        const data = await getAdminReviews(filter, p, 20);
        setRows((list) => (p === 0 ? data.content : [...list, ...data.content]));
        setHasMore(!data.last);
        setTotal(data.totalElements);
        setPage(p);
      } catch (err) {
        onError(err);
      } finally {
        setLoading(false);
      }
    },
    [filter, onError]
  );

  useEffect(() => {
    load(0);
  }, [load]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const matches = (r) =>
    filter === "ALL" ||
    (filter === "LOW" && r.status === "PUBLISHED" && r.rating <= 2) ||
    (filter === "UNANSWERED" && r.status === "PUBLISHED" && !r.reply) ||
    (filter === "HIDDEN" && r.status === "HIDDEN");

  const apply = (updated) => {
    if (matches(updated)) {
      setRows((list) => list.map((r) => (r.id === updated.id ? updated : r)));
    } else {
      setRows((list) => list.filter((r) => r.id !== updated.id));
      setTotal((t) => Math.max(0, t - 1));
    }
    loadStats();
  };

  const run = async (id, fn, ok) => {
    setBusy(id);
    try {
      const updated = await fn();
      apply(updated);
      toast.success(ok);
      return true;
    } catch (err) {
      toast.error(err.message);
      if (err.status === 409) load(0);
      return false;
    } finally {
      setBusy(null);
    }
  };

  const saveReply = async (r) => {
    if (await run(r.id, () => replyToReview(r.id, draft), draft.trim() ? "Reply posted" : "Reply removed")) {
      setReplying(null);
    }
  };

  const confirmHide = async () => {
    const r = hiding;
    if (await run(r.id, () => hideReview(r.id, reason), "Review hidden from the product page")) {
      setHiding(null);
    }
  };

  return (
    <div className="asubs areviews">
      <div className="admin__stats asubs__stats">
        <div className="admin__stat kd-card areviews__avg">
          <strong>{stats?.average != null ? stats.average.toFixed(1) : "–"}</strong>
          <span>
            {stats?.average != null && <Stars value={stats.average} size="sm" />} Average rating
          </span>
        </div>
        <div className="admin__stat kd-card">
          <strong>{stats?.published ?? "–"}</strong>
          <span>Published reviews</span>
        </div>
        <div className={`admin__stat kd-card ${stats?.low ? "aorders__stat--warn" : ""}`}>
          <strong>{stats?.low ?? "–"}</strong>
          <span>1–2 stars</span>
        </div>
        <div className="admin__stat kd-card">
          <strong>{stats?.unanswered ?? "–"}</strong>
          <span>Not replied yet</span>
        </div>
        <div className="admin__stat kd-card">
          <strong>{stats?.hidden ?? "–"}</strong>
          <span>Hidden</span>
        </div>
      </div>

      <section className="kd-panel asubs__panel">
        <header className="asubs__head">
          <div>
            <h2>Reviews</h2>
            <p>
              {total} {total === 1 ? "review" : "reviews"} · newest first · every one from a verified buyer
            </p>
          </div>
          <div className="asubs__tools">
            <button
              className="kd-btn kd-btn--ghost kd-btn--sm"
              onClick={() => {
                load(0);
                loadStats();
              }}
              disabled={loading}
              aria-label="Refresh"
            >
              <FiRefreshCw aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="aorders__filters" role="tablist" aria-label="Filter reviews">
          {FILTERS.map((f) => {
            const n = stats && f.count ? f.count(stats) : null;
            return (
              <button
                key={f.key}
                role="tab"
                aria-selected={filter === f.key}
                className={`bchip ${filter === f.key ? "is-on" : ""}`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
                {n !== null && <span className="aorders__count">{n}</span>}
              </button>
            );
          })}
        </div>

        {loading && rows.length === 0 ? (
          <div className="asubs__skel">
            {Array.from({ length: 3 }).map((_, i) => (
              <div className="kd-skel areviews__skel" key={i} />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <div className="asubs__empty">
            <span aria-hidden="true">⭐</span>
            <p>
              {filter === "ALL"
                ? "No reviews yet. Customers can review a product once it is delivered."
                : "Nothing here."}
            </p>
          </div>
        ) : (
          <ul className="areviews__list">
            {rows.map((r) => (
              <li key={r.id} className={`areview ${r.status === "HIDDEN" ? "is-hidden" : ""} ${r.rating <= 2 ? "is-low" : ""}`}>
                <div className="areview__top">
                  <Link to={`/product/${r.productId}`} className="areview__product">
                    {r.productName}
                  </Link>
                  <span className="areview__date">{formatDateTime(r.createdAt)}</span>
                </div>

                <div className="ritem__head">
                  <Stars value={r.rating} size="sm" />
                  {r.title && <h3 className="ritem__title">{r.title}</h3>}
                  {r.status === "HIDDEN" && <span className="kd-status kd-status--grey">Hidden</span>}
                </div>

                <p className="ritem__meta">
                  <span className="ritem__author">{r.authorName}</span>
                  <span>{r.userEmail}</span>
                  <span className="ritem__verified">
                    <FiCheckCircle aria-hidden="true" />
                    {r.verifiedVia === "SUBSCRIPTION" ? "Subscriber" : "Verified buyer"}
                  </span>
                </p>

                {r.body ? <p className="ritem__body">{r.body}</p> : <p className="areview__norating">Rating only, no text.</p>}

                {r.status === "HIDDEN" && r.hiddenReason && (
                  <p className="areview__why">Hidden because: {r.hiddenReason}</p>
                )}

                {replying === r.id ? (
                  <div className="areview__replybox">
                    <label className="kd-field">
                      <span className="kd-label">Public reply from Kamal Dairy</span>
                      <textarea
                        className="kd-textarea"
                        value={draft}
                        maxLength={MAX_REPLY}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="Thank them, or say what you are doing about it. The customer gets an email."
                        autoFocus
                      />
                      <span className="rform__count">
                        {draft.length} / {MAX_REPLY}
                      </span>
                    </label>
                    <div className="areview__actions">
                      <button className="kd-btn kd-btn--ghost kd-btn--sm" onClick={() => setReplying(null)} disabled={busy === r.id}>
                        Cancel
                      </button>
                      <button className="kd-btn kd-btn--primary kd-btn--sm" onClick={() => saveReply(r)} disabled={busy === r.id}>
                        {busy === r.id ? "Saving…" : r.reply && !draft.trim() ? "Remove reply" : "Post reply"}
                      </button>
                    </div>
                  </div>
                ) : (
                  r.reply && (
                    <div className="ritem__reply">
                      <FiCornerDownRight aria-hidden="true" />
                      <div>
                        <strong>Your reply</strong>
                        <p>{r.reply}</p>
                      </div>
                    </div>
                  )
                )}

                {replying !== r.id && (
                  <div className="areview__actions">
                    <button
                      className="kd-btn kd-btn--ghost kd-btn--sm"
                      onClick={() => {
                        setDraft(r.reply || "");
                        setReplying(r.id);
                      }}
                      disabled={busy === r.id}
                    >
                      <FiMessageSquare aria-hidden="true" /> {r.reply ? "Edit reply" : "Reply"}
                    </button>
                    {r.status === "HIDDEN" ? (
                      <button
                        className="kd-btn kd-btn--ghost kd-btn--sm"
                        onClick={() => run(r.id, () => showReview(r.id), "Review is visible again")}
                        disabled={busy === r.id}
                      >
                        <FiEye aria-hidden="true" /> Show again
                      </button>
                    ) : (
                      <button
                        className="kd-btn kd-btn--ghost kd-btn--sm areview__hide"
                        onClick={() => {
                          setReason("");
                          setHiding(r);
                        }}
                        disabled={busy === r.id}
                      >
                        <FiEyeOff aria-hidden="true" /> Hide
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}

        {hasMore && (
          <button className="kd-btn kd-btn--ghost kd-btn--sm aorders__more" onClick={() => load(page + 1)} disabled={loading}>
            {loading ? "Loading…" : "Show older"}
          </button>
        )}
      </section>

      <Modal
        open={Boolean(hiding)}
        title="Hide this review?"
        size="sm"
        onClose={() => busy === null && setHiding(null)}
        footer={
          <>
            <button className="kd-btn kd-btn--ghost" onClick={() => setHiding(null)} disabled={busy !== null}>
              Back
            </button>
            <button className="kd-btn kd-btn--danger" onClick={confirmHide} disabled={busy !== null}>
              Hide review
            </button>
          </>
        }
      >
        {hiding && (
          <>
            <p className="areview__modal-lead">
              It comes off the product page and out of the {hiding.productName} rating. You can show it again at any
              time. Hide abuse, personal details or spam – not honest bad reviews.
            </p>
            <label className="kd-field">
              <span className="kd-label">Reason (only admins see this)</span>
              <input
                className="kd-input"
                value={reason}
                maxLength={200}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Shares a phone number"
              />
            </label>
          </>
        )}
      </Modal>
    </div>
  );
}

export default AdminReviews;
