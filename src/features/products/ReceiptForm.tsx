import { useState, type FormEvent } from "react";
import Modal from "../../components/layout/Modal";
import { moneyInput, type Product } from "../../domain/accounting";
import { errorMessage } from "../../services/accountingService";
import type { RunCommand } from "./ProductForm";
export default function ReceiptForm({
  products,
  run,
  onClose,
}: {
  products: Product[];
  run: RunCommand;
  onClose: () => void;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [productId, setProductId] = useState(products[0]?.id ?? "");
  const selected = products.find((p) => p.id === productId);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      await run({
        type: "receipt",
        id: crypto.randomUUID(),
        productId,
        quantity: Number(f.get("quantity")),
        unitCost: moneyInput(String(f.get("cost") ?? "")),
        createdAt: Date.now(),
      });
      onClose();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal title="Поступление товара" busy={busy} onClose={onClose}>
      <form className="product-form" onSubmit={(e) => void submit(e)}>
        <label className="form-field">
          <span>Товар</span>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            required
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} · остаток {p.stock}
              </option>
            ))}
          </select>
        </label>
        <div className="form-row two">
          <label className="form-field">
            <span>Количество, шт.</span>
            <input
              name="quantity"
              type="number"
              min="1"
              max="1000000"
              step="1"
              defaultValue="1"
              required
            />
          </label>
          <label className="form-field">
            <span>Закупочная цена за штуку, ₽</span>
            <input name="cost" inputMode="decimal" required />
          </label>
        </div>
        {selected?.stockValue === null && (
          <p className="notice">
            Стоимость старого остатка неизвестна. Укажите её в редактировании
            товара, чтобы рассчитывать прибыль смешанного остатка.
          </p>
        )}
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <div className="product-form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
            disabled={busy}
          >
            Отмена
          </button>
          <button className="primary-button" disabled={busy || !selected}>
            {busy ? "Сохранение…" : "Принять поступление"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
