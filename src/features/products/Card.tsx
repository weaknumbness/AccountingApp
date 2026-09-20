import { memo, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { money, type Product, type Category } from "../../domain/accounting";
import type { RunCommand } from "./ProductForm";
import { errorMessage } from "../../services/accountingService";
import placeholder from "../../components/assets/LaysCrab.jpg";
type Props = {
  product: Product;
  category: Category | undefined;
  run: RunCommand;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};
export default memo(function Card({
  product: p,
  category,
  run,
  onEdit,
  onDelete,
}: Props) {
  const [open, setOpen] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const locked = useRef(false);
  const menu = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (e: MouseEvent) => {
      if (e.target instanceof Node && !menu.current?.contains(e.target))
        setOpen(false);
    };
    const escape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  async function sell(kind: "regular" | "friend") {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    setError("");
    try {
      await run({
        type: "sale",
        id: crypto.randomUUID(),
        productId: p.id,
        priceKind: kind,
        expectedPrice: kind === "regular" ? p.price : (p.friendPrice ?? 0),
        createdAt: Date.now(),
      });
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }
  async function archive() {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    setError("");
    try {
      await run({ type: "archive", id: p.id, archived: !p.archived });
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      locked.current = false;
      setBusy(false);
      setOpen(false);
    }
  }
  return (
    <motion.article
      className="card"
      data-product-id={p.id}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      whileHover={{ y: -3 }}
    >
      <div className="card-header">
        <div className="card-image">
          {p.imageUrl ? (
            <img
              src={p.imageUrl}
              alt={p.title}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = placeholder;
              }}
            />
          ) : (
            <div className="product-placeholder" aria-hidden="true">
              {p.title.slice(0, 2).toUpperCase()}
            </div>
          )}
        </div>
        <div className="card-titleAndCategory">
          <h3 className="card-title">{p.title}</h3>
          <div
            className="card-category"
            style={{
              backgroundColor: category?.color ?? "#DBEAFE",
              color: "#09172a",
            }}
          >
            {category?.title ?? "Категория"}
          </div>
        </div>
        <div className="card-dropdown" ref={menu}>
          <button
            type="button"
            className="card-dropdown-button"
            aria-label={`Действия: ${p.title}`}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            ⋮
          </button>
          {open && (
            <div className="card-dropdown-menu">
              <button
                type="button"
                className="card-dropdown-item"
                onClick={() => {
                  setOpen(false);
                  onEdit(p.id);
                }}
              >
                Редактировать
              </button>
              <button
                type="button"
                className="card-dropdown-item card-dropdown-item-danger"
                disabled={busy}
                onClick={() => void archive()}
              >
                {p.archived ? "Восстановить" : "В архив"}
              </button>
              {p.archived && <button type="button"
                className="card-dropdown-item card-dropdown-item-danger"
                disabled={busy} onClick={() => { setOpen(false); onDelete(p.id); }}>
                Удалить
              </button>}
            </div>
          )}
        </div>
      </div>
      <div className="card-data">
        <div className="card-stock">
          <p>Остаток:</p>
          <span data-stock>{p.stock} шт.</span>
        </div>
        <div className="card-stock">
          <p>Продано{p.legacy ? " с перехода" : ""}:</p>
          <span>{p.sold} шт.</span>
        </div>
        <div className="card-profit">
          <p>Выручка:</p>
          <span>{money(p.openingRevenue + p.revenue)}</span>
        </div>
        <div className="card-profit">
          <p>Валовая прибыль:</p>
          <span>
            {money(p.knownProfit)}
            {p.unknownCostSold || p.legacy ? " *" : ""}
          </span>
        </div>
        {(p.unknownCostSold > 0 || p.legacy) && (
          <small className="muted">
            * По продажам с известной себестоимостью.
          </small>
        )}
      </div>
      {!p.archived && (
        <div className="card-buttons">
          <button
            type="button"
            className="card-button"
            disabled={busy || p.stock === 0}
            onClick={() => void sell("regular")}
            aria-label={`Продать ${p.title} за ${money(p.price)}`}
          >
            <span>{money(p.price)}</span>
            <small>Обычная</small>
          </button>
          {p.friendPrice !== null && (
            <button
              type="button"
              className="card-button friend-button"
              disabled={busy || p.stock === 0}
              onClick={() => void sell("friend")}
              aria-label={`Продать ${p.title} для друзей за ${money(p.friendPrice)}`}
            >
              <span>{money(p.friendPrice)}</span>
              <small>Для друзей</small>
            </button>
          )}
        </div>
      )}
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
    </motion.article>
  );
});
