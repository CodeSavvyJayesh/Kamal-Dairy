import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import CategoryProducts from "./pages/CategoryProducts";
import Contact from "./pages/Contact"; 
import Footer from "./components/Footer";
import Auth from "./pages/Auth";


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <div style={{ marginTop: "100px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />

          {/* 👇 THIS WAS MISSING */}
          <Route path="/products/:category" element={<CategoryProducts />} />
          <Route path="/contact" element={<Contact />} />
      
          <Route path="/Login" element={<Auth />} />
        </Routes>
      </div>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
