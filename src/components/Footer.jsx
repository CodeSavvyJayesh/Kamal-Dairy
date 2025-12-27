function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(135deg, #FFF7E6, #FFEFD0)",
        padding: "60px 30px",
        marginTop: "0px",
        color: "#333",
        borderTop: "4px solid #f3d195",
      }}
    >
      {/* MAIN FOOTER GRID */}
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "40px",
        }}
      >
        {/* 1. BRAND INFO */}
        <div>
          <h2
            style={{
              fontSize: "26px",
              color: "#1d3557",
              marginBottom: "15px",
              fontWeight: 700,
            }}
          >
            Kamal Dairy
          </h2>
          <p style={{ lineHeight: "1.6", color: "#444" }}>
            Delivering fresh dairy essentials from trusted brands to your
            doorstep — pure, hygienic, and always on time.
          </p>
        </div>

        {/* 2. QUICK LINKS */}
        <div>
          <h3 style={{ marginBottom: "15px", color: "#1d3557" }}>
            Quick Links
          </h3>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "2" }}>
            <li><a href="/" style={linkStyle}>Home</a></li>
            <li><a href="/products" style={linkStyle}>Products</a></li>
            <li><a href="/subscription" style={linkStyle}>Subscription</a></li>
            <li><a href="/contact" style={linkStyle}>Contact Us</a></li>
          </ul>
        </div>

        {/* 3. CUSTOMER SUPPORT */}
        <div>
          <h3 style={{ marginBottom: "20px", color: "#1d3557" }}>
            Customer Support
          </h3>
          <ul style={{ listStyle: "none", padding:0, lineHeight: "2" }}>
            <li>📞 ‪+91 9970469894‬</li>
            <li>📧 kamaldairy@gmail.com</li>
            <li>🕒 Open:6 AM–10 PM</li>
          </ul>
        </div>

        {/* 4. SOCIAL MEDIA */}
        <div>
          <h3 style={{ marginBottom: "15px", color: "#1d3557" }}>
            Follow Us
          </h3>
          <div style={{ display: "flex", gap: "15px" }}>
            <div style={iconBox}>📘</div>
            <div style={iconBox}>📸</div>
            <div style={iconBox}>🐦</div>
            <div style={iconBox}>▶</div>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div
        style={{
          textAlign: "center",
          marginTop: "40px",
          paddingTop: "20px",
          borderTop: "1px solid #e3caa5",
          color: "#555",
        }}
      >
        © {new Date().getFullYear()} Kamal Dairy — All Rights Reserved.
      </div>
    </footer>
  );
}

const linkStyle = {
  color: "#444",
  textDecoration: "none",
  fontSize: "15px",
  transition: "0.3s",
};

const iconBox = {
  width: "40px",
  height: "40px",
  background: "#ffffffaa",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "20px",
  cursor: "pointer",
  boxShadow: "0px 3px 10px rgba(0,0,0,0.15)",
  transition: "0.3s",
  border: "1px solid #f5d7a1",
};

export default Footer;