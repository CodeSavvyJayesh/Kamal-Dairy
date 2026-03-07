import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Payment.css";

function Payment(){

const navigate = useNavigate();
const location = useLocation();

const total = location.state?.total || 0;

const [method,setMethod]=useState("");

const handlePayment=()=>{

if(!method){
alert("Please select payment method");
return;
}

alert("Payment Successful 🎉");

navigate("/success");

};

return(

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
onChange={(e)=>setMethod(e.target.value)}
/>

UPI Payment

</label>

<label>

<input
type="radio"
value="card"
onChange={(e)=>setMethod(e.target.value)}
/>

Credit / Debit Card

</label>

<label>

<input
type="radio"
value="cod"
onChange={(e)=>setMethod(e.target.value)}
/>

Cash on Delivery

</label>

<button
onClick={handlePayment}
>

Pay ₹{total}

</button>

</div>

</section>

);

}

export default Payment;