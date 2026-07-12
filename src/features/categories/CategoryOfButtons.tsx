import type { Category } from "../../types";
import CategoryButton from "./CategoryButton";

type CategoriesProps = {
  categories: Category[];
  getCountsOfProducts: (categoryName: string) => number;
};

export default function CategoryOfButtons({
  categories,
  getCountsOfProducts,
}: CategoriesProps) {
  return (
    <div className="category-buttons">
      <CategoryButton
        title="Все"
        isActive={true}
        getCountsOfProducts={getCountsOfProducts}
      />
      {categories.map((button) => (
        <CategoryButton
          title={button.title}
          isActive={false}
          getCountsOfProducts={getCountsOfProducts}
        />
      ))}
    </div>
  );
}
