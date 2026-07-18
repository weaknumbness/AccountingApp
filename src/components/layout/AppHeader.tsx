import { motion } from "motion/react";
type AppHeaderProps = {
  onOpenModal: () => void;
  title: string;
};

export function AppHeader({ onOpenModal, title }: AppHeaderProps) {
  return (
    <header>
      <h2>{title}</h2>
      <div>
        <motion.button
          type="button"
          className="add-button"
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.22 }}
          whileHover={{ y: -4 }}
          onClick={onOpenModal}
        >
          <div className="plus">+</div>
          <div className="add">Добавить товар</div>
        </motion.button>
      </div>
    </header>
  );
}
