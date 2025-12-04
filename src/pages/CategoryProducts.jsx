import { useParams } from "react-router-dom";
import products from "../data/products";
import ProductCard from "../components/ProductCard";

function CategoryProducts() {
  const { category } = useParams();

  const filtered = products.filter(
    (item) =>
      item.category.toLowerCase().replaceAll(" ", "") ===
      category.toLowerCase().replaceAll(" ", "")
  );

  return (
    <div style={{ padding: "20px", backgroundColor:"#fffaf0" }}>
      <h1 style={{ marginBottom: "20px" }}>{category.toUpperCase()} PRODUCTS</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
        }}
      >
        {filtered.map((prod) => (
          <ProductCard key={prod.id} product={prod} />
        ))}
      </div>
    </div>
  );
}

export default CategoryProducts;
