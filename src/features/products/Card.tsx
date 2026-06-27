import { motion } from "motion/react";
import type { CardProps } from "../../types";

export default function Card({
  id,
  price,
  img,
  title,
  stock,
  profit,
  onDelete,
  onChange,
  onSale,
  category,
}: CardProps) {
  return (
    <motion.div className="card">
      <div className="card-header">
        <div className="card-image">
          <img src={img} alt="" />
        </div>
        <div className="card-titleAndCategory">
          <div className="card-title">{title}</div>
          <div className="card-category">{category}</div>
        </div>
        <div className="card-dropdown">
          <button className="card-dropdown-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-three-dots-vertical"
              viewBox="0 0 16 16"
            >
              <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />
            </svg>
          </button>
        </div>
      </div>
      <div className="card-data">
        <div className="card-price">
          {price.length === 2 ?
            <>
              <p>Цены:</p>
              <div className="prices">
                <div>{price[0]}Р, </div> <div>{price[1]}Р</div>
              </div>
            </>
          : <>
              <p>Цены:</p> <div>{price[0]} Р</div>
            </>
          }
        </div>
        <div className="card-stock">
          <p>Остаток:</p> <span>{stock}шт.</span>
        </div>
        <div className="card-profit">
          <p>Прибыль:</p> <span>{profit}Р.</span>
        </div>
      </div>
      <div className="card-buttons">
        {price.length === 2 ?
          <>
            <button className="card-button">{price[0]}Р</button>
            <button className="card-button">{price[0]}Р</button>
          </>
        : <>
            <button className="card-button">{price[0]}Р</button>
          </>
        }
      </div>
    </motion.div>
  );
}
