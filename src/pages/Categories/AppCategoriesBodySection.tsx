import Categories from "../../features/categories/Categories";
import CategoryStats from "../../features/categories/CategoryStats";
import type { Category } from "../../types";

type AppCategoriesBodySectionProps = {
  categories: Category[];
};
export default function AppCategoriesBodySection({
  categories,
}: AppCategoriesBodySectionProps) {
  const countOfCategories = categories.length;
  let generalStock = 0;
  let generalProfit = 0;
  for (let i = 0; i < countOfCategories; i++) {
    generalStock += categories[i].stock;
    generalProfit += categories[i].profit;
  }
  const averageProfitByCategory = Math.ceil(generalProfit / countOfCategories);

  return (
    <div className="App-categories-body-section">
      <div className="categories-body-section">
        <CategoryStats
          countOfCategories={countOfCategories}
          generalStock={generalStock}
          generalProfit={generalProfit}
          averageProfit={averageProfitByCategory}
        />
        <Categories categories={categories} />
      </div>
    </div>
  );
}
