import { useEffect, useState } from "react";
import "./Orders.css";

function Orders() {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {

    const token = localStorage.getItem("token");

    try {

      const res = await fetch(
        "http://localhost:8080/api/orders/my-orders",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      setOrders(data);

    } catch (err) {
      console.error(err);
    }
  };

  return (

    <section className="orders-page">

      <h1 className="orders-title">🧾 My Orders</h1>

      {orders.length === 0 ? (

        <div className="no-orders">
          <h2>No Orders Yet</h2>
          <p>Start shopping fresh dairy products 🥛</p>
        </div>

      ) : (

        <div className="orders-container">

          {orders.map(order => (

            <div className="order-card" key={order.id}>

              <div className="order-header">

                <h3>Order #{order.id}</h3>
                <span className="order-status">✔ Placed</span>

              </div>

              <div className="order-items">

                {order.items.map(item => (

                  <div className="order-item" key={item.id}>

                    <span>{item.productName}</span>

                    <span>
                      {item.quantity} × ₹{item.price}
                    </span>

                  </div>

                ))}

              </div>

              <div className="order-footer">

                <h2>Total: ₹{order.totalAmount}</h2>

              </div>

            </div>

          ))}

        </div>

      )}

    </section>

  );

}

export default Orders;