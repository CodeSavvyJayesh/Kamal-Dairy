import { Link } from "react-router-dom";

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
    <div className="products-page">
      {/* HEADER */}
      <div className="products-header">
        <h1 >Discover Our Dairy Collection</h1>
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
              <span className="explore-text"> Explore →</span>
            </div>
          </Link>
        ))}
      </div>

      {/* CSS */}
      <style>
        {`
        /* PAGE */
        .products-page {
          min-height: 100vh;
          padding: 10px 0px;
          background: radial-gradient(circle at top, #f2f3cdff, #fffaf0);
        }

        /* HEADER */
        .products-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 70px;
         
        }

        .products-header h1 {
          font-size: 44px;
          font-weight: 800;
          color: #0a2540;
          margin-bottom: 12px;
        }

        .products-header p {
          font-size: 18px;
          color: #555;
          line-height: 1.6;
        }

        /* GRID */
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
          gap: 35px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .category-link {
          text-decoration: none;
        }

        /* CARD */
        .category-card {
          position: relative;
          padding: 40px 20px;
          border-radius: 26px;
          text-align: center;
         
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(14px);
          box-shadow: 0 25px 60px rgba(0,0,0,0.20);
          transition: all 0.45s ease;
          overflow: hidden;
        }

        /* GLOW EFFECT */
        .category-card::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top, rgba(9, 55, 78, 0.35), transparent 70%);
          opacity: 0;
          transition: 0.4s;
        }

        .category-card:hover::before {
          opacity: 1;
          
        }

        .category-card:hover {
          transform: translateY(-14px) scale(1.05);
          box-shadow: 0 40px 90px rgba(0,0,0,0.28);
          background: linear-gradient(135deg, #f1ea6aff, #eddaa6ff);
         
        }
        
       

        /* ICON */
        .icon-wrapper {
          width: 80px;
          height: 80px;
          margin: 0 auto 18px;
          border-radius: 50%;
          background: rgba(255,255,255,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 40px;
          transition: 0.4s;
        }

        .category-card:hover .icon-wrapper {
          transform: rotate(10deg) scale(1.2);
        }

        /* TEXT */
        .category-card h3 {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 12px;
        
        }

        .explore-text {
          font-size: 16px;
          letter-spacing: 0.9px;
          opacity: 0.8;
          text-align: center;
        }
        `}
      </style>
    </div>
  );
}

export default Products;
