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
        /* FOOTER BASE */
        .footer {
          background: linear-gradient(135deg, #fff7e6, #ffefd0);
          padding: 70px 20px 30px;
          border-top: 4px solid #f3d195;
          color: #333;
        }

        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 45px;
        }

        /* BRAND */
        .brand {
          font-size: 28px;
          font-weight: 800;
          color: #1d3557;
          margin-bottom: 12px;
        }

        .brand-desc {
          line-height: 1.7;
          color: #444;
          font-size: 15px;
        }

        /* COLUMNS */
        .footer-col h3 {
          font-size: 18px;
          margin-bottom: 15px;
          color: #1d3557;
        }

        .footer-col ul {
          list-style: none;
          padding: 0;
          margin: 0;
          line-height: 2.2;
        }

        .footer-col ul li {
          font-size: 15px;
          color: #444;
        }

        /* LINKS */
        .footer-col ul li a {
          text-decoration: none;
          color: #444;
          transition: color 0.3s ease;
        }

        .footer-col ul li a:hover {
          color: #3394c8;
        }

        /* SUPPORT */
        .support-list li {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* SOCIAL */
        .social-icons {
          display: flex;
          gap: 15px;
        }

        .social-icons span {
          width: 42px;
          height: 42px;
          background: rgba(255,255,255,0.7);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 15px rgba(0,0,0,0.15);
        }

        .social-icons span:hover {
          transform: translateY(-6px) scale(1.1);
          background: #3394c8;
          color: white;
        }

        /* COPYRIGHT */
        .footer-bottom {
          text-align: center;
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #e3caa5;
          font-size: 14px;
          color: #555;
        }
        `}
      </style>
    </footer>
  );
}

export default Footer;
