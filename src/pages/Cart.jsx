import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "./Cart.css";

function Cart() {
  const { cartItems, removeFromCart } = useContext(CartContext);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <section className="cart-page">
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

          <div className="cart-total">
            <div>
              <h2>Total Amount</h2>
              <h1>₹{total}</h1>
            </div>

            <button className="checkout-btn">
              Proceed to Checkout →
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default Cart;