import Categories from "../../features/categories/Categories";
import CategoryStats from "../../features/categories/CategoryStats";
import type { CategoryWithStats } from "../../types";

type AppCategoriesBodySectionProps = {
  categories: CategoryWithStats[];
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
      <div className="body-section">
        <CategoryStats
          countOfCategories={countOfCategories}
          generalStock={generalStock}
          generalProfit={generalProfit}
          averageProfit={averageProfitByCategory}
        />

        <div className="tools">
          <label id="search-input">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-search"
              viewBox="0 0 16 16"
            >
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
            </svg>
            <input type="text" placeholder="Поиск категорий..." />
          </label>

          <label id="sort">
            Сортировка:
            <select name="sort">
              <option>По прибыли</option>
              <option>По остатку</option>
              <option>По товарам</option>
            </select>
          </label>
        </div>
        <Categories categories={categories} />
      </div>
    </div>
  );
}
