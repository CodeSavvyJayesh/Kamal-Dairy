import "./SubscriptionSection.css";

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
    <section className="subscription-section">
      <h2 className="subscription-title">
        🥛 Choose Your Delivery Subscription
      </h2>

      <div className="subscription-grid">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="subscription-card"
            style={{ background: plan.bg }}
          >
            <h3>{plan.title}</h3>
            <p className="desc">{plan.desc}</p>
            <p className="price">{plan.price}</p>

            <button className="subscribe-btn">
              Subscribe Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SubscriptionSection;