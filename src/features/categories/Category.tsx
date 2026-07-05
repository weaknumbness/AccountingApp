import { motion } from "motion/react";
import type { Category } from "../../types";

type CategoryCardProps = {
  category: Category
}

export default function CategoryCard({category}: CategoryCardProps) {
  return <motion.div className="category">
    <h3>{category.title}</h3>
  </motion.div>

}