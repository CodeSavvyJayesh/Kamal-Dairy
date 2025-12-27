import { Link } from "react-router-dom";
console.log("NAVBAR ADDED");

function Navbar() {
  return (
    <nav style={{
      width: "100%",
      height: "80px",
      backgroundColor: "#fffaf0",
      fontWeight:'600', 
      borderBottom: "2px solid black",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 30px",
      position: "fixed",
      top: 0,
      left: 0,

      zIndex: 1000
    }}> 
        <Link to = "/">
        <img 
          src="images/logo/logo.jpg"
          alt="logo"
          style={{ width: "100px",height:"80px" ,borderRadius: "5px" }}
      
        />
        </Link>
        

      <div style={{ display: "flex",margin:70, gap: "50px" }}>
        
        <Link to="/" style={{ color: "black", textDecoration: "none",fontSize:25,color:'#0A2540' }}>Home</Link>
        <Link to="/products" style={{ color: "black", textDecoration: "none",fontSize:25, color:'#0A2540' }}>Products</Link>
        <Link to="/subscription" style={{ color: "black", textDecoration: "none",fontSize:25, color:'#0A2540'}}>Subscription</Link>
        <Link to="/contact" style={{ color: "black", textDecoration: "none",fontSize:25,color: '#0A2540' }}>Contact</Link>
        <Link to="/cart" style={{ color: "black", textDecoration: "none",fontSize:25,color:'#0A2540'}}>Cart</Link>
        <Link to="/login" style={{ color: "black", textDecoration: "none",fontSize:25,color:'#0A2540' }}>Login</Link>
      </div>
    </nav>
  );
}

export default Navbar;
