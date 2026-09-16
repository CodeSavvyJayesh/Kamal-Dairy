import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "./HeroSlider.css";

const SLIDES = [
  {
    img: "/images/banners/banner1.jpg",
    eyebrow: "Trusted since 1980",
    title: "Fresh. Pure. Premium.",
    copy: "Farm-fresh milk and dairy essentials, at your door before your first chai.",
    cta: { to: "/products", label: "Shop the range" },
  },
  {
    img: "/images/banners/banner2.jpg",
    eyebrow: "Never run out",
    title: "Your milk, on autopilot.",
    copy: "Daily, weekly or monthly delivery. Pause, skip or cancel whenever you like.",
    cta: { to: "/subscription", label: "See subscriptions" },
  },
  {
    img: "/images/banners/banner3.jpg",
    eyebrow: "Across Mumbai",
    title: "Same-day, every day.",
    copy: "Marine Lines, Borivali, Ghatkopar and Chembur — delivered fresh, on time.",
    cta: { to: "/contact", label: "Find your store" },
  },
];

function HeroSlider() {
  return (
    <section className="hero" aria-label="Featured">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        slidesPerView={1}
        loop
        speed={900}
        autoplay={{ delay: 5200, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="hero__swiper"
      >
        {SLIDES.map((slide, i) => (
          <SwiperSlide key={slide.img}>
            <div className="hero__slide">
              <img
                src={slide.img}
                alt=""
                className="hero__img"
                loading={i === 0 ? "eager" : "lazy"}
                fetchPriority={i === 0 ? "high" : "auto"}
              />

              <div className="hero__scrim" />

              <div className="hero__content kd-container">
                <span className="hero__eyebrow">{slide.eyebrow}</span>
                <h1 className="hero__title">{slide.title}</h1>
                <p className="hero__copy">{slide.copy}</p>

                <div className="hero__actions">
                  <Link to={slide.cta.to} className="kd-btn kd-btn--gold kd-btn--lg">
                    {slide.cta.label}
                  </Link>
                  <Link to="/products" className="kd-btn kd-btn--lg hero__ghost">
                    Browse categories
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="hero__strip">
        <div className="kd-container hero__strip-inner">
          <div className="hero__stat">
            <strong>45+</strong>
            <span>years of trust</span>
          </div>
          <div className="hero__stat">
            <strong>11</strong>
            <span>partner brands</span>
          </div>
          <div className="hero__stat">
            <strong>4</strong>
            <span>Mumbai outlets</span>
          </div>
          <div className="hero__stat">
            <strong>6am</strong>
            <span>daily delivery</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSlider;
