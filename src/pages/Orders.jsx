import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import "./Orders.css";

function Orders() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await api("/api/orders/my-orders", { auth: true });
        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.status === 401) {
          navigate("/login");
          return;
        }
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const formatDate = (value) => {
    if (!value) return null;
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d.toLocaleString("en-IN");
  };

  if (loading) {
    return (
      <section className="orders-page">
        <h1 className="orders-title">My Orders</h1>
        <p style={{ textAlign: "center" }}>Loading your orders...</p>
      </section>
    );
  }

  return (
    <section className="orders-page">

      <h1 className="orders-title">My Orders</h1>

      {error && (
        <p style={{ textAlign: "center", color: "#c0392b" }}>{error}</p>
      )}

      {orders.length === 0 ? (

        <div className="no-orders">
          <h2>No Orders Yet</h2>
          <p>Start shopping fresh dairy products</p>
        </div>

      ) : (

        <div className="orders-container">

          {orders.map((order) => (

            <div className="order-card" key={order.id}>

              <div className="order-header">
                <h3>Order #{order.id}</h3>
                <span className="order-status">Paid</span>
              </div>

              {formatDate(order.createdAt) && (
                <p style={{ fontSize: "0.85rem", opacity: 0.7, margin: "4px 0" }}>
                  {formatDate(order.createdAt)}
                </p>
              )}

              <div className="order-items">
                {order.items && order.items.map((item) => (
                  <div className="order-item" key={item.id}>
                    <span>{item.productName}</span>
                    <span>{item.quantity} x Rs {item.price}</span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <h2>Total: Rs {order.totalAmount}</h2>
              </div>

            </div>

          ))}

        </div>

      )}

    </section>
  );
}

export default Orders;
