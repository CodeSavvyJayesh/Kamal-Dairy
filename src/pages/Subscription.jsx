import "./Subscription.css";

function Subscription() {
  return (
    <div className="sub-container">

      {/* HERO SECTION */}
      <section className="sub-hero">
        <h1>Flexible Milk Delivery Subscription</h1>
        <p>
          Choose a plan that fits your lifestyle. Fresh, farm-pure milk delivered
          to your doorstep — always on time.
        </p>
      </section>

      {/* PLANS */}
      <section className="sub-plans">

        <div className="sub-card popular">
          <span className="badge gold">Most Popular</span>
          <h2>Daily Delivery</h2>

          <ul>
            <li>🥛 Fresh milk every morning</li>
            <li>⏸ Pause / resume anytime</li>
            <li>🚚 No minimum order</li>
          </ul>

          <button className="sub-btn">Subscribe Daily</button>
        </div>

        <div className="sub-card">
          <span className="badge blue">Save 8%</span>
          <h2>Weekly Essentials</h2>

          <ul>
            <li>📦 Choose products weekly</li>
            <li>🗓 Fully customizable</li>
            <li>🔁 Auto-renew every 7 days</li>
          </ul>

          <button className="sub-btn">Subscribe Weekly</button>
        </div>

        <div className="sub-card">
          <span className="badge green">Save 10%</span>
          <h2>Monthly Smart Saver</h2>

          <ul>
            <li>📆 Auto delivery every 30 days</li>
            <li>⭐ Priority support</li>
            <li>🎁 Exclusive member perks</li>
          </ul>

          <button className="sub-btn">Subscribe Monthly</button>
        </div>

      </section>

      {/* FAQ */}
      <section className="sub-faq">
        <h2>Frequently Asked Questions</h2>

        <div className="faq-box">
          <h3>Can I pause my subscription?</h3>
          <p>Yes, you can pause or resume deliveries anytime.</p>
        </div>

        <div className="faq-box">
          <h3>Can I change quantity?</h3>
          <p>You can modify products or quantity before 11:00 PM.</p>
        </div>

        <div className="faq-box">
          <h3>Is there any cancellation fee?</h3>
          <p>No cancellation charges. Cancel anytime.</p>
        </div>
      </section>

    </div>
  );
}

export default Subscription;
