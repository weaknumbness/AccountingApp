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
        {categories.length !== 0 ?
          categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))
        : <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 0.7 } }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            Категории не найдены...
          </motion.h2>
        }
      </AnimatePresence>
    </motion.div>
  );
}
