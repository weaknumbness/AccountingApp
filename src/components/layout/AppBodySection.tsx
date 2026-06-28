import { useState } from "react";
import CategoryOfButtons from "../../features/categories/CategoryOfButtons";
import Cards from "../../features/products/Cards";
import type { Product } from "../../types";
import productPicture from "../assets/LaysCrab.jpg";

const handleSale = (productId: string) => {};
const handleChange = (productId: string) => {};

export default function AppBodySection() {
  const categories = ["Чипсы", "Напитки", "Шоколад"];

  const getCategoryCount = (categoryName: string) => {
    if (categoryName === "Все") {
      return mockCards.length;
    }
    return mockCards.filter((product) => product.category === categoryName)
      .length;
  };

  const handleDelete = (productId: string) => {
    setMockCards((prev) => prev.filter((product) => product.id !== productId));
  };

  const [mockCards, setMockCards] = useState<Product[]>([
    {
      id: crypto.randomUUID(),
      prices: [165, 175],
      imageUrl: productPicture,
      title: "Лейс с крабом",
      stock: 19,
      profit: 0,
      category: "Чипсы",
    },
    {
      id: crypto.randomUUID(),
      prices: [165, 175],
      imageUrl: productPicture,
      title: "Лейс с крабом",
      stock: 19,
      profit: 0,
      category: "Чипсы",
    },
    {
      id: crypto.randomUUID(),
      prices: [165, 175],
      imageUrl: productPicture,
      title: "Лейс с крабом",
      stock: 19,
      profit: 0,
      category: "Чипсы",
    },
    {
      id: crypto.randomUUID(),
      prices: [165, 175],
      imageUrl: productPicture,
      title: "Лейс с крабом",
      stock: 19,
      profit: 0,
      category: "Чипсы",
    },
    {
      id: crypto.randomUUID(),
      prices: [165, 175],
      imageUrl: productPicture,
      title: "Лейс с крабом",
      stock: 19,
      profit: 0,
      category: "Чипсы",
    },
  ]);

  return (
    <div className="body-section">
      <label id="search-good">
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
        <input type="text" placeholder="Поиск товаров..." />
      </label>
      <div className="category-buttons">
        <CategoryOfButtons
          categories={categories}
          getCountsOfProducts={getCategoryCount}
        />
      </div>
      <div className="cards-section">
        <Cards
          cards={mockCards}
          onChange={handleChange}
          onSale={handleSale}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
