import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import "./AdminDashboard.css";

const EMPTY_FORM = { name: "", price: "", category: "", imageUrl: "" };

function AdminDashboard() {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleError = useCallback((err) => {
    if (err.status === 401) {
      navigate("/login");
      return;
    }
    if (err.status === 403) {
      setError("Your account is not an admin, so this action was rejected by the server.");
      return;
    }
    setError(err.message);
  }, [navigate]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);
      const data = await api(`/api/products?page=${page}&size=20`);
      setProducts(data?.content ?? []);
      setTotalPages(data?.totalPages ?? 0);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [page, handleError]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        name: form.name,
        price: Number(form.price),
        category: form.category,
        imageUrl: form.imageUrl,
      };

      if (editingId) {
        await api(`/api/products/${editingId}`, {
          method: "PUT",
          auth: true,
          body: payload,
        });
      } else {
        await api("/api/products", {
          method: "POST",
          auth: true,
          body: payload,
        });
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      await fetchProducts();

    } catch (err) {
      handleError(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    setError(null);
    try {
      await api(`/api/products/${id}`, { method: "DELETE", auth: true });
      await fetchProducts();
    } catch (err) {
      handleError(err);
    }
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name ?? "",
      price: product.price ?? "",
      category: product.category ?? "",
      imageUrl: product.imageUrl ?? "",
    });
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  return (
    <div className="admin-container">

      <h1 className="admin-title">Admin Dashboard</h1>

      {error && (
        <p style={{ textAlign: "center", color: "#c0392b" }}>{error}</p>
      )}

      <div className="admin-form-card">

        <h2>{editingId ? "Update Product" : "Add New Product"}</h2>

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
            min="0"
            step="0.01"
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

          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : editingId
              ? "Update Product"
              : "Add Product"}
          </button>

          {editingId && (
            <button type="button" onClick={cancelEdit} disabled={saving}>
              Cancel
            </button>
          )}

        </form>

      </div>

      {loading ? (
        <p style={{ textAlign: "center" }}>Loading products...</p>
      ) : (
        <div className="admin-grid">
          {products.map((p) => (
            <div key={p.id} className="admin-card">

              <img
                src={p.imageUrl}
                alt={p.name}
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
                }}
              />

              <h3>{p.name}</h3>
              <p>Rs {p.price}</p>
              <span>{p.category}</span>

              <div className="admin-btn-group">
                <button className="edit-btn" onClick={() => handleEdit(p)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(p.id)}>
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      <div className="pagination">

        <button onClick={() => setPage(page - 1)} disabled={page === 0}>
          Previous
        </button>

        <span>Page {totalPages === 0 ? 0 : page + 1} of {totalPages}</span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={totalPages === 0 || page >= totalPages - 1}
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default AdminDashboard;
