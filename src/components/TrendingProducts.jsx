import { useEffect, useState } from "react";
import "./TrendingProducts.css";

function TrendingProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/trending-products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch trending products");
        }
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <section className="trending-section">
      <h2 className="trending-title">Most Purchased</h2>

      {/* 🔄 LOADING */}
      {loading && <p style={{ textAlign: "center" }}>Loading products...</p>}

      {/* ❌ ERROR */}
      {error && (
        <p style={{ textAlign: "center", color: "red" }}>
          {error}
        </p>
      )}

      {/* 📦 EMPTY DATA */}
      {!loading && !error && products.length === 0 && (
        <p style={{ textAlign: "center" }}>No trending products available.</p>
      )}

      {/* ✅ PRODUCTS */}
      <div className="trending-grid">
        {!loading &&
          !error &&
          products.map((item) => (
            <div className="trend-card" key={item.id}>
              <img src={item.imageUrl} alt={item.name} />

              <h3>{item.name}</h3>
              <p className="price">₹{item.price}</p>

              <div className="trend-actions">
                <button className="btn-primary">ADD TO CART</button>
                <button className="btn-secondary">KNOW MORE</button>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}

export default TrendingProducts;