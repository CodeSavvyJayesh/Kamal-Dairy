import { Link } from "react-router-dom";
import "./SubscriptionSection.css";

const PLANS = [
  {
    id: "daily",
    title: "Daily Delivery",
    desc: "Milk, curd, paneer and essentials at your door every morning.",
    price: "Flexible pricing",
    note: "No minimum order",
    tone: "gold",
  },
  {
    id: "weekly",
    title: "Weekly Essentials",
    desc: "Pick your products once, and they arrive every week. Fully customisable.",
    price: "Save 8%",
    note: "Auto-renews every 7 days",
    tone: "blue",
    featured: true,
  },
  {
    id: "monthly",
    title: "Monthly Smart Saver",
    desc: "Auto-delivery every 30 days, priority support and member-only deals.",
    price: "Save 10%",
    note: "Cancel anytime",
    tone: "green",
  },
];

function SubscriptionSection() {
  return (
    <section className="kd-section subs">
      <div className="kd-section-head">
        <span className="kd-eyebrow">Never run out</span>
        <h2>Put your dairy on autopilot</h2>
        <p>Pause, skip or cancel whenever you like. No lock-in, no fees.</p>
      </div>

      <div className="subs__grid">
        {PLANS.map((plan) => (
          <article
            key={plan.id}
            className={`subs__card kd-card kd-card--hover subs__card--${plan.tone} ${
              plan.featured ? "is-featured" : ""
            }`}
          >
            {plan.featured && (
              <span className="subs__ribbon">Most popular</span>
            )}

            <h3>{plan.title}</h3>
            <p className="subs__desc">{plan.desc}</p>

            <div className="subs__price">
              <strong>{plan.price}</strong>
              <span>{plan.note}</span>
            </div>

            <Link
              to={`/subscriptions/new?plan=${plan.id}`}
              className={`kd-btn kd-btn--block ${
                plan.featured ? "kd-btn--primary" : "kd-btn--outline"
              }`}
            >
              Choose plan
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default SubscriptionSection;
