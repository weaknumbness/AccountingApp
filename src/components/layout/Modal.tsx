import { useEffect, useId, useRef, type ReactNode } from "react";
import { motion } from "motion/react";
export default function Modal({
  title,
  onClose,
  children,
  busy = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  busy?: boolean;
}) {
  const titleId = useId();
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const panel = container.current;
    panel?.querySelector<HTMLElement>("input,select,button")?.focus();
    return () => {
      document.body.style.overflow = overflow;
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, []);
  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => {
        if (!busy) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && !busy) {
          e.stopPropagation();
          onClose();
        }
        if (e.key === "Tab") {
          const fields = Array.from(
            container.current?.querySelectorAll<HTMLElement>(
              "button:not(:disabled),input:not(:disabled),select:not(:disabled),a[href]",
            ) ?? [],
          );
          const first = fields[0],
            last = fields.at(-1);
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last?.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first?.focus();
          }
        }
      }}
    >
      <motion.div
        ref={container}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="product-form-modal"
        initial={{ scale: 0.96, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 20 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="product-form-header">
          <h3 id={titleId}>{title}</h3>
          <button
            type="button"
            className="modal-close-button"
            disabled={busy}
            aria-label="Закрыть форму"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
