function SubscriptionSection() {
  const plans = [
    {
      id: 1,
      title: "Daily Delivery Service",
      desc: "Get your favourite milk, curd, paneer & essentials delivered every morning.",
      price: "Flexible pricing | No minimum order",
      bg: "#FFF4E6",
    },
    {
      id: 2,
      title: "Weekly Essentials Plan",
      desc: "Choose any dairy products you want weekly — fully customizable.",
      price: "Save 8% on weekly recurring orders",
      bg: "#E8F7FF",
    },
    {
      id: 3,
      title: "Monthly Smart Saver",
      desc: "Auto-delivery every 30 days + priority support + exclusive deals.",
      price: "Flat 10% OFF on monthly subscriptions",
      bg: "#F0FFF0",
    },
  ];

  return (
    <div style={{ padding: "40px 20px", background: "rgba(252, 252, 252, 1)" }}>
      <h2 style={{
        textAlign: "center",
        fontSize: "32px",
        fontWeight: "700",
        marginBottom: "30px",
        color: "#1d3557"
      }}>
        🥛 Choose Your Delivery Subscription
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "25px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              padding: "25px",
              background: plan.bg,
              borderRadius: "16px",
              boxShadow: "0px 5px 20px rgba(0,0,0,0.1)",
              transition: "0.3s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <h3 style={{ fontSize: "22px", marginBottom: "10px", color: "#333" }}>
              {plan.title}
            </h3>
            <p style={{ fontSize: "16px", marginBottom: "10px", color: "#555" }}>
              {plan.desc}
            </p>
            <p style={{ fontWeight: "bold", marginBottom: "20px", color: "#2a9d8f" }}>
              {plan.price}
            </p>

            <button
              style={{
                width: "100%",
                padding: "12px",
                background: "#3394c8",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "0.25s",
              }}
              onMouseEnter={(e) => (e.target.style.background = "#1d7bb6")}
              onMouseLeave={(e) => (e.target.style.background = "#3394c8")}
            >
              Subscribe Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubscriptionSection;