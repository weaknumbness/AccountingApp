import { motion, AnimatePresence, stagger } from "motion/react";
import type { Product } from "../../types";
import Card from "./Card";

type CardsProps = {
  cards: Product[];
  onDelete: (productId: string) => void;
  onChange: (productId: string) => void;
  onSale: (productId: string, price: number) => void;
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
}: CardsProps) {
  return (
    <motion.div
      className="cards"
      initial="hidden"
      animate="visible"
      variants={cardsVariants}
    >
      <AnimatePresence mode="popLayout">
        {cards.map((card) => (
          <Card
            key={card.id}
            product={card}
            onDelete={onDelete}
            onChange={onChange}
            onSale={onSale}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
