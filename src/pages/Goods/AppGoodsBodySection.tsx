import { useMemo, useState } from "react";
import CategoryOfButtons from "../../features/categories/CategoryOfButtons";
import Cards from "../../features/products/Cards";
import type { Category, Product } from "../../types";

type AppGoodsBodySectionProps = {
  mockCards: Product[];
  handleDelete: (productId: string) => void;
  handleSale: (productId: string) => void;
  handleChange: (productId: string) => void;
  categories: Category[];
  getCategoryCount: (categoryName: string) => number;
};

export default function AppGoodsBodySection({
  mockCards,
  handleDelete,
  handleSale,
  handleChange,
  categories,
}: AppGoodsBodySectionProps) {
  const getCategoryCount = (categoryName: string) => {
    if (categoryName === "Все") {
      return mockCards.length;
    }
    return mockCards.filter((product) => product.category === categoryName)
      .length;
  };

  const [activeCategory, setActiveCategory] = useState("Все");

  const [searchValue, setSearchValue] = useState("");

  const filteredProduct =
    activeCategory === "Все" ? mockCards : (
      mockCards.filter((product) => product.category === activeCategory)
    );

  const searchedProducts = useMemo(() => {
    const normalizedSearch = searchValue.toLowerCase().trim();

    if (!normalizedSearch) {
      return filteredProduct;
    }

    return filteredProduct.filter((product) =>
      product.title.toLowerCase().includes(normalizedSearch),
    );
  }, [filteredProduct, searchValue]);

  return (
    <div className="body-section">
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
        <input
          type="text"
          placeholder="Поиск товаров..."
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </label>
      <div className="category-buttons">
        <CategoryOfButtons
          categories={categories}
          getCountsOfProducts={getCategoryCount}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
        />
      </div>
      <div className="cards-section">
        <Cards
          cards={searchedProducts}
          onChange={handleChange}
          onSale={handleSale}
          onDelete={handleDelete}
          categories={categories}
        />
      </div>
    </div>
  );
}
