import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import "./TrendingProducts.css";

/**
 * Goes through api/client like everything else now - it used to use a raw
 * fetch with its own error handling, and its "ADD TO CART" button had no
 * onClick at all.
 */
function TrendingProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const data = await api("/api/trending-products");
        if (alive) setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        if (alive) setError(err.message);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="kd-section trending">
      <div className="kd-section-head">
        <span className="kd-eyebrow">Most loved</span>
        <h2>This week&apos;s bestsellers</h2>
        <p>What Mumbai keeps reordering, morning after morning.</p>
      </div>

      {error && <p className="kd-alert trending__error">{error}</p>}

      {loading ? (
        <div className="product-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="kd-empty">
          <div className="kd-empty__icon">🥛</div>
          <h2>Nothing trending yet</h2>
          <p>Browse the full range instead — there is plenty to love.</p>
          <Link to="/products" className="kd-btn kd-btn--primary">
            Shop all products
          </Link>
        </div>
      ) : (
        <>
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="trending__more">
            <Link to="/products" className="kd-btn kd-btn--outline kd-btn--lg">
              View all categories
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

export default TrendingProducts;
