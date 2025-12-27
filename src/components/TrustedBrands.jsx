import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

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
    <section
      style={{
        width: "100%",
        padding: "30px 0",
        background: "#f9f8f6ff",
      }}
    >
      {/* Title */}
      <h2
        style={{
          textAlign: "center",
          fontSize: 22,
          marginBottom: 10,
          fontWeight: 700,
        }}
      >
        Trusted Brands We Deliver
      </h2>

      <p
        style={{
          textAlign: "center",
          marginTop: 0,
          marginBottom: 25,
          color: "#6a6a6a",
        }}
      >
        We source from recognized, trusted dairy brands.
      </p>

      {/* Slider */}
      <Swiper
        modules={[Autoplay, FreeMode]}
        freeMode={{
          enabled: true,
          momentum: false,  
        }}
        loop={true}
        speed={1500}         
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        slidesPerView={5}
        spaceBetween={30}
        allowTouchMove={true}
        breakpoints={{
          0: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
        style={{
          width: "90%",
          margin: "0 auto",
        }}
      >
        {brands.map((src, index) => (
          <SwiperSlide key={index}>
            <img
              src={src}
              alt="brand"
              className="brand-img"
              style={{
                width: "120px",
                height: "auto",
                objectFit: "contain",
                filter: "grayscale(40%)",
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* REQUIRED CSS FOR TRUE CONTINUOUS MOTION */}
      <style>
        {`
          .swiper-wrapper {
            transition-timing-function: linear !important;
          }

          .brand-img:hover {
            filter: grayscale(0%) !important;
            transform: scale(1.1);
          }
        `}
      </style>
    </section>
  );
}

export default TrustedBrands;
