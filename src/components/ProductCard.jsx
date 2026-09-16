import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import { isLoggedIn } from "../api/client";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { PRODUCT_FALLBACK } from "../utils/images";
import "./ProductCard.css";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const toast = useToast();

  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
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
    <article className="pcard kd-card kd-card--hover">
      <div className="pcard__media">
        <img
          src={product.imageUrl || PRODUCT_FALLBACK}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = PRODUCT_FALLBACK;
          }}
        />

        {product.isTrending && (
          <span className="kd-badge kd-badge--gold pcard__tag">Bestseller</span>
        )}
      </div>

      <div className="pcard__body">
        {product.category && (
          <span className="pcard__cat">{product.category}</span>
        )}

        <h3 className="pcard__name" title={product.name}>
          {product.name}
        </h3>

        <div className="pcard__foot">
          <span className="pcard__price">
            <span className="pcard__rupee">₹</span>
            {product.price}
          </span>

          <button
            className="kd-btn kd-btn--primary kd-btn--sm pcard__add"
            onClick={handleAdd}
            disabled={adding}
            aria-label={`Add ${product.name} to cart`}
          >
            {adding ? (
              <span className="kd-spinner" aria-hidden="true" />
            ) : (
              <FiShoppingBag aria-hidden="true" />
            )}
            {adding ? "Adding" : "Add"}
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
