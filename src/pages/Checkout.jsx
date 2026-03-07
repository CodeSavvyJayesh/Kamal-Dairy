import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Checkout.css";

function Checkout(){

const navigate = useNavigate();
const location = useLocation();

const cartItems = location.state?.cartItems || [];
const total = location.state?.total || 0;

const [form,setForm]=useState({
name:"",
phone:"",
address:"",
city:"",
pincode:""
});

const handleChange=(e)=>{

setForm({
...form,
[e.target.name]:e.target.value
});

};

const handleSubmit=(e)=>{

e.preventDefault();

navigate("/payment",{
state:{
cartItems,
total,
shipping:form
}
});

};

return(

<section className="checkout-page">

<h1 className="checkout-title">
Shipping Details
</h1>

<div className="checkout-container">

<form
className="checkout-form"
onSubmit={handleSubmit}
>

<input
name="name"
placeholder="Full Name"
onChange={handleChange}
required
/>

<input
name="phone"
placeholder="Phone Number"
onChange={handleChange}
required
/>

<input
name="address"
placeholder="Address"
onChange={handleChange}
required
/>

<input
name="city"
placeholder="City"
onChange={handleChange}
required
/>

<input
name="pincode"
placeholder="Pincode"
onChange={handleChange}
required
/>

<button className="checkout-btn">
Continue to Payment →
</button>

</form>

<div className="order-summary">

<h2>Order Summary</h2>

{cartItems.map(item=>(

<div
key={item.id}
className="summary-item"
>

<span>
{item.productName} × {item.quantity}
</span>

<span>
₹{item.price*item.quantity}
</span>

</div>

))}

<hr/>

<div className="summary-total">

<span>Total</span>
<span>₹{total}</span>

</div>

</div>

</div>

</section>

);

}

export default Checkout;