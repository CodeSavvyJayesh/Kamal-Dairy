function ProductCard({ product }) {
  return (
    <div
      style={{
        width: "100%",
        border: "2px solid #cce3de",
        borderRadius: "12px",
        overflow: "hidden",
        background: "#FFFFFF",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition:
          "transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.04)";
        e.currentTarget.style.borderColor = "#70d6ff";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(112,214,255,0.7)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.borderColor = "#cce3de";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
      }}
    >
      {/* Image Section */}
    <div
  style={{
    width: "100%",
    height: "230px",
    background: "#FFFDF7",
  
    
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px"
  }}
>
  <img
    src={product.image}
    alt={product.name}
    style={{
      width: "100%",
      height: "100%",
      objectFit: "contain",
    }}
    onError={(e) => {
      e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
    }}
  />
</div>



      {/* Info Box */}
      <div style={{ padding: "16px" }}>
        <h3
          style={{
            marginTop: "5px",
            color: "#1d3557",
            fontWeight: "600",
            fontSize: "20px",
          }}
        >
          {product.name}
        </h3>

        <p
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            color: "#2A9D8F",
            marginTop: "8px",
          }}
        >
          ₹{product.price}
        </p>
      </div>

      {/* Buttons Section */}
      <div style={{ display: "flex" }}>
        {/* ADD TO CART BUTTON */}
        <button
          style={{
            flex: 1,
            padding: "14px",
            background: "white",
            color:'#3A86FF',
            border: "1px solid #3A86FF",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "all 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#e8f4f8";
            e.target.style.color = "#3A86FF";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "white";
            e.target.style.color = "#3A86FF";
          }}
        >
          ADD TO CART
        </button>

        {/* KNOW MORE BUTTON */}
        <button
          style={{
            flex: 1,
            padding: "14px",
            background: "#3A86FF",
            color: "white",
            border: "1px solid #1d3557",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background 0.25s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#1d7bb6";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#1D5ED8";
          }}
        >
          KNOW MORE
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
