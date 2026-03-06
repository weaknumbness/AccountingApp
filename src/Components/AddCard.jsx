import { useState, useEffect } from "react"

export default function AddCard(props) {
  const [animate, setAnimate] = useState(false);
  const [value, setValue] = useState("");
  const [form, setForm] = useState({
    name: "",
    priceOne: "",
    priceTwo: "",
    stock: "",
    profit: "",
    category: props.category
  });

  // Функция для контроля инпутов
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Функция отправки формы
  const validHandleSubmit = (e) => {
    e.preventDefault();

    const price =
      value === "1"
        ? [String(form.priceOne) + "Р"]
        : [String(form.priceOne) + "Р", String(form.priceTwo) + "Р"];

    //Проверка на заполненность всех полей
    validation(form.name, price, form.stock, form.profit, form.category);

    // Очистка формы после отправки
    setForm({
      name: "",
      priceOne: "",
      priceTwo: "",
      stock: "",
      profit: "",
      category: props.category
    });

    // Закрытие формы
    props.cb()
  }

  //Проверка на заполненность всех полей
  const validation = (name, price, stock, profit, category) => {
    const requiredFields = ["name", "priceOne", "stock", "profit", "category"];
    if (value === "2") {
      requiredFields.push("priceTwo");
    }
    const hasEmpty = requiredFields.some(
      field => form[field].trim() === ""
    );
    if (hasEmpty) {
      return;
    }
    props.handleSubmit(
      name,
      price,
      stock,
      Number(profit),
      category
    );
  };

  //Плавная анимация открытия модального окна
  useEffect(() => {
    if (props.isOpen) {
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
    }
  }, [props.isOpen]);

  return <div className="AddCard">
    {props.isOpen && (
      <div className="modal-overlay" onClick={props.cb}>
        <div
          className={`modal-window ${animate ? "active" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <h1>Форма создание карточки товара</h1>
          <form onSubmit={validHandleSubmit} className="addCardForm">
            <label>
              <h2>Введите имя товара</h2>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <div className="category">
                <h2>Категория</h2>
                <p>{props.category}</p>
              </div>
              <h2>Выберите кол-во цен</h2>
              <select name="" onChange={(e) => setValue(e.target.value)} value={value} required>
                <option disabled value="">-</option>
                <option value="1">1</option>
                <option value="2">2</option>
              </select>

              {value === "1" &&
                <>
                  <h2>Введите цену</h2>
                  <input
                    type="number"
                    name="priceOne"
                    value={form.priceOne}
                    onChange={handleChange}
                    required
                  />
                </>}
              {value === "2" &&
                <>
                  <h2>Введите цены</h2>
                  <input
                    type="number"
                    name="priceOne"
                    value={form.priceOne}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="number"
                    name="priceTwo"
                    value={form.priceTwo}
                    onChange={handleChange}
                    required
                  />
                </>}
            </label>
            <h2>Введите остаток</h2>
            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              required
            />
            <h2>Введите имеющуюся прибыль</h2>
            <input
              type="number"
              name="profit"
              value={form.profit}
              onChange={handleChange}
              required
            />
            <button type="submit" className="wkBtn SubmitBtn">Сохранить</button>
          </form>
          <button className="wkBtn" onClick={props.cb}>Закрыть</button>
        </div>
      </div>
    )}
  </div>
}