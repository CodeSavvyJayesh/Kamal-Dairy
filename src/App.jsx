import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import CategoryProducts from "./pages/CategoryProducts";
import Contact from "./pages/Contact"; 
import Footer from "./components/Footer";
import Auth from "./pages/Auth";
import Subscription from "./pages/Subscription";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Orders from "./pages/Orders";
import AdminDashboard from "./pages/AdminDashboard";
import VerifyOtp from "./pages/VerifyOtp";


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div style={{ marginTop: "80px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />

          <Route path="/products/:category" element={<CategoryProducts />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/subscription" element={<Subscription />} />
    
          <Route path="/cart" element={<Cart />}  />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          
          <Route path="/admin" element={<AdminDashboard />} />

         
        </Routes>
      </div>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
