import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { FiCalendar, FiEdit2, FiLock, FiShoppingBag, FiTruck } from "react-icons/fi";
import { isLoggedIn } from "../api/client";
import { getProduct, getProductReviews, getReviewEligibility } from "../api/reviews";
import ReviewForm from "../components/ReviewForm";
import ReviewItem from "../components/ReviewItem";
import { Stars } from "../components/Stars";
import { QuantityStepper } from "../components/SubscriptionBits";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { PRODUCT_FALLBACK } from "../utils/images";
import { stockState } from "../utils/orders";
import "./ProductDetail.css";

const PAGE = 6;
const SORTS = [
  { id: "recent", label: "Most recent" },
  { id: "highest", label: "Highest rated" },
  { id: "lowest", label: "Lowest rated" },
];

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { addItem } = useCart();

  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  const [summary, setSummary] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [sort, setSort] = useState("recent");
  const [stars, setStars] = useState(null);

  const [eligibility, setEligibility] = useState(null);
  const [writing, setWriting] = useState(false);

  const loggedIn = isLoggedIn();

  const loadProduct = useCallback(async () => {
    try {
      setProduct(await getProduct(id));
      setNotFound(false);
    } catch (err) {
      if (err.status === 404) setNotFound(true);
      else toast.error(err.message);
    }
  }, [id, toast]);

  const loadReviews = useCallback(
    async (p) => {
      setLoadingReviews(true);
      try {
        const data = await getProductReviews(id, { sort, stars, page: p, size: PAGE });
        setSummary(data);
        setReviews((list) => (p === 0 ? data.reviews.content : [...list, ...data.reviews.content]));
        setHasMore(!data.reviews.last);
        setPage(p);
      } catch (err) {
        if (err.status !== 404) toast.error(err.message);
      } finally {
        setLoadingReviews(false);
      }
    },
    [id, sort, stars, toast]
  );

  const loadEligibility = useCallback(async () => {
    if (!isLoggedIn()) return;
    try {
      setEligibility(await getReviewEligibility(id));
    } catch {
      // The page still works without it.
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
    loadEligibility();
  }, [loadProduct, loadEligibility]);

  useEffect(() => {
    loadReviews(0);
  }, [loadReviews]);

  const afterReviewChange = () => {
    setWriting(false);
    loadProduct();
    loadEligibility();
    loadReviews(0);
  };

  const stock = stockState(product?.stock);
  const maxQty = stock.tracked ? Math.max(1, Math.min(stock.left, 20)) : 20;

  const add = async () => {
    if (!isLoggedIn()) {
      toast.info("Sign in to start your order.");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    setAdding(true);
    try {
      await addItem(product.id, qty);
      toast.success(`${qty} × ${product.name} added to cart`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAdding(false);
    }
  };

  if (notFound) {
    return (
      <div className="kd-container page-body">
        <div className="kd-empty">
          <div className="kd-empty__icon">🥛</div>
          <h2>We could not find that product</h2>
          <p>It may have been removed from the catalogue.</p>
          <Link to="/products" className="kd-btn kd-btn--primary kd-btn--lg">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="kd-container page-body">
        <div className="pdp">
          <div className="kd-skel pdp__skel-media" />
          <div className="pdp__skel-info">
            <div className="kd-skel" />
            <div className="kd-skel" />
            <div className="kd-skel" />
          </div>
        </div>
      </div>
    );
  }

  const count = summary?.count ?? product.ratingCount ?? 0;
  const average = summary?.average ?? product.ratingAverage;
  const myReview = eligibility?.review ?? null;
  const others = reviews.filter((r) => r.id !== myReview?.id);

  return (
    <div className="kd-container page-body">
      <nav className="pdp__crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <Link to="/products">Products</Link>
        {product.category && (
          <>
            <span aria-hidden="true">/</span>
            <Link to={`/products/${encodeURIComponent(product.category)}`}>{product.category}</Link>
          </>
        )}
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>

      <div className="pdp">
        <div className={`pdp__media ${stock.out ? "is-soldout" : ""}`}>
          <img
            src={product.imageUrl || PRODUCT_FALLBACK}
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = PRODUCT_FALLBACK;
            }}
          />
          {stock.out && <span className="pdp__soldout">Sold out</span>}
        </div>

        <div className="pdp__info">
          {product.category && <span className="pdp__cat">{product.category}</span>}
          <h1 className="pdp__name">{product.name}</h1>

          <a href="#reviews" className="pdp__rating">
            {count > 0 ? (
              <>
                <Stars value={average} />
                <b>{Number(average).toFixed(1)}</b>
                <span>
                  · {count} {count === 1 ? "review" : "reviews"}
                </span>
              </>
            ) : (
              <span>No reviews yet</span>
            )}
          </a>

          <div className="pdp__price">
            <span className="pdp__rupee">₹</span>
            {product.price}
          </div>

          <p className={`pdp__stock ${stock.out ? "is-out" : stock.low ? "is-low" : ""}`}>
            {stock.out
              ? "Sold out right now – check back soon"
              : stock.low
              ? `Only ${stock.left} left`
              : "In stock, delivered fresh"}
          </p>

          {!stock.out && (
            <div className="pdp__buy">
              <QuantityStepper value={qty} onChange={setQty} min={1} max={maxQty} />
              <button className="kd-btn kd-btn--primary kd-btn--lg pdp__add" onClick={add} disabled={adding}>
                {adding ? (
                  <span className="kd-spinner" aria-hidden="true" />
                ) : (
                  <FiShoppingBag aria-hidden="true" />
                )}
                {adding ? "Adding…" : "Add to cart"}
              </button>
            </div>
          )}

          <Link to="/subscriptions/new?plan=daily" className="pdp__subscribe">
            <FiCalendar aria-hidden="true" />
            <span>
              <strong>Get it delivered on a schedule</strong>
              <small>Daily, weekly or monthly – save up to 10% with a subscription</small>
            </span>
          </Link>

          <ul className="pdp__trust">
            <li>
              <FiTruck aria-hidden="true" /> Free delivery across Mumbai
            </li>
            <li>
              <FiLock aria-hidden="true" /> Secure payment or Kamal Wallet
            </li>
          </ul>
        </div>
      </div>

      {/* ---------------- reviews ---------------- */}
      <section className="prev" id="reviews" aria-labelledby="prev-title">
        <h2 id="prev-title" className="prev__title">
          Customer reviews
        </h2>

        <div className="prev__grid">
          <aside className="prev__summary kd-panel">
            {count > 0 ? (
              <>
                <div className="prev__avg">
                  <strong>{Number(average).toFixed(1)}</strong>
                  <div>
                    <Stars value={average} size="lg" />
                    <span>
                      {count} verified {count === 1 ? "review" : "reviews"}
                    </span>
                  </div>
                </div>

                <ul className="prev__dist" aria-label="Filter by rating">
                  {summary?.distribution.map((b) => {
                    const pct = count ? Math.round((b.count / count) * 100) : 0;
                    const on = stars === b.stars;
                    return (
                      <li key={b.stars}>
                        <button
                          type="button"
                          className={`prev__bucket ${on ? "is-on" : ""}`}
                          aria-pressed={on}
                          disabled={b.count === 0}
                          onClick={() => setStars(on ? null : b.stars)}
                          aria-label={`${b.stars} stars: ${b.count} ${b.count === 1 ? "review" : "reviews"}${
                            on ? ", filtered" : ""
                          }`}
                        >
                          <span className="prev__bucket-label">{b.stars} ★</span>
                          <span className="prev__bucket-track">
                            <span className="prev__bucket-fill" style={{ width: `${pct}%` }} />
                          </span>
                          <span className="prev__bucket-count">{b.count}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <div className="prev__none">
                <Stars value={0} size="lg" label="No ratings yet" />
                <p>No reviews yet. Customers who receive this product can be the first.</p>
              </div>
            )}

            <div className="prev__write">
              {!loggedIn ? (
                <p>
                  Bought this?{" "}
                  <Link to="/login" state={{ from: location.pathname }}>
                    Sign in
                  </Link>{" "}
                  to review it.
                </p>
              ) : eligibility && !eligibility.eligible ? (
                <p>{eligibility.reason}</p>
              ) : eligibility && !myReview && !writing ? (
                <button className="kd-btn kd-btn--outline kd-btn--block" onClick={() => setWriting(true)}>
                  <FiEdit2 aria-hidden="true" /> Write a review
                </button>
              ) : null}
            </div>
          </aside>

          <div className="prev__list kd-panel">
            {writing && (
              <div className="prev__form">
                <h3>{myReview ? "Edit your review" : "Write a review"}</h3>
                <ReviewForm
                  productId={product.id}
                  existing={myReview}
                  onSaved={afterReviewChange}
                  onDeleted={afterReviewChange}
                  onCancel={() => setWriting(false)}
                />
              </div>
            )}

            {myReview && !writing && (
              <div className="prev__mine">
                <ReviewItem review={myReview} mine />
                {myReview.status === "HIDDEN" && (
                  <p className="prev__mine-note">Hidden from the product page by Kamal Dairy.</p>
                )}
                <button className="kd-btn kd-btn--ghost kd-btn--sm" onClick={() => setWriting(true)}>
                  <FiEdit2 aria-hidden="true" /> Edit your review
                </button>
              </div>
            )}

            {count > 0 && (
              <div className="prev__tools">
                <span>
                  {stars
                    ? `${summary?.distribution.find((b) => b.stars === stars)?.count ?? 0} with ${stars} ${
                        stars === 1 ? "star" : "stars"
                      }`
                    : `${count} ${count === 1 ? "review" : "reviews"}`}
                  {stars && (
                    <button type="button" className="prev__clear" onClick={() => setStars(null)}>
                      Show all
                    </button>
                  )}
                </span>
                <label>
                  <span className="kd-sr-only">Sort reviews</span>
                  <select className="kd-select prev__sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                    {SORTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}

            <div className={`prev__items ${loadingReviews ? "is-loading" : ""}`}>
              {others.map((r) => (
                <ReviewItem key={r.id} review={r} />
              ))}
              {!loadingReviews && count > 0 && others.length === 0 && !myReview && (
                <p className="prev__empty">No reviews match this filter.</p>
              )}
              {count === 0 && !writing && !myReview && (
                <p className="prev__empty">Reviews from verified buyers will appear here.</p>
              )}
            </div>

            {hasMore && (
              <button
                className="kd-btn kd-btn--ghost kd-btn--sm prev__more"
                onClick={() => loadReviews(page + 1)}
                disabled={loadingReviews}
              >
                {loadingReviews ? "Loading…" : "Show more reviews"}
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ProductDetail;
