import { style } from "framer-motion/client";
import { motion } from "motion/react";
type ButtonProps = {
  title: string;
  activeCategory: string;
  getCountsOfProducts: (categoryName: string) => number;
  setActiveCategory: React.Dispatch<React.SetStateAction<string>>;
};

export default function CategoryButton({
  title,
  activeCategory,
  getCountsOfProducts,
  setActiveCategory,
}: ButtonProps) {
  return (
    <motion.button
      className={
        activeCategory === title ? "category-button active" : "category-button"
      }
      onClick={() => setActiveCategory(title)}
      whileTap={{ scale: 0.95 }}
      whileHover={{
        y: -4,
      }}
      animate={{ transition: { duration: 0.2 } }}
    >
      {title} {getCountsOfProducts(title)}
    </motion.button>
  );
}
