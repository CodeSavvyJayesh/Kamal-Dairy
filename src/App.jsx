import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";
import PageLoader from "./components/PageLoader";

import { ToastProvider } from "./context/ToastContext";
import { CartProvider } from "./context/CartContext";

import Home from "./pages/Home";

// Everything past the landing page is code-split, so the first paint only
// downloads what the homepage actually needs.
const Products = lazy(() => import("./pages/Products"));
const CategoryProducts = lazy(() => import("./pages/CategoryProducts"));
const Contact = lazy(() => import("./pages/Contact"));
const Auth = lazy(() => import("./pages/Auth"));
const VerifyOtp = lazy(() => import("./pages/VerifyOtp"));
const Subscription = lazy(() => import("./pages/Subscription"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const Payment = lazy(() => import("./pages/Payment"));
const Orders = lazy(() => import("./pages/Orders"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <ScrollToTop />
          <Navbar />

          <main className="app-main" id="main-content">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:category" element={<CategoryProducts />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/verify-otp" element={<VerifyOtp />} />

                {/* Signed in */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/payment"
                  element={
                    <ProtectedRoute>
                      <Payment />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />

                {/* Admin only */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requireAdmin>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Anything else */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>

          <Footer />
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
