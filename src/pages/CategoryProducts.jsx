import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { api } from "../api/client";
import "./CategoryProducts.css";

function CategoryProducts() {
  const { category } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api(`/api/products/${encodeURIComponent(category)}`);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <section className="category-page">

      <h1 className="category-title">
        {String(category).toUpperCase()} PRODUCTS
      </h1>

      {loading && <p className="no-products">Loading products...</p>}

      {error && <p className="no-products">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <p className="no-products">No products found.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="category-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </section>
  );
}

export default CategoryProducts;
