import { useEffect, useId, useRef } from "react";
import { FiX } from "react-icons/fi";
import "./Modal.css";

/**
 * Accessible dialog: Escape and backdrop click close it, focus moves inside
 * on open and returns to the trigger on close, and the page behind stops
 * scrolling.
 */
function Modal({ open, title, onClose, children, footer, size = "md", tone }) {
  const titleId = useId();
  const boxRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previous = document.activeElement;
    const onKey = (e) => e.key === "Escape" && onClose?.();

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    const first = boxRef.current?.querySelector(
      "input, select, textarea, button:not(.kd-modal__close)"
    );
    (first || boxRef.current)?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="kd-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        className={`kd-modal__box kd-modal__box--${size} ${tone ? `kd-modal__box--${tone}` : ""}`}
        ref={boxRef}
        tabIndex={-1}
      >
        <header className="kd-modal__head">
          <h2 id={titleId}>{title}</h2>
          <button className="kd-modal__close" onClick={onClose} aria-label="Close">
            <FiX />
          </button>
        </header>

        <div className="kd-modal__body">{children}</div>

        {footer && <footer className="kd-modal__foot">{footer}</footer>}
      </div>
    </div>
  );
}

export default Modal;
