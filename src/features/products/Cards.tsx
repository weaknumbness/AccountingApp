import { motion, AnimatePresence, stagger } from "motion/react";
import type { Category, Product } from "../../types";
import Card from "./Card";
import type { animate } from "motion";

type CardsProps = {
  cards: Product[];
  onDelete: (productId: string) => void;
  onChange: (productId: string) => void;
  onSale: (productId: string, price: number) => void;
  categories: Category[];
};

const cardsVariants = {
  hidden: {},
  visible: {
    transition: {
      delayChildren: stagger(0.2),
    },
  },
};

export default function Cards({
  cards,
  onDelete,
  onChange,
  onSale,
  categories,
}: CardsProps) {
  return (
    <motion.div
      className="cards"
      initial="hidden"
      animate="visible"
      variants={cardsVariants}
    >
      <AnimatePresence mode="popLayout">
        {cards.length !== 0 ?
          cards.map((card) => (
            <Card
              key={card.id}
              product={card}
              onDelete={onDelete}
              onChange={onChange}
              onSale={onSale}
              categories={categories}
            />
          ))
        : <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 0.7 } }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            Товары не найдены...
          </motion.h2>
        }
      </AnimatePresence>
    </motion.div>
  );
}
