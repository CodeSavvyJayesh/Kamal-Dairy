import React from "react";

function TrendingProducts() {
  const products = [
    {
      name: "Full Cream Milk 1L",
      price: "₹62",
      image: "/images/milk/Kamal Dairy Full Cream Milk 1L.jpg",
    },
    {
      name: "Fresh Farm Cow Milk 1L",
      price: "₹58",
      image: "/images/milk/FreshFarm Double Toned Milk 1L.jpg",
    },
    {
      name: "Paneer 200g",
      price: "₹85",
      image: "images/paneer/DailyFresh Classic Paneer 500g.jpg",
    },
    {
      name: "CreamLand Malai Paneer",
      price: "₹120",
      image: "/images/paneer/CreamLand Malai Paneer 1kg.jpg",
    },
    /*
    {
      name: "Pure Ghee 500ml",
      price: "₹350",
      image: "/images/ghee/ghee500ml.png",
    },
    {
      name: "Fresh Curd 500ml",
      price: "₹40",
      image: "/images/yoghurt/curd500ml.png",
    },*/
  ];

  return (
    <div
      style={{
        padding: "60px 20px",
        background: "#fffdf6",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "36px",
          marginBottom: "40px",
          color: "#2c2c2c",
        }}
      >
         Most Purchased 
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "30px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {products.map((item, index) => (
          <div key={index} className="trend-card">
            <img
              src={item.image}
              alt={item.name}
              style={{
                width: "100%",
                height: "210px",
                objectFit: "contain",
                borderRadius: "12px",
                background: "#ffffff",
              }}
            />

            <h3
              style={{
                fontSize: "20px",
                marginTop: "15px",
                textAlign: "center",
                color: "#333",
              }}
            >
              {item.name}
            </h3>

            <p
              style={{
                textAlign: "center",
                fontSize: "18px",
                margin: "6px 0",
                color: "#007aff",
              }}
            >
              {item.price}
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "12px",
              }}
            >
              <button className="btn-primary">ADD TO CART</button>
              <button className="btn-secondary">KNOW MORE</button>
            </div>
          </div>
        ))}
      </div>

      <style>
        {`
          .trend-card {
            background: #fffdf6;
            padding: 18px;
            border-radius: 18px;
            box-shadow: 0 6px 18px rgba(0,0,0,0.50);
            transition: 0.3s ease;
          }

          .trend-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 12px 30px rgba(0,0,0,0.30);
          }

          .btn-primary {
            padding: 10px 14px;
            border: none;
            background: #007aff;
            border-radius: 8px;
            color: white;
            cursor: pointer;
            font-weight: 600;
            transition: 0.3s;
          }

          .btn-primary:hover {
            background: navy;

          }

          .btn-secondary {
            padding: 10px 14px;
            border: 2px solid #007aff;
            background: transparent;
            border-radius: 8px;
            color: #007aff;
            cursor: pointer;
            font-weight: 600;
            transition: 0.3s;
          }

          .btn-secondary:hover {
            background: #e7f1ff;
          }
        `}
      </style>
    </div>
  );
}

export default TrendingProducts;