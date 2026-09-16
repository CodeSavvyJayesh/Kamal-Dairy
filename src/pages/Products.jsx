import { Link } from "react-router-dom";
import "./Products.css";

const CATEGORIES = [
  { name: "Milk", icon: "🥛", blurb: "Cow, buffalo, A2, toned" },
  { name: "Paneer", icon: "🧀", blurb: "Soft, fresh, same-day" },
  { name: "Butter", icon: "🧈", blurb: "Salted & unsalted" },
  { name: "Ghee", icon: "🍯", blurb: "Bilona and cultured" },
  { name: "Ice Cream", icon: "🍨", blurb: "Tubs and family packs" },
  { name: "Buttermilk", icon: "🥤", blurb: "Spiced and plain" },
  { name: "Yoghurt", icon: "🍶", blurb: "Set curd and Greek" },
  { name: "Cheese", icon: "🧀", blurb: "Slices, cubes, spreads" },
  { name: "Lassi", icon: "🥛", blurb: "Sweet, salted, mango" },
  { name: "Powdered Milk", icon: "🥄", blurb: "Full cream and skimmed" },
  { name: "Shrikhand", icon: "🍮", blurb: "Kesar, elaichi, mango" },
  { name: "Chaas", icon: "🥛", blurb: "Chilled, ready to drink" },
];

const slug = (name) => name.toLowerCase().replaceAll(" ", "");

function Products() {
  return (
    <>
      <header className="page-head">
        <div className="kd-container">
          <span className="kd-eyebrow">The full range</span>
          <h1>Discover our dairy collection</h1>
          <p>
            Twelve categories, sourced from eleven trusted brands and delivered
            fresh to your door.
          </p>
        </div>
      </header>

      <div className="kd-container page-body">
        <div className="cats">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.name}
              to={`/products/${slug(cat.name)}`}
              className="cat kd-card kd-card--hover"
              style={{ animationDelay: `${i * 35}ms` }}
            >
              <span className="cat__icon" aria-hidden="true">
                {cat.icon}
              </span>

              <div className="cat__text">
                <h3>{cat.name}</h3>
                <p>{cat.blurb}</p>
              </div>

              <span className="cat__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default Products;
