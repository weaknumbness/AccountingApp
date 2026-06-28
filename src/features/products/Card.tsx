import { motion } from "motion/react";
import type { ProductCardProps } from "../../types";
import { useState } from "react";

const cardVariants = {
  hidden: {
    y: 20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function Card({
  product,
  onDelete,
  onChange,
  onSale,
}: ProductCardProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleDeleteClick = () => {
    onDelete(product.id);
    setIsDropdownOpen(false);
  };

  return (
    <motion.div
      className="card"
      layout
      variants={cardVariants}
      exit={{
        opacity: 0,
        scale: 0.9,
        y: -12,
        filter: "blur(4px)",
      }}
      transition={{
        duration: 0.22,
        ease: "easeOut",
      }}
      whileHover={{
        y: -4,
      }}
    >
      <div className="card-header">
        <div className="card-image">
          <img src={product.imageUrl} alt="" />
        </div>
        <div className="card-titleAndCategory">
          <div className="card-title">{product.title}</div>
          <div className="card-category">{product.category}</div>
        </div>
        <div className="card-dropdown">
          <button
            className="card-dropdown-button"
            onClick={handleToggleDropdown}
          >
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
          {isDropdownOpen && (
            <div className="card-dropdown-menu">
              <button type="button" className="card-dropdown-item">
                Редактировать
              </button>

              <button
                type="button"
                className="card-dropdown-item card-dropdown-item-danger"
                onClick={handleDeleteClick}
              >
                Удалить
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="card-data">
        <div className="card-price">
          {product.prices.length === 2 ?
            <>
              <p>Цены:</p>
              <div className="prices">
                <div>{product.prices[0]}Р, </div>{" "}
                <div>{product.prices[1]}Р</div>
              </div>
            </>
          : <>
              <p>Цены:</p> <div>{product.prices[0]} Р</div>
            </>
          }
        </div>
        <div className="card-stock">
          <p>Остаток:</p> <span>{product.stock}шт.</span>
        </div>
        <div className="card-profit">
          <p>Прибыль:</p> <span>{product.profit}Р.</span>
        </div>
      </div>
      <div className="card-buttons">
        {product.prices.length === 2 ?
          <>
            <button className="card-button">{product.prices[0]}Р</button>
            <button className="card-button">{product.prices[1]}Р</button>
          </>
        : <>
            <button className="card-button">{product.prices[0]}Р</button>
          </>
        }
      </div>
    </motion.div>
  );
}
