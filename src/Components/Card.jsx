import { useState } from "react";
import ButtonOfSale from "./ButtonOfSale";
import CorrectFunc from "./CorrectFucn"
import DeleteIcon from "./DeleteIcon";

export default function Card(props) {
  const { deleteCb } = props;

  const [deleted, setDeleted] = useState(false);

  const approvedDeleteCb = (id) => {
    setDeleted(prev => !prev)
    setTimeout(() => deleteCb(id), 500)
  }
  return <div className={deleted ? "Card deleted" : "Card"}>
    <div className="CardInfo">
      <div className="FirstSection">
        <h2>{props.name}</h2>
        {props.price.length === 2 ? <p>{props.price[0]}/{props.price[1]}</p> : <p>{props.price}</p>}
      </div>
      <div className="SecondSection">
        <span className="CategoryOfTitle">Остаток</span>
        <span className="info">{props.stock}</span>
      </div>
      <div className="ThirdSection">
        <span className="CategoryOfTitle">Выручка</span>
        <span className="info">{props.profit}</span>
      </div>
    </div>
    <div className="Buttons">
      <div className="FirsSectionOfButtons">
        <button className="wkBtn EditButton" onClick={() => props.setEditingCard()}><CorrectFunc />Edit</button>
        <button className="wkBtn DeleteButton" onClick={() => approvedDeleteCb(props.id)}><DeleteIcon />Delete</button>
      </div>
      <div className="SecondSectionOfButtons">
        {props.price.map((price, index) => (
          <ButtonOfSale key={index} price={price} btnClass={'wkBtn ButtonOfSale'} productKey={props.id} sellCb={props.sellCb} />
        ))}
      </div>
    </div>
  </div>
}