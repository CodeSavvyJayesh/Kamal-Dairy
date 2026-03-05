import { useEffect, useState } from "react";
import "./Cart.css";

function Cart() {

  const [cartItems, setCartItems] = useState([]);

  const token = localStorage.getItem("token");

  // load cart
  const loadCart = async () => {

    try {

      const res = await fetch(
        "http://localhost:8080/api/cart",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      setCartItems(data);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // remove item
  const removeItem = async (id) => {

    await fetch(
      `http://localhost:8080/api/cart/remove/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    loadCart();
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <section className="cart-page">

      <h1 className="cart-title">🛒 Your Shopping Cart</h1>

      {cartItems.length === 0 ? (

        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some fresh dairy products 🥛</p>
        </div>

      ) : (

        <>
          <div className="cart-list">

            {cartItems.map((item) => (

              <div className="cart-card" key={item.id}>

                <div className="cart-info">
                  <h3>{item.productName}</h3>
                  <p>
                    ₹{item.price} × <strong>{item.quantity}</strong>
                  </p>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id)}
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