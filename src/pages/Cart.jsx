import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { PRODUCT_FALLBACK } from "../utils/images";
import { stockState } from "../utils/orders";
import "./Cart.css";

const DELIVERY_FEE = 0;

function Cart() {
  const navigate = useNavigate();
  const toast = useToast();

  const { items, total, loading, error, updateQuantity, removeItem } = useCart();
  const [busyId, setBusyId] = useState(null);

  // Rows asking for more than is on the shelf. Checkout waits until they are fixed.
  const stockIssues = items.filter((i) => {
    const s = stockState(i.stock);
    return s.tracked && i.quantity > s.left;
  });

  const handleError = (err) => {
    if (err.status === 401) {
      navigate("/login");
      return;
    }
    toast.error(err.message);
  };

  const changeQty = async (item, next) => {
    if (next < 1 || next > 99) return;

    setBusyId(item.id);
    try {
      await updateQuantity(item.id, next);
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (item) => {
    setBusyId(item.id);
    try {
      await removeItem(item.id);
      toast.info(`${item.productName} removed`);
    } catch (err) {
      handleError(err);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <>
      <header className="page-head">
        <div className="kd-container">
          <span className="kd-eyebrow">Your basket</span>
          <h1>Fresh dairy cart</h1>
          <p>Prices are confirmed by the server at checkout, so what you see is what you pay.</p>
        </div>
      </header>

      <div className="kd-container page-body">
        {error && <p className="kd-alert">{error}</p>}

        {loading ? (
          <div className="cart__skeletons">
            {Array.from({ length: 3 }).map((_, i) => (
              <div className="cart__row kd-card" key={i}>
                <div className="kd-skel cart__skel-img" />
                <div className="cart__skel-text">
                  <div className="kd-skel cart__skel-line" />
                  <div className="kd-skel cart__skel-line cart__skel-line--sm" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="kd-empty">
            <div className="kd-empty__icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add a few fresh things and they will show up here.</p>
            <Link to="/products" className="kd-btn kd-btn--primary kd-btn--lg">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="cart">
            <div className="cart__list">
              {items.map((item) => {
                const busy = busyId === item.id;
                const stock = stockState(item.stock);
                const tooMany = stock.tracked && item.quantity > stock.left;
                const atMax = stock.tracked && item.quantity >= stock.left;

                return (
                  <article
                    className={`cart__row kd-card ${busy ? "is-busy" : ""} ${tooMany ? "has-issue" : ""}`}
                    key={item.id}
                  >
                    <div className="cart__thumb">
                      <img
                        src={item.imageUrl || PRODUCT_FALLBACK}
                        alt=""
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = PRODUCT_FALLBACK;
                        }}
                      />
                    </div>

                    <div className="cart__info">
                      <h3>{item.productName}</h3>
                      <p className="cart__unit">₹{item.price} each</p>
                      {tooMany ? (
                        <p className="cart__stock is-bad" role="alert">
                          {stock.out
                            ? "Sold out – remove it to check out"
                            : `Only ${stock.left} left – lower the quantity to check out`}
                        </p>
                      ) : (
                        stock.low && <p className="cart__stock">Only {stock.left} left</p>
                      )}
                    </div>

                    <div className="cart__qty">
                      <button
                        onClick={() => changeQty(item, item.quantity - 1)}
                        disabled={busy || item.quantity <= 1}
                        aria-label={`Decrease quantity of ${item.productName}`}
                      >
                        <FiMinus />
                      </button>

                      <span aria-live="polite">{item.quantity}</span>

                      <button
                        onClick={() => changeQty(item, item.quantity + 1)}
                        disabled={busy || item.quantity >= 99 || atMax}
                        title={atMax ? "That is all we have right now" : undefined}
                        aria-label={`Increase quantity of ${item.productName}`}
                      >
                        <FiPlus />
                      </button>
                    </div>

                    <div className="cart__line">
                      <strong>₹{(item.price * item.quantity).toFixed(2)}</strong>

                      <button
                        className="cart__remove"
                        onClick={() => remove(item)}
                        disabled={busy}
                        aria-label={`Remove ${item.productName} from cart`}
                      >
                        <FiTrash2 />
                        Remove
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="cart__summary kd-panel">
              <h2>Order summary</h2>

              <dl className="cart__totals">
                <div>
                  <dt>Subtotal</dt>
                  <dd>₹{total.toFixed(2)}</dd>
                </div>
                <div>
                  <dt>Delivery</dt>
                  <dd className="cart__free">
                    {DELIVERY_FEE === 0 ? "Free" : `₹${DELIVERY_FEE}`}
                  </dd>
                </div>
              </dl>

              <div className="cart__grand">
                <span>Total</span>
                <strong>₹{(total + DELIVERY_FEE).toFixed(2)}</strong>
              </div>

              {stockIssues.length > 0 && (
                <p className="cart__blocked" role="status">
                  {stockIssues.length === 1
                    ? `${stockIssues[0].productName} does not have enough stock.`
                    : `${stockIssues.length} items do not have enough stock.`}{" "}
                  Update your cart to continue.
                </p>
              )}

              <button
                className="kd-btn kd-btn--primary kd-btn--lg kd-btn--block"
                onClick={() => navigate("/checkout")}
                disabled={busyId !== null || stockIssues.length > 0}
              >
                Proceed to checkout
              </button>

              <Link to="/products" className="cart__continue">
                or keep shopping
              </Link>

              <p className="cart__note">
                🔒 Payments are handled by Razorpay. We never see your card details.
              </p>
            </aside>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
