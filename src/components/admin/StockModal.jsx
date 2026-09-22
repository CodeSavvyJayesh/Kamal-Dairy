import { useState } from "react";
import { FiPackage, FiPlus } from "react-icons/fi";
import { restock, setStock } from "../../api/orders";
import { useToast } from "../../context/ToastContext";
import { stockState } from "../../utils/orders";
import Modal from "../Modal";
import "./StockModal.css";

const MAX = 100000;
const whole = (v) => (/^\d+$/.test(String(v).trim()) ? Number(v) : NaN);

/**
 * Two ways to change stock, matching how a dairy works:
 *  - "A delivery arrived": add units on top. Safe while orders are coming in.
 *  - "Stock take": set the exact count after counting the shelf.
 * Plus "Stop tracking" for items that never run out.
 */
function StockModal({ product, onClose, onSaved }) {
  const toast = useToast();
  const [add, setAdd] = useState("");
  const [exact, setExact] = useState(product?.stock ?? "");
  const [busy, setBusy] = useState(null);

  if (!product) return null;
  const s = stockState(product.stock);

  const run = async (kind, fn, message) => {
    setBusy(kind);
    try {
      const updated = await fn();
      onSaved(updated);
      setAdd("");
      setExact(updated.stock ?? "");
      toast.success(message(updated));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(null);
    }
  };

  const addN = whole(add);
  const exactN = whole(exact);
  const addOk = addN >= 1 && addN <= MAX;
  const exactOk = exact !== "" && exactN >= 0 && exactN <= MAX && exactN !== product.stock;

  return (
    <Modal
      open
      title={`Stock · ${product.name}`}
      size="sm"
      onClose={() => busy === null && onClose()}
      footer={
        <>
          {s.tracked && (
            <button
              className="kd-btn kd-btn--ghost stockm__untrack"
              disabled={busy !== null}
              onClick={() =>
                run("untrack", () => setStock(product.id, null), (p) => `${p.name} is no longer stock-tracked`)
              }
            >
              Stop tracking
            </button>
          )}
          <button className="kd-btn kd-btn--primary" onClick={onClose} disabled={busy !== null}>
            Done
          </button>
        </>
      }
    >
      <div className={`stockm__now ${s.out ? "is-out" : s.low ? "is-low" : s.tracked ? "is-ok" : ""}`}>
        <FiPackage aria-hidden="true" />
        {s.tracked ? (
          <>
            <strong>{s.left}</strong>
            <span>{s.out ? "Out of stock – customers cannot order it" : s.low ? "Running low" : "on the shelf"}</span>
          </>
        ) : (
          <span>Not tracked – always available to order</span>
        )}
      </div>

      <form
        className="stockm__row"
        onSubmit={(e) => {
          e.preventDefault();
          if (addOk) {
            run("add", () => restock(product.id, addN), (p) => `Added ${addN} · ${p.stock} on the shelf now`);
          }
        }}
      >
        <label className="kd-field">
          <span className="kd-label">A delivery arrived – add units</span>
          <input
            className="kd-input"
            inputMode="numeric"
            placeholder="e.g. 24"
            value={add}
            onChange={(e) => setAdd(e.target.value.replace(/\D/g, ""))}
          />
        </label>
        <button className="kd-btn kd-btn--primary" disabled={!addOk || busy !== null}>
          <FiPlus aria-hidden="true" /> {busy === "add" ? "Adding…" : "Add"}
        </button>
      </form>

      <form
        className="stockm__row"
        onSubmit={(e) => {
          e.preventDefault();
          if (exactOk) {
            run("set", () => setStock(product.id, exactN), (p) => `${p.name} set to ${p.stock}`);
          }
        }}
      >
        <label className="kd-field">
          <span className="kd-label">Stock take – set the exact count</span>
          <input
            className="kd-input"
            inputMode="numeric"
            placeholder={s.tracked ? String(s.left) : "Start tracking at…"}
            value={exact}
            onChange={(e) => setExact(e.target.value.replace(/\D/g, ""))}
          />
        </label>
        <button className="kd-btn kd-btn--outline" disabled={!exactOk || busy !== null}>
          {busy === "set" ? "Saving…" : "Set"}
        </button>
      </form>

      <p className="stockm__hint">
        Orders take stock the moment they are paid. A cancelled order puts it back automatically.
      </p>
    </Modal>
  );
}

export default StockModal;
