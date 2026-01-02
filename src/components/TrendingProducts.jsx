import "./TrendingProducts.css";

function TrendingProducts() {
  const products = [
    {
      name: "Mother Dairy Full Cream Cow Milk 1L",
      price: "₹62",
      image: "/images/milk/Kamal Dairy Full Cream Milk 1L.jpg",
    },
    {
      name: "Heritage Fresh Farm Cow Milk 1L",
      price: "₹58",
      image: "/images/milk/FreshFarm Double Toned Milk 1L.jpg",
    },
    {
      name: "Heritage Fresh Paneer 200g",
      price: "₹85",
      image: "/images/paneer/DailyFresh Classic Paneer 500g.jpg",
    },
    {
      name: "DairyLane Malai Paneer",
      price: "₹120",
      image: "/images/paneer/CreamLand Malai Paneer 1kg.jpg",
    },
  ];

  return (
    <section className="trending-section">
      <h2 className="trending-title">Most Purchased</h2>

      <div className="trending-grid">
        {products.map((item, index) => (
          <div className="trend-card" key={index}>
            <img src={item.image} alt={item.name} />

            <h3>{item.name}</h3>
            <p className="price">{item.price}</p>

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