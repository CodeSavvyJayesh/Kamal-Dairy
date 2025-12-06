import React from "react";
import "./Subscription.css";

function Subscription() {
  return (
    <div className="sub-container">

      {/* HERO SECTION */}
      <div className="sub-hero">
        <h1>Flexible Milk Delivery Subscription</h1>
        <p>Choose a plan that fits your lifestyle. Fresh milk delivered to your doorstep.</p>
      </div>

      {/* PLAN BOXES */}
      <div className="sub-plans">

        {/* DAILY PLAN */}
        <div className="sub-card">
          <h2>Daily Delivery</h2>
          <p className="sub-tag">Most Popular</p>
          <ul>
            <li>Fresh milk delivered every morning</li>
            <li>No minimum order</li>
            <li>Flexible pause/resume</li>
          </ul>
          <button className="sub-btn">Subscribe Daily</button>
        </div>

        {/* WEEKLY PLAN */}
        <div className="sub-card">
          <h2>Weekly Essentials</h2>
          <p className="sub-tag blue">Save 8% Weekly</p>
          <ul>
            <li>Choose products once per week</li>
            <li>Customizable schedule</li>
            <li>Auto-renew every 7 days</li>
          </ul>
          <button className="sub-btn">Subscribe Weekly</button>
        </div>

        {/* MONTHLY PLAN */}
        <div className="sub-card">
          <h2>Monthly Smart Saver</h2>
          <p className="sub-tag green">Save 10% Monthly</p>
          <ul>
            <li>Automatic delivery every 30 days</li>
            <li>Priority support</li>
            <li>Exclusive member benefits</li>
          </ul>
          <button className="sub-btn">Subscribe Monthly</button>
        </div>
      </div>

      {/* FAQ SECTION */}
      <div className="sub-faq">
        <h2>Frequently Asked Questions</h2>

        <div className="faq-box">
          <h3>Can I pause my subscription?</h3>
          <p>Yes! You can pause or resume your daily delivery anytime.</p>
        </div>

        <div className="faq-box">
          <h3>What if I want to change quantity?</h3>
          <p>You can update quantity or products anytime before 11:00 PM.</p>
        </div>

        <div className="faq-box">
          <h3>Is there any cancellation fee?</h3>
          <p>No. Cancel anytime without any extra charges.</p>
        </div>
      </div>

    </div>
  );
}

export default Subscription;