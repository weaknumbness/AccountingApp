import { useState, useEffect } from "react";

export default function EditCard({ card, isOpen, cb, handleSubmit }) {

  const [form, setForm] = useState({
    name: "",
    priceOne: "",
    priceTwo: "",
    stock: "",
    profit: ""
  });

  const [value, setValue] = useState("");

  useEffect(() => {
    if (card) {
      setForm({
        name: card.name,
        priceOne: card.price[0].replace("Р", ""),
        priceTwo: card.price[1] ? card.price[1].replace("Р", "") : "",
        stock: card.stock,
        profit: card.profit
      });

      setValue(card.price.length === 2 ? "2" : "1");
    }
  }, [card]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    const price =
      value === "1"
        ? [form.priceOne + "Р"]
        : [form.priceOne + "Р", form.priceTwo + "Р"];

    handleSubmit(
      card.key,
      form.name,
      price,
      Number(form.stock),
      Number(form.profit)
    );

    cb();
  };

  if (!isOpen || !card) return null;

  return (
    <div className="modal-overlay Edit" onClick={cb}>
      <div className="modal-window active" onClick={(e) => e.stopPropagation()}>

        <h1>Редактирование карточки</h1>

        <form onSubmit={handleSubmitForm} className="addCardForm">
          <h2>Имя карточки</h2>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <h2>Цена №1</h2>
          <input
            type="number"
            name="priceOne"
            value={form.priceOne}
            onChange={handleChange}
          />


          {value === "2" && (
            <>
              <h2>Цена №2</h2>
              <input
                type="number"
                name="priceTwo"
                value={form.priceTwo}
                onChange={handleChange}
              />
            </>
          )}

          <h2>Остаток</h2>
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
          />

          <h2>Выручка</h2>
          <input
            type="number"
            name="profit"
            value={form.profit}
            onChange={handleChange}
          />

          <button type="submit" className="SubmitBtn wkBtn">Сохранить</button>
        </form>
        <button className="wkBtn SubmitBtn hideBtn" onClick={cb}>Закрыть</button>

      </div>
    </div>
  );
}