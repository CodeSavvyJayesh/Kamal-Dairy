import { Link } from "react-router-dom";

function Navbar() {
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

      {/* NAV LINKS */}
      <div className="nav-links">
        <NavItem to="/" label="Home" />
        <NavItem to="/products" label="Products" />
        <NavItem to="/subscription" label="Subscription" />
        <NavItem to="/contact" label="Contact" />
        <NavItem to="/cart" label="Cart" />
        <NavItem to="/login" label="Login" />
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
          padding: 0px 10px;
          background: rgba(255, 250, 240, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0,0,0,0.08);
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          z-index: 1000;
        }

        /* LOGO */
        .logo {
          width: 110px;
          height: 70px;
          border-radius: 30px;
          transition: transform 0.3s ease;
          
        }

        .logo:hover {
          transform: scale(1.10);
        }

        /* LINKS CONTAINER */
        .nav-links {
          display: flex;
          gap: 20px;
          
        }

        /* SINGLE LINK */
        .nav-link {
          position: relative;
          font-size: 18px;
          font-weight: 600;
          color: #0a2540;
          text-decoration: none;
          padding: 0px 25px;
          transition: color 0.3s ease;
          white-space: nowrap;
         
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
          transition: width 0.2s ease;
        }

        .nav-link:hover {
          color: #3394c8;
        }

        .nav-link:hover::after {
          width: 100%;
        }

        /* RESPONSIVE (OPTIONAL) */
        @media (max-width: 900px) {
          .nav-links {
            gap: 25px;
          }

          .nav-link {
            font-size: 16px;
          }
        }
        `}
      </style>
    </nav>
  );
}

/* REUSABLE NAV ITEM COMPONENT */
function NavItem({ to, label }) {
  return (
    <Link to={to} className="nav-link">
      {label}
    </Link>
  );
}

export default Navbar;
