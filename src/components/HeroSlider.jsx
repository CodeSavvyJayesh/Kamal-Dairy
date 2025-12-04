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
        background: "#fffaf0",
        paddingTop: "30px",
        paddingBottom: "60px",
      }}
    >
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        centeredSlides={true}
        loop={true}
        autoplay={{ delay: 1800 }}
        speed={700}
        pagination={{ clickable: true }}
        style={{
          width: "100%",
          overflow: "visible",
        }}
      >
        {banners.map((img, index) => (
          <SwiperSlide key={index}>
            <div className="slide-container">
              <img src={img} alt={`banner-${index}`} className="premium-slide" />

              {/* TEXT OVERLAY */}
              <div className="slide-text">
                <h2 style={{ color: "white" }}>Fresh. Pure. Premium.</h2>
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
          width: 100%;
          height: 600px;
          object-fit: contain;
          border-radius: 45px;
          transition: 0.7s ease-in-out;
          opacity: 0.35;
          transform: scale(0.9);
          filter: brightness(0.6) blur(1px);
          animation: kenburns 12s ease-in-out infinite;
        }

        @keyframes kenburns {
          0% { transform: scale(1); }
          100% { transform: scale(1.05); }
        }

        .swiper-slide-active .premium-slide {
          opacity: 1;
          transform: scale(1.15);
          filter: brightness(1.15) blur(0px);
          border-radius: 55px;
          box-shadow: 0px 25px 90px rgba(0,0,0,0.35);
        }

        .swiper-slide-next .premium-slide,
        .swiper-slide-prev .premium-slide {
          opacity: 0.6;
          transform: scale(0.95);
          filter: brightness(0.75) blur(0.4px);
        }

        .slide-text {
          position: absolute;
          bottom: 50px;
          left: 60px;
          color: #ffffff;
          text-shadow: 0 4px 12px rgba(0,0,0,0.45);
          opacity: 0;
          transform: translateY(20px);
          transition: 0.7s ease-out;
        }

        .swiper-slide-active .slide-text {
          opacity: 1;
          transform: translateY(0px);
        }

        .slide-text h2 {
          font-size: 44px;
          margin: 0;
          font-weight: 700;
        }

        .slide-text p {
          font-size: 20px;
          margin-top: 10px;
          opacity: 0.9;
        }

        .swiper-pagination-bullet {
          width: 14px;
          height: 14px;
          background: #d4b27d;
          opacity: 0.4;
          transition: 0.3s;
        }

        .swiper-pagination-bullet-active {
          background: #8b6b34;
          opacity: 1;
          transform: scale(1.4);
          box-shadow: 0 0 12px rgba(139, 107, 52, 0.7);
        }
      `}
      </style>
    </div>
  );
}

export default HeroSlider;