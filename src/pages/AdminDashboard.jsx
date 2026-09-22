import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiAlertTriangle, FiEdit2, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { api } from "../api/client";
import { getStockAlerts, setStock as saveStock } from "../api/orders";
import { useToast } from "../context/ToastContext";
import { PRODUCT_FALLBACK } from "../utils/images";
import AdminSubscriptions from "../components/admin/AdminSubscriptions";
import AdminOrders from "../components/admin/AdminOrders";
import AdminInsights from "../components/admin/AdminInsights";
import AdminReviews from "../components/admin/AdminReviews";
import StockModal from "../components/admin/StockModal";
import { stockState } from "../utils/orders";
import "./AdminDashboard.css";

const EMPTY_FORM = { name: "", price: "", category: "", imageUrl: "", stock: "" };

/** Badge text and tone for a product's stock. */
function stockBadge(stock) {
  const s = stockState(stock);
  if (!s.tracked) return { text: "Not tracked", tone: "none" };
  if (s.out) return { text: "Out of stock", tone: "out" };
  if (s.low) return { text: `Only ${s.left} left`, tone: "low" };
  return { text: `${s.left} in stock`, tone: "ok" };
}
const PAGE_SIZE = 20;

const TAB_TITLES = {
  insights: {
    title: "Insights",
    text: "Revenue, best sellers, customers and subscription earnings at a glance.",
  },
  catalogue: {
    title: "Catalogue management",
    text: "Add, edit and remove products. Every write is re-checked server-side.",
  },
  subscriptions: {
    title: "Subscriptions desk",
    text: "Tomorrow's dispatch sheet, today's deliveries, refunds and recurring revenue.",
  },
  reviews: {
    title: "Reviews",
    text: "What verified buyers say about each product. Reply in public, or hide what should not be shown.",
  },
  orders: {
    title: "Orders",
    text: "Confirm, send out and deliver cart orders. A cancel refunds the customer's wallet and restocks.",
  },
};

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
  const [tab, setTab] = useState("insights");

  const [stocking, setStocking] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [editingStock, setEditingStock] = useState(null);

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

  const loadAlerts = useCallback(async () => {
    try {
      setAlerts(await getStockAlerts());
    } catch (err) {
      handleError(err);
    }
  }, [handleError]);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  const stockSaved = (updated) => {
    setProducts((list) => list.map((p) => (p.id === updated.id ? updated : p)));
    setStocking(updated);
    if (editingId === updated.id) {
      setEditingStock(updated.stock ?? null);
      setForm((f) => ({ ...f, stock: updated.stock ?? "" }));
    }
    loadAlerts();
  };

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
    const stock = String(form.stock).trim() === "" ? null : Number(form.stock);

    try {
      if (editingId) {
        await api(`/api/products/${editingId}`, {
          method: "PUT",
          auth: true,
          body: payload,
        });
        // Stock has its own endpoint so a form opened earlier can never
        // overwrite units that orders have taken since. Only sent if changed.
        if (stock !== editingStock) {
          await saveStock(editingId, stock);
        }
        toast.success(`${payload.name} updated`);
      } else {
        await api("/api/products", { method: "POST", auth: true, body: { ...payload, stock } });
        toast.success(`${payload.name} added to the catalogue`);
      }

      setForm(EMPTY_FORM);
      setEditingId(null);
      setEditingStock(null);
      await fetchProducts();
      loadAlerts();
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
      stock: product.stock ?? "",
    });
    setEditingId(product.id);
    setEditingStock(product.stock ?? null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setEditingStock(null);
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
          <h1>{TAB_TITLES[tab].title}</h1>
          <p>{TAB_TITLES[tab].text}</p>
        </div>
      </header>

      <div className="kd-container page-body">
        {error && <p className="kd-alert">{error}</p>}

        <div className="admin__tabs" role="tablist" aria-label="Admin sections">
          <button
            role="tab"
            aria-selected={tab === "insights"}
            className={`admin__tab ${tab === "insights" ? "is-on" : ""}`}
            onClick={() => setTab("insights")}
          >
            Insights
          </button>
          <button
            role="tab"
            aria-selected={tab === "catalogue"}
            className={`admin__tab ${tab === "catalogue" ? "is-on" : ""}`}
            onClick={() => setTab("catalogue")}
          >
            Catalogue
          </button>
          <button
            role="tab"
            aria-selected={tab === "subscriptions"}
            className={`admin__tab ${tab === "subscriptions" ? "is-on" : ""}`}
            onClick={() => setTab("subscriptions")}
          >
            Subscriptions
          </button>
          <button
            role="tab"
            aria-selected={tab === "orders"}
            className={`admin__tab ${tab === "orders" ? "is-on" : ""}`}
            onClick={() => setTab("orders")}
          >
            Orders
          </button>
          <button
            role="tab"
            aria-selected={tab === "reviews"}
            className={`admin__tab ${tab === "reviews" ? "is-on" : ""}`}
            onClick={() => setTab("reviews")}
          >
            Reviews
          </button>
        </div>

        {tab === "insights" ? (
          <AdminInsights onError={handleError} />
        ) : tab === "reviews" ? (
          <AdminReviews onError={handleError} />
        ) : tab === "orders" ? (
          <AdminOrders onError={handleError} onLowStock={loadAlerts} />
        ) : tab === "subscriptions" ? (
          <AdminSubscriptions onError={handleError} />
        ) : (
        <>
        <div className="admin__stats">
          <div className="admin__stat kd-card">
            <strong>{totalItems || products.length}</strong>
            <span>Products live</span>
          </div>
          <div className="admin__stat kd-card">
            <strong>{categories}</strong>
            <span>Categories on this page</span>
          </div>
          <div className={`admin__stat kd-card ${alerts.length ? "admin__stat--warn" : ""}`}>
            <strong>{alerts.length}</strong>
            <span>Low or out of stock</span>
          </div>
        </div>

        {alerts.length > 0 && (
          <div className="admin__alerts" role="status">
            <FiAlertTriangle aria-hidden="true" />
            <span className="admin__alerts-title">Running low:</span>
            {alerts.map((p) => (
              <button
                key={p.id}
                className={`admin__alert-chip ${p.stock === 0 ? "is-out" : ""}`}
                onClick={() => setStocking(p)}
                title="Manage stock"
              >
                {p.name} <b>{p.stock === 0 ? "sold out" : `${p.stock} left`}</b>
              </button>
            ))}
          </div>
        )}

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
              <span className="kd-label">Stock on the shelf</span>
              <input
                className="kd-input"
                name="stock"
                inputMode="numeric"
                placeholder="Leave blank if it never runs out"
                value={form.stock}
                onChange={(e) =>
                  setForm((f) => ({ ...f, stock: e.target.value.replace(/\D/g, "") }))
                }
              />
              <small className="admin__hint">
                {editingId
                  ? "Only saved if you change it. For deliveries use Stock on the card."
                  : "Blank means not tracked and always available."}
              </small>
            </label>

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
                      <button
                        type="button"
                        className={`admin__stock admin__stock--${stockBadge(p.stock).tone}`}
                        onClick={() => setStocking(p)}
                        aria-label={`Manage stock for ${p.name}`}
                      >
                        <span className="admin__stock-dot" aria-hidden="true" />
                        {stockBadge(p.stock).text}
                        <span className="admin__stock-cta">Stock</span>
                      </button>
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
        </>
        )}
      </div>

      <StockModal
        key={stocking?.id ?? "none"}
        product={stocking}
        onClose={() => setStocking(null)}
        onSaved={stockSaved}
      />

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
