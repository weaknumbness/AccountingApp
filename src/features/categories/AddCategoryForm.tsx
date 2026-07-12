import { useState, type ChangeEvent, type FormEvent } from "react";
import { motion } from "motion/react";
import type { Category, CategoryFormData } from "../../types";

type AddCardFormProps = {
  onClose: () => void;
  onSubmit: (formData: CategoryFormData) => void;
};

export default function AddCategoryForm({
  onClose,
  onSubmit,
}: AddCardFormProps) {
  const [form, setForm] = useState<CategoryFormData>({
    title: "",
    color: "#FEF3C7",
    icon: "",
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit({
      title: form.title,
      color: form.color,
      icon: form.icon[0],
    });

    onClose();
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

  // const handleChangeSelect = (event: ChangeEvent<HTMLSelectElement>) =>
  //   setForm((prevForm) => ({ ...prevForm, category: event.target.value }));

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
            <h3>Добавить Категорию</h3>
            <p>Заполни данные категории</p>
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
            <span>Название категории</span>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChangeInput}
              placeholder="Например: Чипсы"
              required
            />
          </label>

          <label className="form-field">
            <span>Цвет</span>
            <input
              type="color"
              name="color"
              id="colorInput"
              value={form.color}
              onChange={handleChangeInput}
              placeholder="Цвет категории"
            />
          </label>

          <label className="form-field">
            <span>Иконка</span>
            <input
              type="text"
              name="icon"
              value={form.icon}
              onChange={handleChangeInput}
              placeholder="Иконка категории (emoji)"
              required
            />
          </label>

          {/* <div className="form-row">
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
          </div> */}

          <div className="product-form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Отмена
            </button>

            <button type="submit" className="primary-button">
              Добавить категорию
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
