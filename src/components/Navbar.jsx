import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

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
        ☰
      </div>

      <div className={`nav-links ${open ? "open" : ""}`}>
        <NavItem to="/" label="Home" location={location} onClick={() => setOpen(false)} />
        <NavItem to="/products" label="Products" location={location} onClick={() => setOpen(false)} />
        <NavItem to="/subscription" label="Subscription" location={location} onClick={() => setOpen(false)} />
        <NavItem to="/contact" label="Contact" location={location} onClick={() => setOpen(false)} />
        <NavItem to="/cart" label="Cart" location={location} onClick={() => setOpen(false)} />
        <NavItem to="/login" label="Login" location={location} onClick={() => setOpen(false)} />
      </div>
    </nav>
  );
}

function NavItem({ to, label, location, onClick }) {
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      className={`nav-link ${active ? "active" : ""}`}
      onClick={onClick}
    >
      {label}
    </Link>
  );
}

export default Navbar;