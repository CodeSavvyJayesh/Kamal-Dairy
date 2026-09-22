import { FiCheckCircle, FiCornerDownRight } from "react-icons/fi";
import { Stars } from "./Stars";
import "./Reviews.css";

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/** One published review, with the dairy's reply under it when there is one. */
function ReviewItem({ review, mine = false }) {
  return (
    <article className={`ritem ${mine ? "is-mine" : ""}`}>
      <header className="ritem__head">
        <Stars value={review.rating} size="sm" />
        {review.title && <h3 className="ritem__title">{review.title}</h3>}
      </header>

      <p className="ritem__meta">
        <span className="ritem__author">{mine ? "You" : review.authorName}</span>
        <span className="ritem__verified">
          <FiCheckCircle aria-hidden="true" />
          {review.verifiedVia === "SUBSCRIPTION" ? "Subscriber" : "Verified buyer"}
        </span>
        <span>
          {formatDate(review.createdAt)}
          {review.edited ? " · edited" : ""}
        </span>
      </p>

      {review.body && <p className="ritem__body">{review.body}</p>}

      {review.reply && (
        <div className="ritem__reply">
          <FiCornerDownRight aria-hidden="true" />
          <div>
            <strong>Reply from Kamal Dairy</strong>
            <p>{review.reply}</p>
          </div>
        </div>
      )}
    </article>
  );
}

export default ReviewItem;
