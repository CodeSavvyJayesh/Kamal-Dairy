import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./ProductCard.css";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="product-card">
      {/* IMAGE */}
      <div className="product-image">
        <img
          src={product.image}
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
          onClick={() => addToCart(product)}
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