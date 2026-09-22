import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FiCheck, FiCheckCircle, FiInfo, FiMoon, FiSearch, FiSun } from "react-icons/fi";
import { api } from "../api/client";
import {
  createSubscription,
  getPlans,
  listSubscriptions,
  previewSubscription,
} from "../api/subscriptions";
import { QuantityStepper, WeekdayPicker } from "../components/SubscriptionBits";
import { useToast } from "../context/ToastContext";
import { useWallet } from "../context/useWallet";
import {
  WEEKDAYS,
  addDays,
  formatDay,
  hourLabel,
  parseDay,
  relativeDay,
  rupees,
  rupeesShort,
  todayISO,
} from "../utils/format";
import { PRODUCT_FALLBACK } from "../utils/images";
import { PLAN_META } from "../utils/subscription";
import "./SubscriptionBuilder.css";

const CATEGORIES = [
  "Milk", "Paneer", "Butter", "Ghee", "Yoghurt", "Cheese",
  "Buttermilk", "Lassi", "Chaas", "Shrikhand", "Powdered Milk", "Ice Cream",
];
const slug = (name) => name.toLowerCase().replaceAll(" ", "");

const DAILY_OPTIONS = [
  { code: "DAILY", label: "Every day" },
  { code: "ALTERNATE_DAYS", label: "Alternate days" },
  { code: "CUSTOM_DAYS", label: "Pick days" },
];

const JS_DAY = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const weekdayOf = (iso) => JS_DAY[parseDay(iso).getDay()];

const EMPTY_ADDRESS = { name: "", phone: "", address: "", city: "Mumbai", pincode: "" };

