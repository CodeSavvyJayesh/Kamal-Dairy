function WhyChooseUs() {
  const points = [
    { title: "100% Farm Fresh", desc: "Milk sourced directly from trusted brands." },
    { title: "Same-Day Delivery", desc: "Delivered fresh to your doorstep daily." },
    { title: "Premium Quality", desc: "No preservatives. Only pure dairy goodness." },
    { title: "Hygienic Packaging", desc: "Every product packed with utmost care." }
  ];

  return (
    <div style={{ background: "#fffaf0", padding: "60px 20px" }}>
      <h2 style={{ textAlign: "center", fontSize: "36px", marginBottom: "40px" }}>
        Why Choose Kamal Dairy?
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "25px",
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        {points.map((item, i) => (
          <div
            key={i}
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "18px",
              boxShadow: "0 6px 18px rgba(77, 30, 30, 0.15)",
              textAlign: "center",
              transition: "0.3s",
            }}
            className="choose-card"
          >
            <h3 style={{ fontSize: "22px", marginBottom: "10px" }}>{item.title}</h3>
            <p style={{ fontSize: "16px", opacity: 0.8 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      <style>
        {`
        .choose-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
        }
      `}
      </style>
    </div>
  );
}

export default WhyChooseUs;