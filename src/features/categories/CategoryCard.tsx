import { motion } from "motion/react";
import type { CategoryWithStats } from "../../types";

type CategoryCardProps = {
  category: CategoryWithStats;
};

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

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <motion.div
      className="category"
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
      <div className="category-top-info">
        <div className="category-pic" style={{ background: category.color }}>
          {category.imageUrl ? category.imageUrl : category.icon}
        </div>
        <div className="category-title">
          <div className="category-first-info">
            <h3>{category.title}</h3>
            <p>{category.count} товаров</p>
          </div>
          <div>
            <div className="card-dropdown">
              <button
                className="card-dropdown-button"
                // onClick={handleToggleDropdown}
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
              {/* {isDropdownOpen && (
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
              )} */}
            </div>
          </div>
        </div>
      </div>
      <div className="category-down-info">
        <div className="stock">
          <div className="category-down-title">Остаток</div>
          <div className="stock-stock">{category.stock} шт.</div>
        </div>
        <div className="profit">
          <div className="category-down-title">Прибыль</div>
          <div className="profit-profit">{category.profit} Р</div>
        </div>
      </div>
    </motion.div>
  );
}
