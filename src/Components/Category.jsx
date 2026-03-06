import { useState } from "react";
import AddCard from "./AddCard";
import Cards from "./Cards";
import DeleteIcon from "./DeleteIcon";

export default function Category(props) {

  const {
    cards,
    categoryName,
    deleteCb,
    addFormOpenCb,
    isOpen,
    cb,
    handleSubmit,
    sellCb,
    setEditingCard,
    deleteCategory
  } = props;

  const [modalWindowOpen, setModalWindowOpen] = useState(false);
  // const [sureDeleteCategory, setSureDeleteCard] = useState(false);


  const cardsWithCategory = cards.filter(
    e => e.category === categoryName
  );


  let total = 0;

  cardsWithCategory.forEach(e => {
    total += e.profit;
  })

  return <div className="Category">
    {modalWindowOpen && (
      <div className="modal-overlay deleteCategory" onClick={() => setModalWindowOpen(false)}>
        <div className={`modal-window ${modalWindowOpen ? "active" : ""}`}>
          <h1>Вы действительно хотите удалить категорию?</h1>
          <div className="buttons">
            <button onClick={() => deleteCategory(categoryName)} className="wkBtn deleteBtn">Удалить</button>
            <button onClick={() => setModalWindowOpen(false)} className="wkBtn cancelBtn">Отмена</button>
          </div>
        </div>
      </div>
    )}
    <div className="categoryTitle">
      <div className="divider"></div>
      <h2>
        {categoryName}
        <button onClick={() => setModalWindowOpen(true)} className="deleteBtn"><DeleteIcon size={"20"}/></button>
      </h2>
      <div className="divider"></div>
    </div>
    <div className="cardsOfCategory">
      <Cards
        cards={cardsWithCategory}
        deleteCb={deleteCb}
        addFormOpenCb={addFormOpenCb}
        sellCb={sellCb}
        setEditingCard={setEditingCard}
      />
      <h1 className="total">Вся выручка по категории: {total}</h1>
    </div>
    <AddCard
      isOpen={isOpen}
      cb={cb}
      handleSubmit={handleSubmit}
      category={categoryName}
    />
  </div>
}
