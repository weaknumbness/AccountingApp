import { useState } from "react";
import CategoryButton from "./CategoryButton";

export default function CategoryOfButtons() {
  const [buttons, setButtons] = useState<string[]>([
    "Кофе",
    "Чай",
    "Десерты",
    "Напитки",
    "Снеки",
  ]);

  return (
    <div className="category-buttons">
      <CategoryButton title="Все" isActive={true}/>
      {buttons.map((button) => (
        <CategoryButton title={button} isActive={false} />
      ))}
    </div>
  );
}
