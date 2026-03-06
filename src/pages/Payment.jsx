import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Payment.css";

function Payment() {

  const navigate = useNavigate();

  const [method, setMethod] = useState("");

  const handlePayment = () => {

    if (!method) {

      alert("Please select a payment method");
      return;

    }

    alert("Payment Successful 🎉");

    navigate("/success");

  };

  return (

    <section className="payment-page">

      <h1>Choose Payment Method</h1>

      <div className="payment-box">

        <label>

          <input
            type="radio"
            name="payment"
            value="upi"
            onChange={(e) => setMethod(e.target.value)}
          />

          UPI Payment

        </label>

        <label>

          <input
            type="radio"
            name="payment"
            value="card"
            onChange={(e) => setMethod(e.target.value)}
          />

          Credit / Debit Card

        </label>

        <label>

          <input
            type="radio"
            name="payment"
            value="cod"
            onChange={(e) => setMethod(e.target.value)}
          />

          Cash on Delivery

        </label>

        <button onClick={handlePayment}>
          Pay Now
        </button>

      </div>

    </section>

  );

}

export default Payment;