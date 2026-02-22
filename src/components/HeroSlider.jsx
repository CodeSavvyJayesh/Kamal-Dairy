import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";

function HeroSlider() {
  const banners = [
    "/images/banners/banner1.jpg",
    "/images/banners/banner2.jpg",
    "/images/banners/banner3.jpg",
  ];

  return (
    <div
      style={{
        width: "100%",
        paddingTop: "50px",
        paddingBottom: "70px",
        background: "#ffffff", // Deep brand green (clean, no gradient)
      }}
    >
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        centeredSlides={true}
        loop={true}
        autoplay={{ delay: 2500 }}
        speed={800}
        pagination={{ clickable: true }}
        style={{
          width: "100%",
          overflow: "hidden",
        }}
      >
        {banners.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="slide-container">
              <img
                src={img}
                alt={`banner-${index}`}
                className="premium-slide"
              />

              <div className="slide-text">
                <h2>Fresh. Pure. Premium.</h2>
                <p>Kamal Dairy brings the best of nature to your home.</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style>
        {`
        .slide-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .premium-slide {
          width: 90%;
          height: 600px;
          object-fit: conver;
          border-radius: 100px;
          transition: 0.6s ease-in-out;
          opacity: 0.5;
          transform: scale(0.95);
          filter: brightness(0.85);
        }

        .swiper-slide-active .premium-slide {
          opacity: 1;
          transform: scale(1.05);
          filter: brightness(1);
          box-shadow: 0px 25px 70px rgba(0,0,0,0.4);
        }

        .swiper-slide-next .premium-slide,
        .swiper-slide-prev .premium-slide {
          opacity: 0.6;
          transform: scale(0.95);
        }

        .slide-text {
          position: absolute;
          bottom: 60px;
          left: 80px;
          color: #FFFFFF;
          opacity: 0;
          transform: translateY(20px);
          transition: 0.6s ease-out;
        }

        .swiper-slide-active .slide-text {
          opacity: 1;
          transform: translateY(0px);
        }

        .slide-text h2 {
          font-size: 44px;
          margin: 0;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .slide-text p {
          font-size: 19px;
          margin-top: 10px;
          opacity: 0.9;
        }

        /* Clean Brand Pagination */

        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: #ffffff;
          opacity: 0.4;
          transition: 0.3s ease;
        }

        .swiper-pagination-bullet-active {
          background: #D9181F; /* Lotus red */
          opacity: 1;
          transform: scale(1.3);
        }
        `}
      </style>
    </div>
  );
}

export default HeroSlider;