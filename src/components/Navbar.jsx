import { Link } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* LOGO */}
      <Link to="/" className="logo-link">
        <img
          src="images/logo/logo.jpg"
          alt="Kamal Dairy Logo"
          className="logo"
        />
      </Link>

      {/* HAMBURGER ICON (MOBILE) */}
      <div className="menu-icon" onClick={() => setOpen(!open)}>
        ☰
      </div>

      {/* NAV LINKS */}
      <div className={`nav-links ${open ? "open" : ""}`}>
        <NavItem to="/" label="Home" onClick={() => setOpen(false)} />
        <NavItem to="/products" label="Products" onClick={() => setOpen(false)} />
        <NavItem to="/subscription" label="Subscription" onClick={() => setOpen(false)} />
        <NavItem to="/contact" label="Contact" onClick={() => setOpen(false)} />
        <NavItem to="/cart" label="Cart" onClick={() => setOpen(false)} />
        <NavItem to="/login" label="Login" onClick={() => setOpen(false)} />
      </div>

      {/* CSS */}
      <style>
        {`
        /* NAVBAR CONTAINER */
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 80px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding right: 56px;
          padding: 0 10px;
          background: rgba(255, 250, 240, 0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          z-index: 9999;
        }

        /* LOGO */
        .logo {
          width: 100px;
          height: 60px;
          border-radius: 20px;
          transition: transform 0.3s ease;
        }

        .logo:hover {
          transform: scale(1.05);
        }

        /* MENU ICON */
        .menu-icon {
          display: none;
          z-index : 10000;
          position : relative;
          right : 16px;
         font-size: 30px;
          cursor: pointer;
          user-select: none;
        }

        /* NAV LINKS (DESKTOP) */
        .nav-links {
          display: flex;
          gap: 22px;
        }

        .nav-link {
          position: relative;
          font-size: 17px;
          font-weight: 600;
          color: #0a2540;
          text-decoration: none;
          padding: 6px 12px;
          white-space: nowrap;
          transition: color 0.25s ease;
        }

        /* UNDERLINE ANIMATION */
        .nav-link::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 0%;
          height: 2px;
          background: linear-gradient(90deg, #4eb3e6, #3394c8);
          transition: width 0.25s ease;
        }

        .nav-link:hover {
          color: #3394c8;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        /* TABLET */
 

        /* MOBILE */
        @media (max-width: 900px) {
          .menu-icon {
            display: block;
            font-size : 40px;
            color: #0a2540;
            z-index : 1100;
          }
        
       

           .nav-links {
    position: absolute;
    top: 80px;
    left: 0;
    width: 100%;
    background: #fffaf0;
    flex-direction: column;
    align-items: center;
    gap: 18px;
    padding: 20px 0;
    display: none;
  }

          .nav-links.open {
            display: flex;
          }
        }
        `}
      </style>
    </nav>
  );
}

/* REUSABLE NAV ITEM */
function NavItem({ to, label, onClick }) {
  return (
    <Link to={to} className="nav-link" onClick={onClick}>
      {label}
    </Link>
  );
}

export default Navbar;
