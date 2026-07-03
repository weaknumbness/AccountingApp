import { motion } from "motion/react";
type AppHeaderProps = {
  onOpenModal: () => void;
};

export function AppHeader({ onOpenModal }: AppHeaderProps) {
  return (
    <header>
      {/* <h2>{title}</h2> */}
      {/* Какого-то хуя заголовок в сайд баре на другой высоте */}
      <h2>Товары</h2>
      <div>
        <motion.button
          type="button"
          className="add-button"
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.22 }}
          onClick={onOpenModal}
        >
          <div className="plus">+</div>
          <div className="add">Добавить товар</div>
        </motion.button>
      </div>
    </header>
  );
}
