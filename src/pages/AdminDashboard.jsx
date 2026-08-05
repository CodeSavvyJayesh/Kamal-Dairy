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

  // Pagination States
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const token = localStorage.getItem("token");

  // Fetch Products
  const fetchProducts = async () => {
    const res = await fetch(
      `http://localhost:8080/api/products?page=${page}&size=20`
    );

    const data = await res.json();

    setProducts(data.content);
    setTotalPages(data.totalPages);
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = editingId ? "PUT" : "POST";

    const url = editingId
      ? `http://localhost:8080/api/products/${editingId}`
      : "http://localhost:8080/api/products";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(form)
    });

    setForm({
      name: "",
      price: "",
      category: "",
      imageUrl: ""
    });

    setEditingId(null);

    fetchProducts();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/api/products/${id}`, {
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

      <h1 className="admin-title">
        Admin Dashboard
      </h1>

      {/* Form */}

      <div className="admin-form-card">

        <h2>
          {editingId ? "Update Product" : "Add New Product"}
        </h2>

        <form onSubmit={handleSubmit} className="admin-form">

          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
          />

          <input
            name="category"
            placeholder="Category"
            value={form.category}
            onChange={handleChange}
            required
          />

          <input
            name="imageUrl"
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={handleChange}
            required
          />

          <button type="submit">
            {editingId ? "Update Product" : "Add Product"}
          </button>

        </form>

      </div>

      {/* Products */}

      <div className="admin-grid">

        {products.map((p) => (

          <div key={p.id} className="admin-card">

            <img src={p.imageUrl} alt={p.name} />

            <h3>{p.name}</h3>

            <p>₹ {p.price}</p>

            <span>{p.category}</span>

            <div className="admin-btn-group">

              <button
                className="edit-btn"
                onClick={() => handleEdit(p)}
              >
                Edit
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(p.id)}
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* Pagination */}

      <div className="pagination">

        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 0}
        >
          ◀ Previous
        </button>

        <span>
          Page {page + 1} of {totalPages}
        </span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages - 1}
        >
          Next ▶
        </button>

      </div>

    </div>
  );
}

export default AdminDashboard;