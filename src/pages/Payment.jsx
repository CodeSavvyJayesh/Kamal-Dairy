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

      const res = await fetch(
        "http://localhost:8080/api/orders/place",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("HTTP STATUS:", res.status);

      if (res.status === 200) {

        // sometimes backend returns empty body → avoid crash
        let data = null;

        try {
          data = await res.json();
        } catch {
          console.log("No JSON returned");
        }

        console.log("Order response:", data);

        alert("Payment Successful 🎉");

        navigate("/success");

      } else {

        const text = await res.text();
        console.error("Backend error:", text);

        alert("Failed to place order");

      }

    } catch (err) {

      console.error("Fetch error:", err);
      alert("Failed to place order");

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