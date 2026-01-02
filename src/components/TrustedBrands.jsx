import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "./TrustedBrands.css";

function TrustedBrands() {
  const brands = [
    "/images/brands/amul.png",
    "/images/brands/motherdairy.png",
    "/images/brands/heritage.png",
    "/images/brands/milk_mist.png",
    "/images/brands/gokul.png",
    "/images/brands/govardhan.png",
    "/images/brands/freshfarm.png",
    "/images/brands/creamland.png",
    "/images/brands/milkyway.png",
    "/images/brands/FarmerFresh.png",
    "/images/brands/FarmLand.png",
  ];

  return (
    <section className="trusted-brands">
      <h2 className="brands-title">Trusted Brands We Deliver</h2>
      <p className="brands-subtitle">
        We source from recognized, trusted dairy brands.
      </p>

      <Swiper
        modules={[Autoplay, FreeMode]}
        freeMode={{ enabled: true, momentum: false }}
        loop={true}
        speed={1500}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        allowTouchMove={true}
        spaceBetween={30}
        breakpoints={{
          0: { slidesPerView: 2 },
          576: { slidesPerView: 3 },
          992: { slidesPerView: 5 },
        }}
        className="brands-swiper"
      >
        {brands.map((src, index) => (
          <SwiperSlide key={index} className="brand-slide">
            <img src={src} alt="brand" className="brand-img" />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}

export default TrustedBrands;