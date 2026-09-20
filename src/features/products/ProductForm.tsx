import { useState, type FormEvent } from "react";
import Modal from "../../components/layout/Modal";
import {
  moneyInput,
  type AccountingState,
  type Command,
  type Product,
} from "../../domain/accounting";
import { errorMessage } from "../../services/accountingService";
export type RunCommand = (cmd: Command) => Promise<void>;
export default function ProductForm({
  product,
  state,
  onClose,
  run,
}: {
  product: Product | null;
  state: AccountingState;
  onClose: () => void;
  run: RunCommand;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState(product?.categoryId ?? "");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      const text = (key: string) => String(f.get(key) ?? "").trim();
      const input = {
        title: text("title"),
        categoryId: category,
        imageUrl: text("imageUrl"),
        price: moneyInput(text("price")),
        friendPrice:
          text("friendPrice") === "" ? null : moneyInput(text("friendPrice")),
      };
      const cmd: Command = {
        type: "product",
        id: product?.id ?? crypto.randomUUID(),
        input,
      };
      if (text("openingCost"))
        cmd.openingCost = moneyInput(text("openingCost"));
      await run(cmd);
      onClose();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title={product ? "Редактировать товар" : "Добавить товар"}
      busy={busy}
      onClose={onClose}
    >
      <form className="product-form" onSubmit={(e) => void submit(e)}>
        <label className="form-field">
          <span>Название товара</span>
          <input
            name="title"
            defaultValue={product?.title ?? ""}
            maxLength={150}
            required
          />
        </label>
        <label className="form-field">
          <span>Категория</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>
              Выберите категорию
            </option>
            {Object.values(state.categories).map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        {!Object.keys(state.categories).length && (
          <p className="notice">
            Сначала добавьте категорию на странице «Категории».
          </p>
        )}
        <label className="form-field">
          <span>Ссылка на изображение — необязательно</span>
          <input
            type="url"
            name="imageUrl"
            placeholder="https://…"
            defaultValue={product?.imageUrl ?? ""}
          />
        </label>
        <div className="form-row two">
          <label className="form-field">
            <span>Обычная цена, ₽</span>
            <input
              name="price"
              inputMode="decimal"
              defaultValue={product ? product.price / 100 : ""}
              required
            />
          </label>
          <label className="form-field">
            <span>Цена для друзей, ₽ — необязательно</span>
            <input
              name="friendPrice"
              inputMode="decimal"
              defaultValue={
                product?.friendPrice == null ? "" : product.friendPrice / 100
              }
            />
          </label>
        </div>
        {product?.stockValue === null && (
          <label className="form-field">
            <span>Закупочная цена текущего остатка за штуку, ₽</span>
            <input
              name="openingCost"
              inputMode="decimal"
              placeholder="Укажите, если известна"
            />
            <small>
              Применится к текущему остатку. Прошлые продажи не пересчитываются.
            </small>
          </label>
        )}
        <p className="muted">
          Количество добавляется отдельно кнопкой «Поступление».
        </p>
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
          <button
            className="primary-button"
            disabled={busy || !Object.keys(state.categories).length}
          >
            {busy ? "Сохранение…" : "Сохранить товар"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
