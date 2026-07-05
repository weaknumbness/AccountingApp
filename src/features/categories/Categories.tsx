import type { Category } from "../../types";
import CategoryCard from "./Category";

type CategoriesProps = {
  categories: Category[];
};

export default function Categories({ categories }: CategoriesProps) {
  
  return (
    <div className="categories">
      {categories.map((category) => (
        <CategoryCard key={crypto.randomUUID()} category={category} />
      ))}
    </div>
  );
}
