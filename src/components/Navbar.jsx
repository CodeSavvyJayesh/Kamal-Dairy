import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiShoppingBag, FiX } from "react-icons/fi";
import { clearSession, isAdmin, isLoggedIn } from "../api/client";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import "./Navbar.css";

const LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/products", label: "Products" },
  { to: "/subscription", label: "Subscription" },
  { to: "/contact", label: "Contact" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const { count, clearLocal } = useCart();
  const toast = useToast();

  // Re-evaluated on every render, and every route change re-renders this
  // component, so an expired token stops showing logged-in UI without a reload.
  const loggedIn = isLoggedIn();
  const admin = isAdmin();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock the page behind the mobile drawer
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const close = () => setOpen(false);

  const handleLogout = () => {
    clearSession();
    clearLocal();
    close();
    toast.info("Signed out. See you soon!");
    navigate("/", { replace: true });
  };

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <div className="navbar__inner kd-container">
          <Link to="/" className="navbar__brand" onClick={close}>
            <img
              src="/images/logo/Kamal Dairy Logo.png"
              alt=""
              className="navbar__logo"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
            <span className="navbar__wordmark">
              Kamal <em>Dairy</em>
            </span>
          </Link>

          <nav className={`navbar__nav ${open ? "is-open" : ""}`} aria-label="Main">
            <ul className="navbar__links">
              {LINKS.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    end={link.end}
                    className={({ isActive }) =>
                      `navbar__link ${isActive ? "is-active" : ""}`
                    }
                    onClick={close}
                  >
                    {link.label}
                  </NavLink>
                </li>
              ))}

              {loggedIn && (
                <li>
                  <NavLink
                    to="/orders"
                    className={({ isActive }) =>
                      `navbar__link ${isActive ? "is-active" : ""}`
                    }
                    onClick={close}
                  >
                    My Orders
                  </NavLink>
                </li>
              )}

              {admin && (
                <li>
                  <NavLink
                    to="/admin"
                    className={({ isActive }) =>
                      `navbar__link navbar__link--admin ${isActive ? "is-active" : ""}`
                    }
                    onClick={close}
                  >
                    Admin
                  </NavLink>
                </li>
              )}
            </ul>

            <div className="navbar__actions">
              <Link to="/cart" className="navbar__cart" onClick={close}>
                <FiShoppingBag aria-hidden="true" />
                <span className="kd-sr-only">
                  Cart, {count} {count === 1 ? "item" : "items"}
                </span>
                {count > 0 && (
                  <span className="navbar__cart-badge" aria-hidden="true">
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </Link>

              {loggedIn ? (
                <button className="kd-btn kd-btn--ghost kd-btn--sm" onClick={handleLogout}>
                  Log out
                </button>
              ) : (
                <Link
                  to="/login"
                  className="kd-btn kd-btn--primary kd-btn--sm"
                  onClick={close}
                >
                  Sign in
                </Link>
              )}
            </div>
          </nav>

          <button
            className="navbar__toggle"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="main-navigation"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </header>

      {open && <div className="navbar__scrim" onClick={close} aria-hidden="true" />}
    </>
  );
}

export default Navbar;
