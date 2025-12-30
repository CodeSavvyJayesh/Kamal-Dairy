import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function Cart() {
  const { cartItems, removeFromCart } = useContext(CartContext);

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <div style={{ padding: "30px", background: "#fffaf0" }}>
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                padding: "15px",
                marginBottom: "15px",
                background: "#fff",
                borderRadius: "12px",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{ width: "80px" }}
              />

              <div style={{ flex: 1 }}>
                <h3>{item.name}</h3>
                <p>₹{item.price} × {item.qty}</p>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                style={{
                  background: "#e63946",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
          ))}

          <h2>Total: ₹{total}</h2>
        </>
      )}
    </div>
  );
}

export default Cart;
