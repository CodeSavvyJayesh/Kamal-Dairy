import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    imageUrl: ""
  });
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    const res = await fetch("https://kamaldairy.online/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";
    const url = editingId
      ? `https://kamaldairy.online/api/products/${editingId}`
      : "https://kamaldairy.online/api/products";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    setForm({ name: "", price: "", category: "", imageUrl: "" });
    setEditingId(null);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await fetch(`https://kamaldairy.online/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product.id);
  };

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      {/* FORM SECTION */}
      <div className="admin-form-card">
        <h2>{editingId ? "Update Product" : "Add New Product"}</h2>

        <form onSubmit={handleSubmit} className="admin-form">
          <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} required />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} required />
          <input name="imageUrl" placeholder="Image URL" value={form.imageUrl} onChange={handleChange} required />

          <button type="submit">
            {editingId ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>

      {/* PRODUCTS GRID */}
      <div className="admin-grid">
        {products.map((p) => (
          <div key={p.id} className="admin-card">
            <img src={p.imageUrl} alt={p.name} />
            <h3>{p.name}</h3>
            <p>₹ {p.price}</p>
            <span>{p.category}</span>

            <div className="admin-btn-group">
              <button className="edit-btn" onClick={() => handleEdit(p)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(p.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminDashboard;