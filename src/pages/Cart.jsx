import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function Cart() {
  const { cartItems, removeFromCart } = useContext(CartContext);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div className="cart-page">
      <h1 className="cart-title">🛒 Your Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some fresh dairy products 🥛🧀</p>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((item) => (
              <div className="cart-card" key={item.id}>
                <img src={item.image} alt={item.name} />

                <div className="cart-info">
                  <h3>{item.name}</h3>
                  <p>
                    ₹{item.price} × <strong>{item.qty}</strong>
                  </p>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  ✖ Remove
                </button>
              </div>
            ))}
          </div>

          {/* TOTAL SECTION */}
          <div className="cart-total">
            <h2>Total Amount</h2>
            <h1>₹{total}</h1>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </>
      )}

      {/* STYLES */}
      <style>
        {`
        .cart-page {
          padding: 40px 20px;
          background: linear-gradient(to bottom, #fffaf0, #fdf6e3);
          min-height: 80vh;
        }

        .cart-title {
          text-align: center;
          font-size: 36px;
          margin-bottom: 40px;
          color: #1d3557;
        }

        /* EMPTY CART */
        .empty-cart {
          text-align: center;
          margin-top: 80px;
          color: #555;
        }

        .empty-cart h2 {
          font-size: 28px;
          margin-bottom: 10px;
        }

        /* CART LIST */
        .cart-list {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* CART ITEM CARD */
        .cart-card {
          display: flex;
          align-items: center;
          gap: 20px;
          background: white;
          padding: 18px;
          border-radius: 18px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .cart-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 18px 45px rgba(0,0,0,0.18);
        }

        .cart-card img {
          width: 90px;
          height: 90px;
          object-fit: contain;
          background: #fffdf7;
          border-radius: 12px;
          padding: 8px;
        }

        .cart-info {
          flex: 1;
        }

        .cart-info h3 {
          font-size: 20px;
          color: #1d3557;
          margin-bottom: 6px;
        }

        .cart-info p {
          font-size: 16px;
          color: #555;
        }

        /* REMOVE BUTTON */
        .remove-btn {
          background: #e63946;
          color: white;
          border: none;
          padding: 10px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: 0.25s;
        }

        .remove-btn:hover {
          background: #c1121f;
          transform: scale(1.05);
        }

        /* TOTAL SECTION */
        .cart-total {
          max-width: 900px;
          margin: 50px auto 0;
          background: #1d3557;
          color: white;
          padding: 30px;
          border-radius: 20px;
          text-align: center;
          box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }

        .cart-total h2 {
          font-size: 22px;
          margin-bottom: 10px;
          opacity: 0.9;
        }

        .cart-total h1 {
          font-size: 36px;
          margin-bottom: 20px;
        }

        .checkout-btn {
          background: #f4a261;
          border: none;
          padding: 14px 30px;
          font-size: 18px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.3s;
        }

        .checkout-btn:hover {
          background: #e76f51;
          transform: scale(1.05);
        }

        /* RESPONSIVE */
        @media (max-width: 600px) {
          .cart-card {
            flex-direction: column;
            text-align: center;
          }

          .cart-card img {
            width: 120px;
            height: 120px;
          }
        }
        `}
      </style>
    </div>
  );
}

export default Cart;