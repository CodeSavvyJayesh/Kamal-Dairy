import { useParams } from "react-router-dom";
import products from "../data/products";
import ProductCard from "../components/ProductCard";
import "./CategoryProducts.css";

function CategoryProducts() {
  const { category } = useParams();

  const filtered = products.filter(
    (item) =>
      item.category.toLowerCase().replaceAll(" ", "") ===
      category.toLowerCase().replaceAll(" ", "")
  );

  return (
    <section className="category-page">
      <h1 className="category-title">
        {category.toUpperCase()} PRODUCTS
      </h1>

      {filtered.length === 0 ? (
        <p className="no-products">No products found.</p>
      ) : (
        <div className="category-grid">
          {filtered.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      )}
    </section>
  );
}

export default CategoryProducts;