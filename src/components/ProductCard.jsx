import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, isLoggedIn } from "../api/client";
import "./ProductCard.css";

function ProductCard({ product }) {

  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const addToCart = async () => {

    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    setAdding(true);

    try {
      // Only the product id and quantity are sent. The name and price are
      // resolved by the backend from the products table, so the browser can
      // no longer decide what an item costs.
      await api(
        `/api/cart/add?productId=${encodeURIComponent(product.id)}&quantity=1`,
        { method: "POST", auth: true }
      );

      alert("Added to cart");

    } catch (err) {
      if (err.status === 401) {
        navigate("/login");
        return;
      }
      alert(err.message);

    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="product-card">

      <div className="product-image">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://via.placeholder.com/300x300?text=No+Image";
          }}
        />
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="price">Rs {product.price}</p>
      </div>

      <div className="product-actions">

        <button
          className="btn-outline"
          onClick={addToCart}
          disabled={adding}
        >
          {adding ? "ADDING..." : "ADD TO CART"}
        </button>

        <button className="btn-solid">
          KNOW MORE
        </button>

      </div>

    </div>
  );
}

export default ProductCard;
