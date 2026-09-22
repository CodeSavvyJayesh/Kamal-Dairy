import { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { deleteReview, saveReview } from "../api/reviews";
import { useToast } from "../context/ToastContext";
import { StarInput } from "./Stars";
import "./Reviews.css";

const MAX_TITLE = 80;
const MAX_BODY = 1000;

/**
 * Write or edit the signed-in customer's review of one product.
 * The server decides whether they may (verified buyers only).
 */
function ReviewForm({ productId, productName, existing, onSaved, onDeleted, onCancel }) {
  const toast = useToast();

  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [body, setBody] = useState(existing?.body ?? "");
  const [busy, setBusy] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setError("Tap the stars to choose a rating.");
      return;
    }
    setError(null);
    setBusy("save");
    try {
      const saved = await saveReview(productId, { rating, title, body });
      toast.success(existing ? "Your review is updated." : "Thanks! Your review is live.");
      onSaved?.(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  const remove = async () => {
    setBusy("delete");
    try {
      await deleteReview(existing.id);
      toast.info("Your review was deleted.");
      onDeleted?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
      setConfirmDelete(false);
    }
  };

  return (
    <form className="rform" onSubmit={submit} noValidate>
      {productName && (
        <p className="rform__product">
          Reviewing <strong>{productName}</strong>
        </p>
      )}

      {existing?.status === "HIDDEN" && (
        <p className="rform__hidden" role="status">
          Kamal Dairy has hidden this review from the product page. You can still edit or delete it.
        </p>
      )}

      <div className="rform__stars">
        <StarInput value={rating} onChange={setRating} disabled={busy !== null} />
      </div>

      <label className="kd-field">
        <span className="kd-label">
          Headline <em className="rform__opt">optional</em>
        </span>
        <input
          className="kd-input"
          value={title}
          maxLength={MAX_TITLE}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Sum it up in a few words"
        />
      </label>

      <label className="kd-field">
        <span className="kd-label">
          Your review <em className="rform__opt">optional</em>
        </span>
        <textarea
          className="kd-textarea rform__body"
          value={body}
          maxLength={MAX_BODY}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Taste, freshness, packaging, delivery – what should other customers know?"
        />
        <span className={`rform__count ${body.length > MAX_BODY - 80 ? "is-near" : ""}`}>
          {body.length} / {MAX_BODY}
        </span>
      </label>

      {error && (
        <p className="kd-alert" role="alert">
          {error}
        </p>
      )}

      <div className="rform__actions">
        {existing &&
          (confirmDelete ? (
            <span className="rform__confirm">
              Delete your review?
              <button type="button" className="kd-btn kd-btn--danger kd-btn--sm" onClick={remove} disabled={busy !== null}>
                {busy === "delete" ? "Deleting…" : "Delete"}
              </button>
              <button type="button" className="kd-btn kd-btn--ghost kd-btn--sm" onClick={() => setConfirmDelete(false)}>
                Keep
              </button>
            </span>
          ) : (
            <button
              type="button"
              className="kd-btn kd-btn--ghost kd-btn--sm rform__delete"
              onClick={() => setConfirmDelete(true)}
              disabled={busy !== null}
            >
              <FiTrash2 aria-hidden="true" /> Delete
            </button>
          ))}

        <span className="rform__spacer" />

        {onCancel && (
          <button type="button" className="kd-btn kd-btn--ghost" onClick={onCancel} disabled={busy !== null}>
            Cancel
          </button>
        )}
        <button className="kd-btn kd-btn--primary" disabled={busy !== null || !rating}>
          {busy === "save" ? (
            <>
              <span className="kd-spinner" aria-hidden="true" /> Saving…
            </>
          ) : existing ? (
            "Save changes"
          ) : (
            "Post review"
          )}
        </button>
      </div>
    </form>
  );
}

export default ReviewForm;
