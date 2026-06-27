import { motion } from "framer-motion";
import type { CardData } from "../../types";
import Card from "./Card";

type CardsProps = {
  cards: CardData[];
  onDelete: () => void;
  onChange: () => void;
  onSale: () => void;
};

export default function Cards({
  cards,
  onDelete,
  onChange,
  onSale,
}: CardsProps) {
  return (
    <motion.div className="cards">
      {cards.map((card) => (
        <Card
          id={card.id}
          price={card.price}
          img={card.img}
          title={card.title}
          stock={card.stock}
          profit={card.profit}
          onDelete={onDelete}
          onChange={onChange}
          onSale={onSale}
          category={card.category}
        />
      ))}
    </motion.div>
  );
}
