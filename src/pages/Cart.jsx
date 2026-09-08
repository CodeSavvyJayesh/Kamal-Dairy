import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import "./Cart.css";

function Cart() {

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const navigate = useNavigate();

  const handleError = useCallback((err) => {
    if (err.status === 401) {
      navigate("/login");
      return;
    }
    setError(err.message);
  }, [navigate]);

  const loadCart = useCallback(async () => {
    try {
      setError(null);
      const data = await api("/api/cart", { auth: true });
      setCartItems(Array.isArray(data) ? data : []);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const removeItem = async (id) => {
    setBusy(true);
    try {
      await api(`/api/cart/remove/${id}`, { method: "DELETE", auth: true });
      await loadCart();
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
    }
  };

  const updateQuantity = async (id, qty) => {
    if (qty < 1 || qty > 99) return;

    setBusy(true);
    try {
      await api(`/api/cart/update?cartItemId=${id}&quantity=${qty}`, {
        method: "PUT",
        auth: true,
      });
      await loadCart();
    } catch (err) {
      handleError(err);
    } finally {
      setBusy(false);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <section className="cart-page">
        <h1 className="cart-title">Fresh Dairy Cart</h1>
        <p style={{ textAlign: "center" }}>Loading your cart...</p>
      </section>
    );
  }

  return (
    <section className="cart-page">

      <h1 className="cart-title">Fresh Dairy Cart</h1>

      {error && (
        <p style={{ textAlign: "center", color: "#c0392b" }}>{error}</p>
      )}

      {cartItems.length === 0 ? (

        <div className="empty-cart">
          <h2>Your cart is empty</h2>
          <p>Add some fresh dairy products</p>
        </div>

      ) : (

        <>
          <div className="cart-list">

            {cartItems.map((item) => (

              <div className="cart-card" key={item.id}>

                <div className="cart-image">
                  <img
                    src={item.image || "/milk.png"}
                    alt={item.productName}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/milk.png";
                    }}
                  />
                </div>

                <div className="cart-info">
                  <h3>{item.productName}</h3>
                  <p className="price">Rs {item.price}</p>

                  <div className="qty-control">
                    <button
                      disabled={busy || item.quantity <= 1}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      disabled={busy || item.quantity >= 99}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-actions">
                  <h2>Rs {item.price * item.quantity}</h2>

                  <button
                    className="remove-btn"
                    disabled={busy}
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>

              </div>

            ))}

          </div>

          <div className="cart-total">

            <div className="total-left">
              <h2>Total Amount</h2>
              <h1>Rs {total}</h1>
            </div>

            <button
              className="checkout-btn"
              disabled={busy}
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>

          </div>
        </>

      )}

    </section>
  );
}

export default Cart;
