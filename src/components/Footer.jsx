function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* BRAND */}
        <div className="footer-col">
          <h2 className="brand">Kamal Dairy</h2>
          <p className="brand-desc">
            Delivering fresh dairy essentials from trusted brands to your
            doorstep — pure, hygienic, and always on time.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="footer-col">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/subscription">Subscription</a></li>
            <li><a href="/contact">Contact Us</a></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div className="footer-col">
          <h3>Customer Support</h3>
          <ul className="support-list">
            <li>📞 +91 9970469894</li>
            <li>📧 kamaldairy@gmail.com</li>
            <li>🕒 6 AM – 10 PM</li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div className="footer-col">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <span>📘</span>
            <span>📸</span>
            <span>🐦</span>
            <span>▶</span>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} Kamal Dairy — All Rights Reserved
      </div>

      {/* CSS */}
      <style>
        {`
        /* ================================
           FOOTER BASE
        ================================= */
        .footer {
          background: #0b2e16; /* Darker brand green */
          padding: 80px 20px 30px;
          color: #ffffff;
          border-top: 4px solid #0F3D1E;
        }

        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 50px;
        }

        /* BRAND */
        .brand {
          font-size: 28px;
          font-weight: 800;
          margin-bottom: 15px;
          color: #ffffff;
        }

        .brand-desc {
          line-height: 1.7;
          color: #cccccc;
          font-size: 15px;
        }

        /* COLUMN TITLES */
        .footer-col h3 {
          font-size: 18px;
          margin-bottom: 18px;
          color: #ffffff;
          position: relative;
        }

        .footer-col h3::after {
          content: "";
          width: 35px;
          height: 2px;
          background: #D9181F;
          display: block;
          margin-top: 6px;
        }

        /* LISTS */
        .footer-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
          line-height: 2.2;
        }

        .footer-col ul li {
          font-size: 15px;
          color: #cccccc;
        }

        /* LINKS */
        .footer-col ul li a {
          text-decoration: none;
          color: #cccccc;
          transition: all 0.3s ease;
        }

        .footer-col ul li a:hover {
          color: #D9181F;
          padding-left: 6px;
        }

        /* SUPPORT */
        .support-list li {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* SOCIAL ICONS */
        .social-icons {
          display: flex;
          gap: 15px;
        }

        .social-icons span {
          width: 42px;
          height: 42px;
          background: #0F3D1E;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .social-icons span:hover {
          background: #D9181F;
          transform: translateY(-5px);
        }

        /* COPYRIGHT */
        .footer-bottom {
          text-align: center;
          margin-top: 60px;
          padding-top: 25px;
          border-top: 1px solid #222;
          font-size: 14px;
          color: #999999;
        }

        /* MOBILE */
        @media (max-width: 768px) {
          .footer {
            padding: 60px 20px 25px;
          }

          .footer-inner {
            gap: 40px;
          }

          .footer-bottom {
            margin-top: 40px;
          }
        }
        `}
      </style>
    </footer>
  );
}

export default Footer;