import { useState } from "react";
import { Link } from "react-router-dom";
import { FiCheck } from "react-icons/fi";
import { useToast } from "../context/ToastContext";
import "./Subscription.css";

const PLANS = [
  {
    id: "daily",
    name: "Daily Delivery",
    tagline: "For households that go through milk every morning.",
    price: "Pay as you go",
    save: null,
    features: [
      "Fresh milk every morning before 7 AM",
      "Pause or resume any time",
      "No minimum order value",
      "Change products before 11 PM",
    ],
  },
  {
    id: "weekly",
    name: "Weekly Essentials",
    tagline: "Set it once, and your week is sorted.",
    price: "Save 8%",
    save: "8% off every order",
    featured: true,
    features: [
      "Choose any products, any quantity",
      "Auto-renews every 7 days",
      "Fully customisable each week",
      "Skip a week whenever you like",
    ],
  },
  {
    id: "monthly",
    name: "Monthly Smart Saver",
    tagline: "The cheapest way to never think about it again.",
    price: "Save 10%",
    save: "10% off every order",
    features: [
      "Auto-delivery every 30 days",
      "Priority customer support",
      "Exclusive member-only offers",
      "Cancel any time, no fee",
    ],
  },
];

const FAQS = [
  {
    q: "Can I pause my subscription?",
    a: "Yes. Pause or resume any time from your account — there is no limit and no charge for pausing.",
  },
  {
    q: "Can I change the quantity or products?",
    a: "You can modify products and quantities up to 11:00 PM the night before your delivery.",
  },
  {
    q: "Is there a cancellation fee?",
    a: "None. Cancel whenever you like and you will only have paid for what was already delivered.",
  },
  {
    q: "Which areas do you deliver to?",
    a: "Marine Lines, Borivali, Ghatkopar and Chembur today, with more of Mumbai being added each quarter.",
  },
];

function Subscription() {
  const toast = useToast();
  const [open, setOpen] = useState(0);

  const choose = (plan) => {
    // The backend has no subscription endpoint yet, so this registers interest
    // instead of silently pretending a plan was created.
    toast.info(`${plan.name} — we'll email you as soon as plans go live.`);
  };

  return (
    <>
      <header className="page-head">
        <div className="kd-container">
          <span className="kd-eyebrow">Subscriptions</span>
          <h1>Flexible milk delivery, on your schedule</h1>
          <p>
            Choose a plan that fits your household. Farm-pure dairy at your door,
            always on time.
          </p>
        </div>
      </header>

      <div className="kd-container page-body">
        <div className="plans">
          {PLANS.map((plan) => (
            <article
              key={plan.id}
              className={`plan kd-card ${plan.featured ? "is-featured" : ""}`}
            >
              {plan.featured && <span className="plan__ribbon">Most popular</span>}

              <h2>{plan.name}</h2>
              <p className="plan__tagline">{plan.tagline}</p>

              <div className="plan__price">
                <strong>{plan.price}</strong>
                {plan.save && <span>{plan.save}</span>}
              </div>

              <ul className="plan__features">
                {plan.features.map((f) => (
                  <li key={f}>
                    <FiCheck aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                className={`kd-btn kd-btn--block ${
                  plan.featured ? "kd-btn--primary" : "kd-btn--outline"
                }`}
                onClick={() => choose(plan)}
              >
                Choose {plan.name.split(" ")[0]}
              </button>
            </article>
          ))}
        </div>

        <section className="faq">
          <h2 className="faq__title">Frequently asked questions</h2>

          <div className="faq__list">
            {FAQS.map((item, i) => {
              const isOpen = open === i;

              return (
                <div className={`faq__item ${isOpen ? "is-open" : ""}`} key={item.q}>
                  <button
                    className="faq__q"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                  >
                    {item.q}
                    <span className="faq__chev" aria-hidden="true" />
                  </button>

                  <div className="faq__a" hidden={!isOpen}>
                    <p>{item.a}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="faq__more">
            Still unsure?{" "}
            <Link to="/contact">Talk to us</Link> — we answer every message.
          </p>
        </section>
      </div>
    </>
  );
}

export default Subscription;
