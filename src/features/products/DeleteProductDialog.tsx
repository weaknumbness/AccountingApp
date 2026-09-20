import { useRef, useState } from "react";
import Modal from "../../components/layout/Modal";
import type { Product } from "../../domain/accounting";
import { errorMessage } from "../../services/accountingService";
import type { RunCommand } from "./ProductForm";

export default function DeleteProductDialog({ product, run, onClose }: {
  product: Product; run: RunCommand; onClose: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const locked = useRef(false);
  async function remove() {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    setError("");
    try {
      await run({ type: "deleteProduct", id: product.id });
      onClose();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }
  return <Modal title="Удалить товар?" onClose={onClose} busy={busy}>
    <div className="delete-product-content">
      <p>Товар «{product.title}» будет удалён из архива. Восстановить карточку будет нельзя.</p>
      {product.stock > 0 && <p className="notice">В карточке осталось {product.stock} шт. Этот остаток также будет удалён.</p>}
      <p>История продаж и поступлений, выручка и валовая прибыль сохранятся в учёте.</p>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="product-form-actions">
        <button type="button" className="secondary-button" onClick={onClose} disabled={busy}>Отмена</button>
        <button type="button" className="primary-button danger-button" onClick={() => void remove()} disabled={busy}>{busy ? "Удаление…" : "Удалить товар"}</button>
      </div>
    </div>
  </Modal>;
}
