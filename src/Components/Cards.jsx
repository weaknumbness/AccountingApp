import Card from "./Card";

export default function Cards({
  cards,
  deleteCb,
  addFormOpenCb,
  sellCb,
  setEditingCard
}) {

  return <div className="Cards">
    {cards.map(card => (
      <Card
        key={card.key}
        name={card.name}
        price={card.price}
        stock={card.stock}
        profit={card.profit}
        id={card.key}
        deleteCb={deleteCb}
        sellCb={sellCb}
        setEditingCard={()=>setEditingCard(card)}
      />
    ))}
    <div className="Card CardAddCard" onClick={addFormOpenCb}>
      <button className="wkBtn AddCardBtn">+</button>
    </div>

  </div>
}