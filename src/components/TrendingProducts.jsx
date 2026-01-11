import "./TrendingProducts.css";

function TrendingProducts({ products }) {
  return (
    <section className="trending-section">
      <h2 className="trending-title">Most Purchased</h2>

      <div className="trending-grid">
        {products.length === 0 ? (
          <p style={{ textAlign: "center" }}>Loading products...</p>
        ) : (
          products.map((item) => (
            <div className="trend-card" key={item.id}>
              {/* IMAGE */}
              <img src={item.imageUrl} alt={item.name} />

              {/* NAME */}
              <h3>{item.name}</h3>

              {/* PRICE */}
              <p className="price">₹{item.price}</p>

              {/* ACTIONS */}
              <div className="trend-actions">
                <button className="btn-primary">ADD TO CART</button>
                <button className="btn-secondary">KNOW MORE</button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default TrendingProducts;