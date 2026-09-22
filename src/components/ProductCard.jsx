import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { isLoggedIn } from "../api/client";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { PRODUCT_FALLBACK } from "../utils/images";
import { stockState } from "../utils/orders";
import { Stars } from "./Stars";
import "./ProductCard.css";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const toast = useToast();

  const [adding, setAdding] = useState(false);
  const stock = stockState(product.stock);

  const handleAdd = async () => {
    if (stock.out) return;

    if (!isLoggedIn()) {
      toast.info("Sign in to start your order.");
      navigate("/login");
      return;
    }

    setAdding(true);

    try {
      // Only the product id and quantity are sent. Name and price are resolved
      // by the backend from the products table, so the browser can never
      // decide what an item costs.
      await addItem(product.id, 1);
      toast.success(`${product.name} added to cart`);
    } catch (err) {
      if (err.status === 401) {
        navigate("/login");
        return;
      }
      toast.error(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <article className={`pcard kd-card kd-card--hover ${stock.out ? "is-soldout" : ""}`}>
      <Link to={`/product/${product.id}`} className="pcard__media" tabIndex={-1} aria-hidden="true">
        <img
          src={product.imageUrl || PRODUCT_FALLBACK}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = PRODUCT_FALLBACK;
          }}
        />

        {product.isTrending && !stock.out && (
          <span className="kd-badge kd-badge--gold pcard__tag">Bestseller</span>
        )}

        {stock.out && <span className="pcard__soldout">Sold out</span>}
        {stock.low && <span className="pcard__left">Only {stock.left} left</span>}
      </Link>

      <div className="pcard__body">
        {product.category && (
          <span className="pcard__cat">{product.category}</span>
        )}

        <h3 className="pcard__name" title={product.name}>
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>

        <div className="pcard__rating">
          {product.ratingCount > 0 && (
            <>
              <Stars value={product.ratingAverage} size="sm" />
              <span>
                {Number(product.ratingAverage).toFixed(1)}
                <span className="pcard__rating-count"> ({product.ratingCount})</span>
              </span>
            </>
          )}
        </div>

        <div className="pcard__foot">
          <span className="pcard__price">
            <span className="pcard__rupee">₹</span>
            {product.price}
          </span>

          <button
            className="kd-btn kd-btn--primary kd-btn--sm pcard__add"
            onClick={handleAdd}
            disabled={adding || stock.out}
            aria-label={stock.out ? `${product.name} is sold out` : `Add ${product.name} to cart`}
          >
            {stock.out ? (
              "Sold out"
            ) : (
              <>
                {adding ? (
                  <span className="kd-spinner" aria-hidden="true" />
                ) : (
                  <FiShoppingBag aria-hidden="true" />
                )}
                {adding ? "Adding" : "Add"}
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
