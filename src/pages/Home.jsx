import { Link } from "react-router-dom";
import HeroSlider from "../components/HeroSlider";
import SubscriptionSection from "../components/SubscriptionSection";
import TrendingProducts from "../components/TrendingProducts";
import TrustedBrands from "../components/TrustedBrands";
import WhyChooseUs from "../components/WhyChooseUs";
import "./Home.css";

const TICKER = [
  "Same-day delivery across Mumbai",
  "Orders above ₹1000 — flat 10% off",
  "Marine Lines • Borivali • Ghatkopar • Chembur",
  "100% farm fresh dairy",
  "Hygienic, tamper-evident packaging",
  "Trusted since 1980",
];

/**
 * The old version fetched /api/products here and passed the result to
 * <TrendingProducts>, which ignored the prop and refetched anyway. Worse, that
 * endpoint returns a paginated Page object, not an array, so the state was the
 * wrong shape from the start. The fetch is gone - each section owns its data.
 */
function Home() {
  return (
    <div className="home">
      <HeroSlider />

      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          {[0, 1].map((copy) => (
            <div className="ticker__group" key={copy}>
              {TICKER.map((item) => (
                <span className="ticker__item" key={item}>
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="kd-container">
        <TrustedBrands />
        <WhyChooseUs />
        <TrendingProducts />
        <SubscriptionSection />
      </div>

      <section className="cta">
        <div className="kd-container cta__inner">
          <div>
            <h2>Tomorrow&apos;s milk, sorted tonight.</h2>
            <p>
              Set up a delivery in under two minutes. Pause it any time you are
              out of town.
            </p>
          </div>

          <div className="cta__actions">
            <Link to="/products" className="kd-btn kd-btn--gold kd-btn--lg">
              Start shopping
            </Link>
            <Link to="/subscription" className="kd-btn kd-btn--lg cta__ghost">
              Set up a subscription
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
