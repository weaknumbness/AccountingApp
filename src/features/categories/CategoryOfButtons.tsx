import type { Category } from "../../types";
import CategoryButton from "./CategoryButton";

type CategoriesProps = {
  categories: Category[];
  getCountsOfProducts: (categoryName: string) => number;
  activeCategory: string;
  setActiveCategory: React.Dispatch<React.SetStateAction<string>>;
};

export default function CategoryOfButtons({
  categories,
  getCountsOfProducts,
  activeCategory,
  setActiveCategory,
}: CategoriesProps) {
  return (
    <div className="category-buttons">
      <CategoryButton
        title="Все"
        activeCategory={activeCategory}
        getCountsOfProducts={getCountsOfProducts}
        setActiveCategory={setActiveCategory}
      />
      {categories.map((button) => (
        <CategoryButton
          title={button.title}
          activeCategory={activeCategory}
          getCountsOfProducts={getCountsOfProducts}
          setActiveCategory={setActiveCategory}
        />
      ))}
    </div>
  );
}
