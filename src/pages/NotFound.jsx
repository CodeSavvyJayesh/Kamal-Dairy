import { Link } from "react-router-dom";
import "./NotFound.css";

function NotFound() {
  return (
    <div className="nf">
      <div className="kd-container nf__inner">
        <span className="nf__code" aria-hidden="true">
          404
        </span>

        <h1>This page has gone sour</h1>

        <p>
          The link is broken or the page has moved. Everything else is still
          fresh, we promise.
        </p>

        <div className="nf__actions">
          <Link to="/" className="kd-btn kd-btn--primary kd-btn--lg">
            Back to home
          </Link>
          <Link to="/products" className="kd-btn kd-btn--outline kd-btn--lg">
            Browse products
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
