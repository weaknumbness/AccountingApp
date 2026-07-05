import { motion } from "motion/react";
type AppCategoryHeaderProps = {
  title: string;
};

export function AppCategoryHeader({ title }: AppCategoryHeaderProps) {
  return (
    <header>
      <h2>{title}</h2>
      {/* Какого-то хуя заголовок в сайд баре на другой высоте */}
      <div>
        <motion.button
          type="button"
          className="add-button"
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.22 }}
        >
          <div className="plus">+</div>
          <div className="add">Добавить категорию</div>
        </motion.button>
      </div>
    </header>
  );
}
