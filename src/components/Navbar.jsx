import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { clearSession, isAdmin, isLoggedIn } from "../api/client";
import "./Navbar.css";

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Re-evaluated on every render, and every route change re-renders this
  // component, so an expired token stops showing logged-in UI without the
  // full-page reload the old version needed.
  const loggedIn = isLoggedIn();
  const admin = isAdmin();

  const handleLogout = () => {
    clearSession();
    setOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo-wrapper">
        <img
          src="images/logo/Kamal Dairy Logo.png"
          alt="Kamal Dairy Logo"
          className="logo"
        />
      </Link>

      <div className="menu-icon" onClick={() => setOpen(!open)}>
        &#9776;
      </div>

      <div className={`nav-links ${open ? "open" : ""}`}>
        <NavItem to="/" label="Home" location={location} onClick={() => setOpen(false)} />
        <NavItem to="/products" label="Products" location={location} onClick={() => setOpen(false)} />
        <NavItem to="/subscription" label="Subscription" location={location} onClick={() => setOpen(false)} />
        <NavItem to="/contact" label="Contact" location={location} onClick={() => setOpen(false)} />
        <NavItem to="/cart" label="Cart" location={location} onClick={() => setOpen(false)} />

        {loggedIn && (
          <NavItem to="/orders" label="My Orders" location={location} onClick={() => setOpen(false)} />
        )}

        {admin && (
          <NavItem to="/admin" label="Admin Dashboard" location={location} onClick={() => setOpen(false)} />
        )}

        {!loggedIn ? (
          <NavItem to="/login" label="Login" location={location} onClick={() => setOpen(false)} />
        ) : (
          <span className="nav-link logout-btn" onClick={handleLogout}>
            Logout
          </span>
        )}
      </div>
    </nav>
  );
}

function NavItem({ to, label, location, onClick }) {
  const active = location.pathname === to;

  return (
    <Link to={to} className={`nav-link ${active ? "active" : ""}`} onClick={onClick}>
      {label}
    </Link>
  );
}

export default Navbar;
