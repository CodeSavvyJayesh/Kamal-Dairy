import { Link } from "react-router-dom";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiPhone,
  FiMail,
  FiClock,
} from "react-icons/fi";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner kd-container">
        <div className="footer__brand">
          <span className="footer__wordmark">
            Kamal <em>Dairy</em>
          </span>

          <p>
            Fresh dairy essentials from trusted brands, delivered across Mumbai —
            pure, hygienic and always on time. Serving the city since 1980.
          </p>

          <div className="footer__social">
            <a href="#" aria-label="Facebook"><FiFacebook /></a>
            <a href="#" aria-label="Instagram"><FiInstagram /></a>
            <a href="#" aria-label="Twitter"><FiTwitter /></a>
            <a href="#" aria-label="YouTube"><FiYoutube /></a>
          </div>
        </div>

        <nav className="footer__col" aria-label="Footer">
          <h3>Explore</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/subscription">Subscription</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>

        <div className="footer__col">
          <h3>Popular</h3>
          <ul>
            <li><Link to="/products/milk">Milk</Link></li>
            <li><Link to="/products/paneer">Paneer</Link></li>
            <li><Link to="/products/ghee">Ghee</Link></li>
            <li><Link to="/products/yoghurt">Yoghurt</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h3>Support</h3>
          <ul className="footer__contact">
            <li>
              <FiPhone aria-hidden="true" />
              <a href="tel:+919970469894">+91 99704 69894</a>
            </li>
            <li>
              <FiMail aria-hidden="true" />
              <a href="mailto:kamaldairy@gmail.com">kamaldairy@gmail.com</a>
            </li>
            <li>
              <FiClock aria-hidden="true" />
              <span>6 AM – 10 PM, all week</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="kd-container footer__bottom-inner">
          <span>© {new Date().getFullYear()} Kamal Dairy. All rights reserved.</span>
          <span className="footer__made">Made with 🥛 in Mumbai</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
