import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

function Checkout() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = (e) => {

    e.preventDefault();

    console.log("Shipping details:", form);

    navigate("/payment");

  };

  return (

    <section className="checkout-page">

      <h1>Shipping Details</h1>

      <form
        className="checkout-form"
        onSubmit={handleSubmit}
      >

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="address"
          placeholder="Address"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="pincode"
          placeholder="Pincode"
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="checkout-btn"
        >
          Continue to Payment →
        </button>

      </form>

    </section>

  );

}

export default Checkout;