import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import { api } from "../api/client";
import "./CategoryProducts.css";

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "name", label: "Name A–Z" },
];

function CategoryProducts() {
  const { category } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await api(`/api/products/${encodeURIComponent(category)}`);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    load();
    setQuery("");
    setSort("featured");
  }, [load]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = q
      ? products.filter((p) => p.name?.toLowerCase().includes(q))
      : products;

    const sorted = [...filtered];

    if (sort === "price-asc") sorted.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") sorted.sort((a, b) => b.price - a.price);
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));

    return sorted;
  }, [products, query, sort]);

  const title = String(category || "").replace(/-/g, " ");

  return (
    <>
      <header className="page-head">
        <div className="kd-container">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to="/products">Products</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{title}</span>
          </nav>

          <h1 className="cat-page__title">{title}</h1>

          <p>
            {loading
              ? "Fetching the freshest stock…"
              : (() => {
                  // Sold-out items are still listed, but not counted as available.
                  const n = products.filter((p) => p.stock === null || p.stock === undefined || p.stock > 0).length;
                  return `${n} ${n === 1 ? "product" : "products"} available right now`;
                })()}
          </p>
        </div>
      </header>

      <div className="kd-container page-body">
        {!loading && !error && products.length > 0 && (
          <div className="cat-page__toolbar">
            <label className="cat-page__search">
              <span className="kd-sr-only">Search within {title}</span>
              <input
                className="kd-input"
                type="search"
                placeholder={`Search in ${title}…`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>

            <label className="cat-page__sort">
              <span className="kd-sr-only">Sort products</span>
              <select
                className="kd-select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        {error && <p className="kd-alert">{error}</p>}

        {loading && (
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="kd-empty">
            <div className="kd-empty__icon">🧺</div>
            <h2>Nothing here yet</h2>
            <p>We are restocking this category. Try another one in the meantime.</p>
            <Link to="/products" className="kd-btn kd-btn--primary">
              Browse all categories
            </Link>
          </div>
        )}

        {!loading && !error && products.length > 0 && visible.length === 0 && (
          <div className="kd-empty">
            <div className="kd-empty__icon">🔍</div>
            <h2>No match for “{query}”</h2>
            <p>Try a shorter search term.</p>
            <button className="kd-btn kd-btn--outline" onClick={() => setQuery("")}>
              Clear search
            </button>
          </div>
        )}

        {!loading && !error && visible.length > 0 && (
          <div className="product-grid">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default CategoryProducts;
