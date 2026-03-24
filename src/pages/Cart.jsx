import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart() {

  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const loadCart = async () => {

    try {

      const res = await fetch(
        "http://15.207.98.62:8080/api/cart",
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      setCartItems(data);

    } catch(err){
      console.error(err);
    }

  };

  useEffect(()=>{
    loadCart();
  },[]);

  const removeItem = async(id)=>{

    await fetch(
      `http://15.207.98.62:8080/api/cart/remove/${id}`,
      {
        method:"DELETE",
        headers:{Authorization:`Bearer ${token}`}
      }
    );

    loadCart();

  };

  const updateQuantity = async(id,qty)=>{

    if(qty < 1) return;

    await fetch(
      `http://15.207.98.62:8080/api/cart/update?cartItemId=${id}&quantity=${qty}`,
      {
        method:"PUT",
        headers:{Authorization:`Bearer ${token}`}
      }
    );

    loadCart();

  };

  const total = cartItems.reduce(
    (sum,item)=>sum + item.price * item.quantity,0
  );

  return(

    <section className="cart-page">

      <h1 className="cart-title">Fresh Dairy Cart 🥛</h1>

      {cartItems.length === 0 ?(

        <div className="empty-cart">

          <h2>Your cart is empty</h2>
          <p>Add some fresh dairy products</p>

        </div>

      ):(

        <>
          <div className="cart-list">

            {cartItems.map(item=>(

              <div className="cart-card" key={item.id}>

                <div className="cart-image">

                  <img
                    src={item.image || "/milk.png"}
                    alt={item.productName}
                  />

                </div>

                <div className="cart-info">

                  <h3>{item.productName}</h3>
                  <p className="price">₹{item.price}</p>

                  <div className="qty-control">

                    <button
                      onClick={() =>
                        updateQuantity(item.id,item.quantity-1)
                      }
                    >
                      −
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(item.id,item.quantity+1)
                      }
                    >
                      +
                    </button>

                  </div>

                </div>

                <div className="cart-actions">

                  <h2>₹{item.price * item.quantity}</h2>

                  <button
                    className="remove-btn"
                    onClick={()=>removeItem(item.id)}
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
              <h1>₹{total}</h1>

            </div>

            <button
              className="checkout-btn"
              onClick={()=>navigate(
                "/checkout",
                {state:{cartItems,total}}
              )}
            >
              Proceed to Checkout →
            </button>

          </div>

        </>

      )}

    </section>

  );

}

export default Cart;