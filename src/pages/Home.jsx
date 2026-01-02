import HeroSlider from "../components/HeroSlider";
import SubscriptionSection from "../components/SubscriptionSection";
import TrendingProducts from "../components/TrendingProducts";
import TrustedBrands from "../components/TrustedBrands";
import WhyChooseUs from "../components/WhyChooseUs";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">

      {/* 🌟 PREMIUM MARQUEE */}
      <div className="marquee-wrapper">
        <div className="marquee-content">
          🌟 Fresh • Pure • Premium • Kamal Dairy brings nature’s best to your home |
          🚚 Same-Day Delivery | 🎉 Orders Above ₹1000 → FLAT 10% OFF |
          📍 Now Delivering in Marine Lines • Borivali • Ghatkopar • Chembur |
          🧈 100% Farm Fresh Dairy | ❄ Hygienic Packaging | 🥛 Trusted Since 1980
        </div>

        <div className="marquee-content">
          🌟 Fresh • Pure • Premium • Kamal Dairy brings nature’s best to your home |
          🚚 Same-Day Delivery | 🎉 Orders Above ₹1000 → FLAT 10% OFF |
          📍 Now Delivering in Marine Lines • Borivali • Ghatkopar • Chembur |
          🧈 100% Farm Fresh Dairy | ❄ Hygienic Packaging | 🥛 Trusted Since 1980
        </div>
      </div>

      {/* HERO SLIDER (FULL WIDTH) */}
      <HeroSlider />

      {/* CONTENT SECTIONS */}
      <div className="home-container">
        <TrustedBrands />
        <WhyChooseUs />
        <TrendingProducts />
        <SubscriptionSection />
      </div>

    </div>
  );
}

export default Home;