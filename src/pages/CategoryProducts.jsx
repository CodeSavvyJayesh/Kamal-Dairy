import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "./CategoryProducts.css";

function CategoryProducts() {
  const { category } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`http://localhost:8080/api/products/${category}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch products");
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
  }, [category]);

  return (
    <section className="category-page">
      <h1 className="category-title">
        {category.toUpperCase()} PRODUCTS
      </h1>

      {loading && (
        <p className="no-products">Loading products...</p>
      )}

      {error && (
        <p className="no-products">{error}</p>
      )}

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