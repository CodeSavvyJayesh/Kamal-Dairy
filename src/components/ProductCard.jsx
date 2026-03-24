import "./ProductCard.css";

function ProductCard({ product }) {

  const addToCart = async () => {

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    try {

      const params = new URLSearchParams({
        productId: product.id,
        productName: product.name,
        price: product.price
      });

      const res = await fetch(
        `http://15.207.98.62:8080/api/cart/add?${params}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!res.ok) {
        throw new Error("Failed to add item to cart");
      }

      alert("Added to cart 🛒");

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="product-card">

      {/* IMAGE */}
      <div className="product-image">
        <img
          src={product.imageUrl}
          alt={product.name}
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/300x300?text=No+Image";
          }}
        />
      </div>

      {/* INFO */}
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">₹{product.price}</p>
      </div>

      {/* ACTIONS */}
      <div className="product-actions">

        <button
          className="btn-outline"
          onClick={addToCart}
        >
          ADD TO CART
        </button>

        <button className="btn-solid">
          KNOW MORE
        </button>

      </div>

    </div>
  );
}

export default ProductCard;