import { motion } from "motion/react";
type AppCategoryHeaderProps = {
  title: string;
  onOpenModal:() => void;
};

export function AppCategoryHeader({ title, onOpenModal }: AppCategoryHeaderProps) {
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
          onClick={onOpenModal}
        >
          <div className="plus">+</div>
          <div className="add">Добавить категорию</div>
        </motion.button>
      </div>
    </header>
  );
}
