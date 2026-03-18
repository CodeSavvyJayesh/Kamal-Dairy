import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Payment.css";

function Payment() {

  const navigate = useNavigate();
  const location = useLocation();

  const total = location.state?.total || 0;

  const [method, setMethod] = useState("");

  const handlePayment = async () => {

    if (!method) {
      alert("Please select payment method");
      return;
    }

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        alert("User not logged in");
        return;
      }

      // ✅ 1. Create Razorpay order
      const res = await fetch(
        `http://localhost:8080/api/payment/create-order?amount=${total}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const order = await res.json();

      // ✅ 2. Open Razorpay popup
      const options = {
        key: "rzp_test_SSiGpE2ckiAYod",
        amount: order.amount,
        currency: "INR",
        name: "Kamal Dairy",
        description: "Dairy Payment",
        order_id: order.id,

        handler: async function (response) {

          // ✅ 3. After successful payment → place order
          await fetch(
            "http://localhost:8080/api/orders/place",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          alert("Payment Successful 🎉");
          navigate("/Orders");
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }

  };

  return (

    <section className="payment-page">

      <h1>Payment</h1>

      <h2 className="pay-total">
        Total: ₹{total}
      </h2>

      <div className="payment-box">

        <label>
          <input
            type="radio"
            value="upi"
            onChange={(e) => setMethod(e.target.value)}
          />
          UPI Payment
        </label>

        <label>
          <input
            type="radio"
            value="card"
            onChange={(e) => setMethod(e.target.value)}
          />
          Credit / Debit Card
        </label>

        <label>
          <input
            type="radio"
            value="cod"
            onChange={(e) => setMethod(e.target.value)}
          />
          Cash on Delivery
        </label>

        <button onClick={handlePayment}>
          Pay ₹{total}
        </button>

      </div>

    </section>

  );

}

export default Payment;