import { Link } from "react-router-dom";
import "./Products.css";

function Products() {
  const categories = [
    { id: 1, name: "Milk", icon: "🥛" },
    { id: 2, name: "Paneer", icon: "🧀" },
    { id: 3, name: "Butter", icon: "🧈" },
    { id: 4, name: "Ghee", icon: "🍯" },
    { id: 5, name: "Ice Cream", icon: "🍨" },
    { id: 6, name: "Buttermilk", icon: "🥤" },
    { id: 7, name: "Yoghurt", icon: "🍶" },
    { id: 8, name: "Cheese", icon: "🧀" },
    { id: 9, name: "Lassi", icon: "🥛" },
    { id: 10, name: "Powdered Milk", icon: "🥄" },
    { id: 11, name: "Shrikhand", icon: "🍮" },
    { id: 12, name: "Chaas", icon: "🥛" },
  ];

  return (
    <section className="products-page">
      {/* HEADER */}
      <div className="products-header">
        <h1>Discover Our Dairy Collection</h1>
        <p>
          Fresh, hygienic and premium dairy products curated specially for your
          daily needs.
        </p>
      </div>

      {/* GRID */}
      <div className="products-grid">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/products/${cat.name.toLowerCase().replaceAll(" ", "")}`}
            className="category-link"
          >
            <div className="category-card">
              <div className="icon-wrapper">{cat.icon}</div>
              <h3>{cat.name}</h3>
              <span className="explore-text">Explore →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Products;