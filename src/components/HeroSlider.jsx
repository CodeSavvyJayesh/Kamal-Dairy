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
        paddingTop: "30px",
        paddingBottom: "50px",
        background: `
          linear-gradient(
            90deg,
            #0f3d1e 0%,
            #145a32 35%,
            #7a1010 70%,
            #b71c1c 100%
          )
        `,
        boxShadow: "inset 0 0 120px rgba(0,0,0,0.6)",
      }}
    >
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        centeredSlides={true}
        loop={true}
        autoplay={{ delay: 2000 }}
        speed={900}
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
          width: 150%;
          height: 600px;
          object-fit: contain;
          border-radius: 55px;
          transition: 0.7s ease-in-out;
          opacity: 0.4;
          transform: scale(0.9);
          filter: brightness(0.65) blur(1px);
          animation: kenburns 12s ease-in-out infinite;
        }

        @keyframes kenburns {
          0% { transform: scale(1); }
          100% { transform: scale(1.06); }
        }

        .swiper-slide-active .premium-slide {
          opacity: 1;
          transform: scale(1.12);
          filter: brightness(1.1) blur(0px);
          border-radius: 55px;
          box-shadow: 0px 35px 120px rgba(0,0,0,0.5);
        }

        .swiper-slide-next .premium-slide,
        .swiper-slide-prev .premium-slide {
          opacity: 0.6;
          transform: scale(0.95);
          filter: brightness(0.8) blur(0.3px);
        }

        .slide-text {
          position: absolute;
          bottom: 70px;
          left: 80px;
          color: #ffffff;
          text-shadow: 0 6px 20px rgba(0,0,0,0.8);
          opacity: 0;
          transform: translateY(20px);
          transition: 0.7s ease-out;
        }

        .swiper-slide-active .slide-text {
          opacity: 1;
          transform: translateY(0px);
        }

        .slide-text h2 {
          font-size: 48px;
          margin: 0;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .slide-text p {
          font-size: 21px;
          margin-top: 14px;
          opacity: 0.95;
        }

        /* BRAND PAGINATION */

        .swiper-pagination-bullet {
          width: 14px;
          height: 14px;
          background: #0F3D1E;
          opacity: 0.5;
          transition: 0.3s ease;
        }

        .swiper-pagination-bullet-active {
          background: #D9181F;
          opacity: 1;
          transform: scale(1.4);
          box-shadow: 0 0 14px rgba(217,24,31,0.7);
        }
        `}
      </style>
    </div>
  );
}

export default HeroSlider;