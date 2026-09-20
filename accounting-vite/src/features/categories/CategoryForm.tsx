import { useState, type FormEvent } from "react";
import Modal from "../../components/layout/Modal";
import type { Category } from "../../domain/accounting";
import type { RunCommand } from "../products/ProductForm";
import { errorMessage } from "../../services/accountingService";
export default function CategoryForm({
  category,
  run,
  onClose,
}: {
  category: Category | null;
  run: RunCommand;
  onClose: () => void;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    try {
      await run({
        type: "category",
        id: category?.id ?? crypto.randomUUID(),
        input: {
          title: String(f.get("title") ?? ""),
          color: String(f.get("color") ?? ""),
          icon: String(f.get("icon") ?? ""),
        },
      });
      onClose();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title={category ? "Редактировать категорию" : "Добавить категорию"}
      busy={busy}
      onClose={onClose}
    >
      <form className="product-form" onSubmit={(e) => void submit(e)}>
        <label className="form-field">
          <span>Название</span>
          <input
            name="title"
            defaultValue={category?.title ?? ""}
            required
            maxLength={100}
          />
        </label>
        <label className="form-field">
          <span>Цвет</span>
          <input
            name="color"
            type="color"
            defaultValue={category?.color ?? "#DBEAFE"}
          />
        </label>
        <label className="form-field">
          <span>Обозначение — необязательно</span>
          <input
            name="icon"
            maxLength={40}
            defaultValue={category?.icon ?? ""}
          />
        </label>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        <div className="product-form-actions">
          <button
            type="button"
            disabled={busy}
            className="secondary-button"
            onClick={onClose}
          >
            Отмена
          </button>
          <button className="primary-button" disabled={busy}>
            {busy ? "Сохранение…" : "Сохранить категорию"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
