import { Link } from "react-router-dom";

function Products() {
  
  const categories = [
    { id: 1, name: "Milk" },
    { id: 2, name: "Paneer" },
    { id: 3, name: "Butter" },
    { id: 4, name: "Ghee" },
    { id: 5, name: "Ice Cream" },
    { id: 6, name: "Buttermilk" },
    { id: 7, name: "Yoghurt" },
    { id: 8, name: "Cheese" },
    { id: 9, name: "Lassi" },
    { id: 10, name: "Powdered Milk" },
    { id: 11, name: "Shrikhand" },
    { id: 12, name: "Chaas" }
  ];

  return (
    <div style={{ padding: "20px", color:"#0077B6",backgroundColor:"#fffaf0"}}>
      <h1>Product Categories</h1>
      

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "30px",
          marginTop: "50px",
          backgroundColor: "#fffaf0"
        }}
      >
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/products/${cat.name.toLowerCase().replaceAll(" ", "")}`}
            style={{ textDecoration: "none", color: "black" }}
          >
         <div
  style={{
    color: "white",
    padding: "20px",
    border: "1px solid lightblue",
    borderRadius: "10px",
    textAlign: "center",
    background: "#3394c8ff",
    cursor: "pointer",
    fontSize: "19px",
    fontWeight: "bold",
    transition:
      "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease"
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "scale(1.05)";
    e.currentTarget.style.borderColor = "#66d9ff";
    e.currentTarget.style.background = "#4eb3e6"; // smooth color shift
    e.currentTarget.style.boxShadow = "0 0 20px rgba(102, 217, 255, 0.8)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.borderColor = "lightblue";
    e.currentTarget.style.background = "#3394c8ff";
    e.currentTarget.style.boxShadow = "none";
  }}
>
  {cat.name}
</div>



          </Link>
        ))}
      </div>
    </div>
  );
}

export default Products;
