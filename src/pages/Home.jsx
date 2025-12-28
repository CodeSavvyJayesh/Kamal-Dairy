import HeroSlider from "../components/HeroSlider";
import SubscriptionSection from "../components/SubscriptionSection";
import TrendingProducts from "../components/TrendingProducts";
import TrustedBrands from "../components/TrustedBrands";
import WhyChooseUs from "../components/WhyChooseUs";
import {Link} from "react-router-dom";
function Home() {
  return (
    <div style={{ margin: 0, padding: 0 }}>

      {/* 🌟 PREMIUM MARQUEE (V2) */}
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

      {/* HERO SLIDER */}
      <HeroSlider />

        {/* Trusted Brands Section */}
      <TrustedBrands />

      {/* WHY CHOOSE US SECTION */}
      <WhyChooseUs />

    

      {/* TRENDING PRODUCTS */}
      <TrendingProducts />

      <SubscriptionSection />


      {/* 🔥 CSS SECTION */}
      <style>
        {`
        /* -----------------------------
            PREMIUM MARQUEE STYLING
        ------------------------------*/

        .marquee-wrapper {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          background: #fff3e0;
          border-bottom: 1px solid #e1d3c3;
          padding: 10px 0;
          position: relative;
        }

        .marquee-content {
          display: inline-block;
          padding-left: 100%;
          animation: marqueeMove 18s linear infinite;
          font-size: 18px;
          font-weight: 600;
          color: #8b5e34;
          letter-spacing: 0.5px;
        }

        @keyframes marqueeMove {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }

        .marquee-wrapper, .marquee-content {
          will-change: transform;
        }
      `}
      </style>
    </div>
  );
}

export default Home;