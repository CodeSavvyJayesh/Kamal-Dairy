import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    imageUrl: "",
  });

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // 🔐 Protect route
  useEffect(() => {
    if (!token || role !== "ROLE_ADMIN") {
      navigate("/");
    }
  }, [role, token, navigate]);

  // 📦 Load products
  useEffect(() => {
    fetch("http://15.207.98.62:8080/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  // ➕ Add Product
  const handleAdd = async () => {
    await fetch("http://15.207.98.62:8080/api/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    window.location.reload();
  };

  // ❌ Delete Product
  const handleDelete = async (id) => {
    await fetch(`http://15.207.98.62:8080/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    window.location.reload();
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>Admin Dashboard</h2>

      <div style={{ marginBottom: "30px" }}>
        <h3>Add Product</h3>
        <input
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Price"
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          placeholder="Category"
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />
        <input
          placeholder="Image URL"
          onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
        />
        <button onClick={handleAdd}>Add Product</button>
      </div>

      <h3>All Products</h3>
      {products.map((p) => (
        <div key={p.id} style={{ marginBottom: "10px" }}>
          {p.name} - ₹{p.price}
          <button
            style={{ marginLeft: "15px", color: "red" }}
            onClick={() => handleDelete(p.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Admin;