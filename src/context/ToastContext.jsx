import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import "./Toast.css";

const ToastContext = createContext(null);

/**
 * Replaces every alert() in the app. Toasts stack bottom-right on desktop and
 * top-centre on mobile, auto-dismiss, and are announced to screen readers.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, tone = "success", ttl = 3200) => {
      const id = ++idRef.current;
      setToasts((list) => [...list, { id, message, tone }]);
      window.setTimeout(() => dismiss(id), ttl);
    },
    [dismiss]
  );

  const value = useMemo(
    () => ({
      toast: push,
      success: (m) => push(m, "success"),
      error: (m) => push(m, "error", 4200),
      info: (m) => push(m, "info"),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="kd-toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`kd-toast kd-toast--${t.tone}`}>
            <span className="kd-toast__icon" aria-hidden="true">
              {t.tone === "success" ? "✓" : t.tone === "error" ? "!" : "i"}
            </span>

            <span className="kd-toast__msg">{t.message}</span>

            <button
              className="kd-toast__close"
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss notification"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);

  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }

  return ctx;
}
