import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { api } from "../api/client";
import { useToast } from "../context/ToastContext";
import { PRODUCT_FALLBACK } from "../utils/images";
import "./AdminDashboard.css";

const EMPTY_FORM = { name: "", price: "", category: "", imageUrl: "" };
const PAGE_SIZE = 20;

function AdminDashboard() {
  const navigate = useNavigate();
  const toast = useToast();

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [confirming, setConfirming] = useState(null);

  const handleError = useCallback(
    (err) => {
      if (err.status === 401) {
        navigate("/login");
        return;
      }
      if (err.status === 403) {
        setError(
          "Your account is not an admin, so the server rejected this action."
        );
        return;
      }
      setError(err.message);
    },
    [navigate]
  );

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      setError(null);
      const data = await api(`/api/products?page=${page}&size=${PAGE_SIZE}`);
      setProducts(data?.content ?? []);
      setTotalPages(data?.totalPages ?? 0);
      setTotalItems(data?.totalElements ?? 0);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, [page, handleError]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      imageUrl: form.imageUrl.trim(),
    };

    try {
      if (editingId) {
        await api(`/api/products/${editingId}`, {
          method: "PUT",
          auth: true,
          body: payload,
        });
        toast.success(`${payload.name} updated`);
      } else {
        await api("/api/products", { method: "POST", auth: true, body: payload });
        toast.success(`${payload.name} added to the catalogue`);
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

  const confirmDelete = async () => {
    const target = confirming;
    setConfirming(null);
    setError(null);

    try {
      await api(`/api/products/${target.id}`, { method: "DELETE", auth: true });
      toast.info(`${target.name} deleted`);
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

  const categories = useMemo(
    () => new Set(products.map((p) => p.category).filter(Boolean)).size,
    [products]
  );

  return (
    <>
      <header className="page-head">
        <div className="kd-container">
          <span className="kd-eyebrow">Admin</span>
          <h1>Catalogue management</h1>
          <p>Add, edit and remove products. Every write is re-checked server-side.</p>
        </div>
      </header>

      <div className="kd-container page-body">
        {error && <p className="kd-alert">{error}</p>}

        <div className="admin__stats">
          <div className="admin__stat kd-card">
            <strong>{totalItems || products.length}</strong>
            <span>Products live</span>
          </div>
          <div className="admin__stat kd-card">
            <strong>{categories}</strong>
            <span>Categories on this page</span>
          </div>
          <div className="admin__stat kd-card">
            <strong>{totalPages || 1}</strong>
            <span>Pages</span>
          </div>
        </div>

        <div className="admin">
          <form className="admin__form kd-panel" onSubmit={handleSubmit}>
            <h2>
              {editingId ? "Update product" : "Add a product"}
              {editingId && (
                <button
                  type="button"
                  className="admin__form-cancel"
                  onClick={cancelEdit}
                  aria-label="Cancel editing"
                >
                  <FiX />
                </button>
              )}
            </h2>

            <label className="kd-field">
              <span className="kd-label">Product name</span>
              <input
                className="kd-input"
                name="name"
                placeholder="Kamal Dairy Full Cream Milk 1L"
                value={form.name}
                onChange={handleChange}
                required
              />
            </label>

            <div className="admin__row">
              <label className="kd-field">
                <span className="kd-label">Price (₹)</span>
                <input
                  className="kd-input"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="68"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </label>

              <label className="kd-field">
                <span className="kd-label">Category</span>
                <input
                  className="kd-input"
                  name="category"
                  placeholder="milk"
                  value={form.category}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>

            <label className="kd-field">
              <span className="kd-label">Image URL</span>
              <input
                className="kd-input"
                name="imageUrl"
                placeholder="https://…"
                value={form.imageUrl}
                onChange={handleChange}
                required
              />
            </label>

            {form.imageUrl && (
              <div className="admin__preview">
                <img
                  src={form.imageUrl}
                  alt=""
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = PRODUCT_FALLBACK;
                  }}
                />
                <span>Preview</span>
              </div>
            )}

            <button
              className="kd-btn kd-btn--primary kd-btn--block"
              type="submit"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="kd-spinner" aria-hidden="true" />
                  Saving…
                </>
              ) : (
                <>
                  <FiPlus aria-hidden="true" />
                  {editingId ? "Save changes" : "Add product"}
                </>
              )}
            </button>
          </form>

          <section className="admin__list">
            {loading ? (
              <div className="admin__grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div className="kd-card admin__skel" key={i}>
                    <div className="kd-skel admin__skel-img" />
                    <div className="kd-skel admin__skel-line" />
                    <div className="kd-skel admin__skel-line admin__skel-line--sm" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="kd-empty">
                <div className="kd-empty__icon">📋</div>
                <h2>No products yet</h2>
                <p>Add your first one using the form.</p>
              </div>
            ) : (
              <div className="admin__grid">
                {products.map((p) => (
                  <article
                    className={`admin__card kd-card ${
                      editingId === p.id ? "is-editing" : ""
                    }`}
                    key={p.id}
                  >
                    <div className="admin__card-media">
                      <img
                        src={p.imageUrl || PRODUCT_FALLBACK}
                        alt={p.name}
                        loading="lazy"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = PRODUCT_FALLBACK;
                        }}
                      />
                    </div>

                    <div className="admin__card-body">
                      <span className="admin__card-cat">{p.category}</span>
                      <h3>{p.name}</h3>
                      <p className="admin__card-price">₹{p.price}</p>
                    </div>

                    <div className="admin__card-actions">
                      <button
                        className="kd-btn kd-btn--ghost kd-btn--sm"
                        onClick={() => handleEdit(p)}
                      >
                        <FiEdit2 aria-hidden="true" /> Edit
                      </button>

                      <button
                        className="kd-btn kd-btn--danger kd-btn--sm"
                        onClick={() => setConfirming(p)}
                      >
                        <FiTrash2 aria-hidden="true" /> Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <nav className="admin__pager" aria-label="Pagination">
                <button
                  className="kd-btn kd-btn--ghost kd-btn--sm"
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 0}
                >
                  Previous
                </button>

                <span>
                  Page {page + 1} of {totalPages}
                </span>

                <button
                  className="kd-btn kd-btn--ghost kd-btn--sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages - 1}
                >
                  Next
                </button>
              </nav>
            )}
          </section>
        </div>
      </div>

      {/* Replaces window.confirm, which blocks the page and looks like 2004 */}
      {confirming && (
        <div
          className="admin__modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="del-title"
          onClick={(e) => e.target === e.currentTarget && setConfirming(null)}
        >
          <div className="admin__modal-box kd-panel">
            <h2 id="del-title">Delete this product?</h2>
            <p>
              <strong>{confirming.name}</strong> will be removed from the
              catalogue. This cannot be undone.
            </p>

            <div className="admin__modal-actions">
              <button
                className="kd-btn kd-btn--ghost"
                onClick={() => setConfirming(null)}
              >
                Keep it
              </button>

              <button className="kd-btn kd-btn--danger" onClick={confirmDelete}>
                <FiTrash2 aria-hidden="true" /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminDashboard;
