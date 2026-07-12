import type { CategoryWithStats } from "../../types";
import { motion, AnimatePresence, stagger } from "motion/react";
import CategoryCard from "./CategoryCard";

type CategoriesProps = {
  categories: CategoryWithStats[];
};

const cardsVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: stagger(0.2),
    },
  },
};

export default function Categories({ categories }: CategoriesProps) {
  return (
    <motion.div
      className="categories"
      initial="hidden"
      animate="visible"
      variants={cardsVariants}
    >
      <AnimatePresence>
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
