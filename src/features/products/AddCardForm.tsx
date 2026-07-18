// import { motion, AnimatePresence } from "motion/react";
// import type { ProductFormData } from "../../types";

// type AddCardFormProps = {
//   onClose: () => void;
//   onSubmit: (formData: ProductFormData) => void;
// };

// export default function AddCardForm({ onClose, onSubmit }: AddCardFormProps) {
//   return (
//     <motion.div className="AddCardOpen">
//       <AnimatePresence>
//         <form action=""></form>
//       </AnimatePresence>
//     </motion.div>
//   );
// }

import { useState, type ChangeEvent, type FormEvent } from "react";
import { motion } from "motion/react";
import type {
  Category,
  ProductFormData,
  ProductFormForInputs,
} from "../../types";

type AddCardFormProps = {
  onClose: () => void;
  onSubmit: (formData: ProductFormData) => void;
  categories: Category[];
};

export default function AddCardForm({
  onClose,
  onSubmit,
  categories,
}: AddCardFormProps) {
  const [form, setForm] = useState<ProductFormForInputs>({
    title: "",
    firstPrice: "",
    secondPrice: "",
    imageUrl: "",
    stock: "",
    category: "",
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const prices = [Number(form.firstPrice)];

    if (form.secondPrice.trim() !== "" && form.secondPrice.trim() !== "0") {
      prices.push(Number(form.secondPrice));
    }

    onSubmit({
      title: form.title,
      prices: prices,
      category: form.category,
      imageUrl: form.imageUrl,
      stock: Number(form.stock),
    });
  };

  const handleBackdropClick = () => {
    onClose();
  };

  const stopPropagation = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
  };

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleChangeSelect = (event: ChangeEvent<HTMLSelectElement>) =>
    setForm((prevForm) => ({ ...prevForm, category: event.target.value }));

  return (
    <motion.div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="product-form-modal"
        onClick={stopPropagation}
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 24 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <div className="product-form-header">
          <div>
            <h3>Добавить товар</h3>
            <p>Заполни данные товара для учёта продаж</p>
          </div>

          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            aria-label="Закрыть форму"
          >
            ×
          </button>
        </div>

        <form className="product-form" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>Название товара</span>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChangeInput}
              placeholder="Например: Лейс с крабом"
              required
            />
          </label>

          <label className="form-field">
            <span>Категория</span>
            <select
              name="category"
              className="form-select"
              onChange={handleChangeSelect}
              required
            >
              <option value="-" disabled selected>
                -
              </option>
              {categories.map((category) => (
                <option value={category.title}>{category.title}</option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Ссылка на картинку</span>
            <input
              type="text"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChangeInput}
              placeholder="URL картинки"
              required
            />
          </label>

          <div className="form-row">
            <label className="form-field">
              <span>Остаток</span>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChangeInput}
                placeholder="19"
                min="0"
                required
              />
            </label>

            <label className="form-field">
              <span>Цена 1</span>
              <input
                type="number"
                name="firstPrice"
                value={form.firstPrice}
                onChange={handleChangeInput}
                placeholder="165"
                min="0"
                required
              />
            </label>

            <label className="form-field">
              <span>Цена 2</span>
              <input
                type="number"
                name="secondPrice"
                value={form.secondPrice}
                onChange={handleChangeInput}
                placeholder="175"
                min="0"
              />
            </label>
          </div>

          <div className="product-form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Отмена
            </button>

            <button type="submit" className="primary-button">
              Добавить товар
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
