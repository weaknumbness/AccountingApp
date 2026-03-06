import { useState, useEffect } from "react"

export default function AddCategory(props) {

  const [animate, setAnimate] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const handleChange = (e) => {
    const { value } = e.target;
    setNewCategory(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    props.handleSubmit(newCategory);
    setNewCategory("");
    props.hideCb();
  }

  //Плавная анимация открытия модального окна
  useEffect(() => {
    if (props.isOpen) {
      setTimeout(() => setAnimate(true), 10);
    } else {
      setAnimate(false);
    }
  }, [props.isOpen]);

  return <div className="AddCategory">
    {props.isOpen && (
      <div className="modal-overlay" onClick={props.hideCb}>
        <div
          className={`modal-window ${animate ? "active" : ""}  addCategory`}
          onClick={(e) => e.stopPropagation()}
        >
          <h1>Форма создания новой категории</h1>
          <form onSubmit={handleSubmit}>
            <label>
              <input
                type="text"
                name="category"
                value={newCategory}
                onChange={handleChange}
                required
              />
            </label>
            <div className="buttons">
              <button type="submit" className="wkBtn SubmitBtn">Сохранить категорию</button>
              <button className="wkBtn SubmitBtn hideBtn" onClick={props.hideCb}>Закрыть</button>
            </div>
          </form>
        </div>
      </div>
    )}
  </div>
}