function SubscriptionBuilder() {
  const navigate = useNavigate();
  const toast = useToast();
  const [params] = useSearchParams();
  const { balance, refresh: refreshWallet } = useWallet();

  const initialPlan = PLAN_META[params.get("plan")] ? params.get("plan") : "daily";

  const [options, setOptions] = useState(null);
  const [plan, setPlan] = useState(initialPlan);
  const [frequency, setFrequency] = useState(PLAN_META[initialPlan].frequencies[0]);
  const [days, setDays] = useState([]);

  const [category, setCategory] = useState(PLAN_META[initialPlan].defaultCategory);
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [product, setProduct] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [slot, setSlot] = useState("MORNING");
  const [startDate, setStartDate] = useState("");
  const [address, setAddress] = useState(EMPTY_ADDRESS);

  const [previewState, setPreviewState] = useState({ key: null, data: null, error: null });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Plans, cutoff and the earliest possible start date come from the server.
  useEffect(() => {
    getPlans()
      .then((p) => {
        setOptions(p);
        setStartDate(p.firstEditableDate);
        setDays(initialPlan === "weekly" ? [weekdayOf(p.firstEditableDate)] : ["MON", "WED", "FRI"]);
      })
      .catch((err) => setError(err.message));

    // Returning customers: reuse the last delivery address.
    listSubscriptions()
      .then((list) => {
        const last = list.find((s) => s.address?.address);
        if (last) setAddress({ ...EMPTY_ADDRESS, ...last.address });
      })
      .catch(() => {});
  }, [initialPlan]);

  useEffect(() => {
    let alive = true;

    api(`/api/products/${encodeURIComponent(category)}`)
      .then((data) => alive && setProducts(Array.isArray(data) ? data : []))
      .catch(() => alive && setProducts([]))
      .finally(() => alive && setProductsLoading(false));

    return () => {
      alive = false;
    };
  }, [category]);

  const switchCategory = (next) => {
    if (next === category) return;
    setProductsLoading(true);
    setQuery("");
    setCategory(next);
  };

  const visibleProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? products.filter((p) => p.name?.toLowerCase().includes(q)) : products;
  }, [products, query]);

  const choosePlan = (next) => {
    setPlan(next);
    setFrequency(PLAN_META[next].frequencies[0]);
    switchCategory(PLAN_META[next].defaultCategory);
    setProduct(null);
    if (next === "weekly" && startDate) setDays([weekdayOf(startDate)]);
    if (next === "daily") setDays(["MON", "WED", "FRI"]);
  };

  const needsDays = frequency === "CUSTOM_DAYS" || frequency === "WEEKLY";

  // Live price, always from the server - the browser never computes a charge.
  // Each request is identified by a key built from the inputs, so a slow
  // response for an old selection can never overwrite a newer one.
  const daysError = needsDays && days.length === 0 ? "Pick at least one delivery day." : null;

  const requestKey =
    product && startDate && !daysError
      ? JSON.stringify({
          productId: product.id,
          quantity,
          frequency,
          daysOfWeek: needsDays ? days : [],
          startDate,
        })
      : null;

  useEffect(() => {
    if (!requestKey) return undefined;

    const t = setTimeout(async () => {
      try {
        const data = await previewSubscription(JSON.parse(requestKey));
        setPreviewState({ key: requestKey, data, error: null });
      } catch (err) {
        setPreviewState({ key: requestKey, data: null, error: err.message });
      }
    }, 280);

    return () => clearTimeout(t);
  }, [requestKey]);

  const previewLoading = Boolean(requestKey) && previewState.key !== requestKey;
  const preview = requestKey ? previewState.data : null;
  const previewError = daysError || (previewState.key === requestKey ? previewState.error : null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product) {
      setError("Pick a product first.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const created = await createSubscription({
        productId: product.id,
        quantity,
        frequency,
        daysOfWeek: needsDays ? days : [],
        slot,
        startDate,
        address,
      });

      await refreshWallet();
      toast.success(`${created.productName} subscription started`);
      navigate(`/subscriptions/${created.id}`, { replace: true, state: { created: true } });
    } catch (err) {
      if (err.status === 401) {
        navigate("/login", { state: { from: "/subscriptions/new" } });
        return;
      }
      setError(err.message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  };

  const setField = (e) => setAddress((a) => ({ ...a, [e.target.name]: e.target.value }));

  const cutoff = hourLabel(options?.cutoffHour ?? 23);
  const minStart = options?.firstEditableDate ?? todayISO();
  const maxStart = addDays(todayISO(), 60);
  const shortBy = preview ? Number(preview.pricePerDelivery) - balance : 0;

  const slots = options?.slots ?? [
    { code: "MORNING", label: "Morning, 6 – 8 AM" },
    { code: "EVENING", label: "Evening, 5 – 7 PM" },
  ];

  return (
    <>
      <header className="page-head">
        <div className="kd-container">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/subscription">Plans</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">New subscription</span>
          </nav>
          <h1>Build your subscription</h1>
          <p>Four quick choices. You can change any of them later, up to {cutoff} the night before.</p>
        </div>
      </header>

      <div className="kd-container page-body">
        {error && <p className="kd-alert">{error}</p>}

        <form className="builder" onSubmit={handleSubmit}>
          <div className="builder__main">
            {/* ---------------- 1. plan ---------------- */}
            <section className="bstep kd-panel">
              <header className="bstep__head">
                <span className="bstep__num">1</span>
                <div>
                  <h2>Choose a plan</h2>
                  <p>Longer cycles come with a bigger discount.</p>
                </div>
              </header>

              <div className="bplans" role="radiogroup" aria-label="Plan">
                {Object.entries(PLAN_META).map(([id, meta]) => {
                  const off = id === "weekly" ? 8 : id === "monthly" ? 10 : 0;
                  return (
                    <button
                      key={id}
                      type="button"
                      role="radio"
                      aria-checked={plan === id}
                      className={`bplan ${plan === id ? "is-on" : ""}`}
                      onClick={() => choosePlan(id)}
                    >
                      <span className="bplan__icon" aria-hidden="true">{meta.icon}</span>
                      <strong>{meta.name}</strong>
                      <small>{meta.tagline}</small>
                      {off > 0 && <span className="kd-badge kd-badge--gold bplan__off">{off}% off</span>}
                      <span className="bplan__check" aria-hidden="true"><FiCheck /></span>
                    </button>
                  );
                })}
              </div>

              {plan === "daily" && (
                <div className="bstep__sub">
                  <span className="kd-label">How often?</span>
                  <div className="bchips" role="radiogroup" aria-label="Frequency">
                    {DAILY_OPTIONS.map((o) => (
                      <button
                        key={o.code}
                        type="button"
                        role="radio"
                        aria-checked={frequency === o.code}
                        className={`bchip ${frequency === o.code ? "is-on" : ""}`}
                        onClick={() => setFrequency(o.code)}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>

                  {frequency === "CUSTOM_DAYS" && (
                    <WeekdayPicker value={days} onChange={setDays} days={WEEKDAYS} />
                  )}
                </div>
              )}

              {plan === "weekly" && (
                <div className="bstep__sub">
                  <span className="kd-label">Delivery day</span>
                  <WeekdayPicker value={days} onChange={setDays} days={WEEKDAYS} single />
                </div>
              )}

              {plan === "monthly" && (
                <p className="bstep__note">
                  <FiInfo aria-hidden="true" /> Delivered every 30 days, counting from your start date.
                </p>
              )}
            </section>

            {/* ---------------- 2. product ---------------- */}
            <section className="bstep kd-panel">
              <header className="bstep__head">
                <span className="bstep__num">2</span>
                <div>
                  <h2>Pick a product</h2>
                  <p>One product per subscription. Add more subscriptions any time.</p>
                </div>
              </header>

              <div className="bcats" role="tablist" aria-label="Category">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    role="tab"
                    aria-selected={category === slug(c)}
                    className={`bcat ${category === slug(c) ? "is-on" : ""}`}
                    onClick={() => switchCategory(slug(c))}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {products.length > 6 && (
                <label className="bsearch">
                  <FiSearch aria-hidden="true" />
                  <span className="kd-sr-only">Search products</span>
                  <input
                    className="kd-input"
                    type="search"
                    placeholder="Search…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
              )}

              {productsLoading ? (
                <div className="bprods">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div className="bprod bprod--skel" key={i}>
                      <div className="kd-skel bprod__skel-img" />
                      <div className="kd-skel bprod__skel-line" />
                    </div>
                  ))}
                </div>
              ) : visibleProducts.length === 0 ? (
                <p className="bstep__empty">Nothing here right now – try another category.</p>
              ) : (
                <div className="bprods" role="radiogroup" aria-label="Product">
                  {visibleProducts.map((p) => {
                    const on = product?.id === p.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        className={`bprod ${on ? "is-on" : ""}`}
                        onClick={() => setProduct(p)}
                      >
                        <span className="bprod__media">
                          <img
                            src={p.imageUrl || PRODUCT_FALLBACK}
                            alt=""
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = PRODUCT_FALLBACK;
                            }}
                          />
                          {on && <span className="bprod__tick"><FiCheck /></span>}
                        </span>
                        <span className="bprod__name">{p.name}</span>
                        <span className="bprod__price">{rupeesShort(p.price)}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {/* ---------------- 3. timing ---------------- */}
            <section className="bstep kd-panel">
              <header className="bstep__head">
                <span className="bstep__num">3</span>
                <div>
                  <h2>Quantity and timing</h2>
                  <p>Orders for a day close at {cutoff} the night before.</p>
                </div>
              </header>

              <div className="btiming">
                <div className="kd-field">
                  <span className="kd-label">Per delivery</span>
                  <QuantityStepper
                    value={quantity}
                    onChange={setQuantity}
                    max={options?.maxQuantity ?? 10}
                  />
                </div>

                <label className="kd-field">
                  <span className="kd-label">First delivery</span>
                  <input
                    className="kd-input"
                    type="date"
                    min={minStart}
                    max={maxStart}
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (plan === "weekly" && e.target.value) setDays([weekdayOf(e.target.value)]);
                    }}
                    required
                  />
                </label>
              </div>

              <span className="kd-label">Delivery slot</span>
              <div className="bslots" role="radiogroup" aria-label="Delivery slot">
                {slots.map((s) => (
                  <button
                    key={s.code}
                    type="button"
                    role="radio"
                    aria-checked={slot === s.code}
                    className={`bslot ${slot === s.code ? "is-on" : ""}`}
                    onClick={() => setSlot(s.code)}
                  >
                    {s.code === "MORNING" ? <FiSun aria-hidden="true" /> : <FiMoon aria-hidden="true" />}
                    {s.label}
                  </button>
                ))}
              </div>
            </section>

            {/* ---------------- 4. address ---------------- */}
            <section className="bstep kd-panel">
              <header className="bstep__head">
                <span className="bstep__num">4</span>
                <div>
                  <h2>Where should we deliver?</h2>
                  <p>Our rider calls this number if they cannot find you.</p>
                </div>
              </header>

              <div className="baddr">
                <label className="kd-field">
                  <span className="kd-label">Name</span>
                  <input className="kd-input" name="name" value={address.name} onChange={setField}
                    autoComplete="name" minLength={2} maxLength={80} required />
                </label>
                <label className="kd-field">
                  <span className="kd-label">Mobile number</span>
                  <input className="kd-input" name="phone" value={address.phone} onChange={setField}
                    autoComplete="tel" inputMode="tel" placeholder="98XXXXXXXX" required />
                </label>
                <label className="kd-field baddr__wide">
                  <span className="kd-label">Flat, building and street</span>
                  <input className="kd-input" name="address" value={address.address} onChange={setField}
                    autoComplete="street-address" minLength={5} maxLength={255} required />
                </label>
                <label className="kd-field">
                  <span className="kd-label">City</span>
                  <input className="kd-input" name="city" value={address.city} onChange={setField}
                    autoComplete="address-level2" required />
                </label>
                <label className="kd-field">
                  <span className="kd-label">Pincode</span>
                  <input className="kd-input" name="pincode" value={address.pincode} onChange={setField}
                    inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="postal-code" required />
                </label>
              </div>
            </section>
          </div>

          {/* ---------------- summary ---------------- */}
          <aside className="bsum kd-panel" aria-live="polite">
            <h2>Your plan</h2>

            {!product ? (
              <div className="bsum__empty">
                <span aria-hidden="true">🥛</span>
                <p>Pick a product to see your price.</p>
              </div>
            ) : (
              <>
                <div className="bsum__product">
                  <img
                    src={product.imageUrl || PRODUCT_FALLBACK}
                    alt=""
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = PRODUCT_FALLBACK;
                    }}
                  />
                  <div>
                    <strong>{product.name}</strong>
                    <span>
                      × {quantity} · {PLAN_META[plan].name}
                    </span>
                  </div>
                </div>

                {previewError && !previewLoading && <p className="bsum__error">{previewError}</p>}

                {preview && (
                  <div className={`bsum__price ${previewLoading ? "is-stale" : ""}`}>
                    <span className="bsum__label">Per delivery</span>
                    <div className="bsum__amount">
                      <strong>{rupees(preview.pricePerDelivery)}</strong>
                      {preview.discountPercent > 0 && (
                        <s>{rupees(Number(preview.unitPrice) * preview.quantity)}</s>
                      )}
                    </div>
                    {preview.discountPercent > 0 && (
                      <span className="kd-badge kd-badge--gold">
                        You save {rupees(preview.savingsPerDelivery)} ({preview.discountPercent}%)
                      </span>
                    )}

                    <dl className="bsum__facts">
                      <div>
                        <dt>Schedule</dt>
                        <dd>{preview.frequencyLabel}</dd>
                      </div>
                      <div>
                        <dt>First 30 days</dt>
                        <dd>
                          {preview.deliveriesPerMonth} {preview.deliveriesPerMonth === 1 ? "delivery" : "deliveries"} ·{" "}
                          {rupees(preview.estimatedMonthly)}
                        </dd>
                      </div>
                    </dl>

                    <span className="bsum__label">First deliveries</span>
                    <ul className="bsum__dates">
                      {preview.upcomingDates.map((d) => (
                        <li key={d}>{relativeDay(d)}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {previewLoading && !preview && <div className="kd-skel bsum__skel" />}
              </>
            )}

            <div className={`bsum__wallet ${shortBy > 0 ? "is-short" : ""}`}>
              <span>Wallet balance</span>
              <strong>{rupees(balance)}</strong>
            </div>

            {preview && shortBy > 0 && (
              <p className="bsum__hint">
                Add at least {rupees(shortBy)} before {cutoff} on{" "}
                {formatDay(addDays(preview.startDate, -1))} so your first delivery goes out. You
                can top up right after this step.
              </p>
            )}

            <button
              type="submit"
              className="kd-btn kd-btn--primary kd-btn--lg kd-btn--block"
              disabled={submitting || !product || !preview}
            >
              {submitting ? (
                <>
                  <span className="kd-spinner" aria-hidden="true" /> Starting…
                </>
              ) : (
                <>
                  <FiCheckCircle aria-hidden="true" /> Start subscription
                </>
              )}
            </button>

            <p className="bsum__fine">
              Nothing is charged now. Each delivery is paid from your wallet at {cutoff} the night
              before it arrives.
            </p>
          </aside>
        </form>
      </div>
    </>
  );
}

export default SubscriptionBuilder;
