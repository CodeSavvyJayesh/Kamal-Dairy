import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import { isLoggedIn } from "../api/client";
import { getPlans, listSubscriptions } from "../api/subscriptions";
import { hourLabel } from "../utils/format";
import "./Subscription.css";

const PLANS = [
  {
    id: "daily",
    name: "Daily Delivery",
    tagline: "For households that go through milk every morning.",
    features: [
      "Every day, alternate days, or only the days you pick",
      "Delivered 6 – 8 AM or 5 – 7 PM",
      "Skip any single day with one tap",
      "Paid per delivery from your wallet",
    ],
  },
  {
    id: "weekly",
    name: "Weekly Essentials",
    tagline: "Paneer, butter and curd, once a week, on your day.",
    featured: true,
    features: [
      "One delivery a week on the day you choose",
      "8% off every single delivery",
      "Skip a week whenever you like",
      "Change quantity any time before 11 PM",
    ],
  },
  {
    id: "monthly",
    name: "Monthly Smart Saver",
    tagline: "Ghee and pantry staples at our lowest price.",
    features: [
      "Auto-delivery every 30 days",
      "10% off every single delivery",
      "Vacation mode for when you are away",
      "Cancel any time, no fee",
    ],
  },
];

const STEPS = [
  { n: 1, title: "Build your plan", text: "Pick a product, how many, and which days." },
  { n: 2, title: "Top up your wallet", text: "Add money once through UPI or card." },
  { n: 3, title: "We deliver", text: "Each delivery is paid the night before it arrives." },
  { n: 4, title: "Stay in control", text: "Skip, pause or go on vacation any time." },
];

function Subscription() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(0);
  const [discount, setDiscount] = useState({ daily: 0, weekly: 8, monthly: 10 });
  const [cutoff, setCutoff] = useState(23);
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    let alive = true;

    getPlans()
      .then((p) => {
        if (!alive) return;
        const d = {};
        for (const f of p.frequencies) d[f.plan] = Math.max(d[f.plan] ?? 0, f.discountPercent);
        setDiscount(d);
        setCutoff(p.cutoffHour);
      })
      .catch(() => {});

    if (isLoggedIn()) {
      listSubscriptions()
        .then((list) => alive && setActiveCount(list.filter((s) => s.status !== "CANCELLED").length))
        .catch(() => {});
    }

    return () => {
      alive = false;
    };
  }, []);

  const cut = hourLabel(cutoff);

  const faqs = [
    {
      q: "How does payment work?",
      a: `You top up your Kamal wallet once. At ${cut} the night before each delivery we charge that one delivery from the balance - nothing is taken in advance, and you can see every charge in your wallet.`,
    },
    {
      q: "Can I pause or skip?",
      a: `Yes. Skip a single day, pause indefinitely, or set vacation dates - all from your account, free, as long as it is before ${cut} the night before.`,
    },
    {
      q: "What if my wallet runs low?",
      a: "That delivery is simply not sent and you are not charged. We email you, and the next delivery goes out as normal once you top up.",
    },
    {
      q: "Is there a cancellation fee?",
      a: "None. Cancel whenever you like. You only ever pay for deliveries that were actually scheduled, and unused balance stays in your wallet for your next order.",
    },
    {
      q: "Which areas do you deliver to?",
      a: "Marine Lines, Borivali, Ghatkopar and Chembur today, with more of Mumbai being added each quarter.",
    },
  ];

  return (
    <>
      <header className="page-head">
        <div className="kd-container">
          <span className="kd-eyebrow">Subscriptions</span>
          <h1>Flexible milk delivery, on your schedule</h1>
          <p>
            Choose a plan that fits your household. Farm-pure dairy at your door, always on
            time, and always yours to change.
          </p>
        </div>
      </header>

      <div className="kd-container page-body">
        {activeCount > 0 && (
          <Link to="/subscriptions" className="plans__mine kd-card">
            <span>
              You have <strong>{activeCount}</strong> {activeCount === 1 ? "subscription" : "subscriptions"}
            </span>
            <span className="plans__mine-cta">
              Manage <FiArrowRight aria-hidden="true" />
            </span>
          </Link>
        )}

        <div className="plans">
          {PLANS.map((plan) => {
            const off = discount[plan.id] ?? 0;

            return (
              <article
                key={plan.id}
                className={`plan kd-card ${plan.featured ? "is-featured" : ""}`}
              >
                {plan.featured && <span className="plan__ribbon">Most popular</span>}

                <h2>{plan.name}</h2>
                <p className="plan__tagline">{plan.tagline}</p>

                <div className="plan__price">
                  <strong>{off ? `Save ${off}%` : "Pay as you go"}</strong>
                  <span>{off ? `${off}% off every delivery` : "No minimum order"}</span>
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
                  onClick={() => navigate(`/subscriptions/new?plan=${plan.id}`)}
                >
                  Choose {plan.name.split(" ")[0]}
                </button>
              </article>
            );
          })}
        </div>

        <section className="how" aria-labelledby="how-title">
          <h2 id="how-title" className="how__title">How it works</h2>
          <ol className="how__steps">
            {STEPS.map((s) => (
              <li key={s.n} className="how__step">
                <span className="how__num">{s.n}</span>
                <strong>{s.title}</strong>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="faq">
          <h2 className="faq__title">Frequently asked questions</h2>

          <div className="faq__list">
            {faqs.map((item, i) => {
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
            Still unsure? <Link to="/contact">Talk to us</Link> – we answer every message.
          </p>
        </section>
      </div>
    </>
  );
}

export default Subscription;
