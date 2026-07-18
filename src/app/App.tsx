import "../styles/reset.css";
import "../styles/newStyle.css";
import productPicture from "../components/assets/LaysCrab.jpg";
import PageOfGoods from "../pages/Goods/PageOfGoods";
import type {
  Category,
  CategoryWithStats,
  Product,
  CategoryFormData,
} from "../types";
import { useMemo, useState } from "react";
import PageOfCategories from "../pages/Categories/PageOfCategories";

function App() {
  const [activePage, setActivePage] = useState("Goods");
  const [categories, setCategories] = useState<Category[]>(() => [
    {
      id: crypto.randomUUID(),
      title: "Чипсы",
      color: "#FEF3C7",
      icon: "🥔",
    },
    {
      id: crypto.randomUUID(),
      title: "Напитки",
      color: "#DBEAFE",
      icon: "🥤",
    },
  ]);
  const [mockCards, setMockCards] = useState<Product[]>(() => [
    {
      id: crypto.randomUUID(),
      prices: [165, 175],
      imageUrl: productPicture,
      title: "Лейс с крабом",
      stock: 19,
      profit: 150,
      category: "Чипсы",
    },
    {
      id: crypto.randomUUID(),
      prices: [165, 175],
      imageUrl: productPicture,
      title: "Лейс с крабом",
      stock: 19,
      profit: 250,
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

  const handleGetCategoryStock = (categoryName: string) => {
    if (categoryName === "Все") {
      return mockCards.length;
    }
    return mockCards.filter((product) => product.category === categoryName)
      .length;
  };

  const categoriesWithStats: CategoryWithStats[] = useMemo(() => {
    return categories.map((category) => {
      const categoryProducts = mockCards.filter(
        (product) => product.category === category.title,
      );

      return {
        ...category,
        count: categoryProducts.length,
        stock: categoryProducts.reduce(
          (sum, product) => sum + product.stock,
          0,
        ),
        profit: categoryProducts.reduce(
          (sum, product) => sum + product.profit,
          0,
        ),
      };
    });
  }, [categories, mockCards]);

  const handleSetActivePage = (pageTitle: string) => {
    setActivePage(pageTitle);
  };

  const handleAddCategory = ({ title, color, icon }: CategoryFormData) => {
    setCategories((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title, color, icon },
    ]);
  };

  return (
    <div className="main">
      {activePage === "Goods" && (
        <PageOfGoods
          setActivePage={handleSetActivePage}
          mockCards={mockCards}
          setMockCards={setMockCards}
          getCategoryCount={handleGetCategoryStock}
          categories={categories}
        />
      )}
      {activePage === "Categories" && (
        <PageOfCategories
          onCreateCategory={handleAddCategory}
          categories={categoriesWithStats}
          setActivePage={handleSetActivePage}
        />
      )}
    </div>
  );
}

export default App;
