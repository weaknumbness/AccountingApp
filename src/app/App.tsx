// import { useEffect, useState } from "react";
// import { onAuthStateChanged, signOut, type User } from "firebase/auth";
// import { auth } from "../services/firebase/firebase";
// import { AuthPage } from "../features/auth/AuthPage";
// import { AppHeader } from "../components/layout/AppHeader";
import "../styles/reset.css";
import "../styles/newStyle.css";
import productPicture from "../components/assets/LaysCrab.jpg";
import PageOfGoods from "../pages/Goods/PageOfGoods";
import type { Product } from "../types";
import { useMemo, useState } from "react";
import PageOfCategories from "../pages/Categories/PageOfCategories";

function App() {
  const [activePage, setActivePage] = useState("Goods");

  const [mockCards, setMockCards] = useState<Product[]>([
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

  const categoryStats = useMemo(() => {
    return mockCards.reduce<
      Record<
        string,
        { title: string; stock: number; profit: number; count: number }
      >
    >((acc, product) => {
      if (!acc[product.category]) {
        acc[product.category] = {
          title: product.category,
          stock: 0,
          profit: 0,
          count: 0,
        };
      }

      acc[product.category].stock += product.stock;
      acc[product.category].profit += product.profit;
      acc[product.category].count += 1;

      return acc;
    }, {});
  }, [mockCards]);

  const categories = Object.values(categoryStats);

  const handleSetActivePage = (pageTitle: string) => {
    setActivePage(pageTitle);
  };
  return (
    <div className="main">
      {activePage === "Goods" && (
        <PageOfGoods
          setActivePage={handleSetActivePage}
          mockCards={mockCards}
          setMockCards={setMockCards}
          getCategoryCount={handleGetCategoryStock}
        />
      )}
      {activePage === "Categories" && (
        <PageOfCategories
          categories={categories}
          setActivePage={handleSetActivePage}
        />
      )}
    </div>
  );
}

export default App;
