import { useState } from "react";
import AppBodySection from "./AppBodySection";
import { AnimatePresence } from "motion/react";
import { AppHeader } from "./AppHeader";
import productPicture from "../assets/LaysCrab.jpg";
import type { Product, ProductFormData } from "../../types";
import AddCardForm from "../../features/products/AddCardForm";

export default function AppMainSection() {
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

  const categories = ["Чипсы", "Напитки", "Шоколад"];

  const handleDelete = (productId: string) => {
    setMockCards((prev) => prev.filter((product) => product.id !== productId));
  };

  const [isAddFormOpen, setIsAddFormOpen] = useState<Boolean>(false);

  const handleSale = (productId: string) => {};
  const handleChange = (productId: string) => {};

  const handleOpenModal = () => {
    setIsAddFormOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddFormOpen(false);
  };

  const handleCreateProduct = (formData: ProductFormData) => {
    const newProduct: Product = {
      id: crypto.randomUUID(),
      ...formData,
      profit: 0,
    };

    setMockCards((prevProducts) => [...prevProducts, newProduct]);
    setIsAddFormOpen(false);
  };

  return (
    <div className="main-section">
      <AppHeader onOpenModal={handleOpenModal} />
      <AppBodySection
        mockCards={mockCards}
        handleDelete={handleDelete}
        handleChange={handleChange}
        handleSale={handleSale}
        categories={categories}
      />
      <AnimatePresence>
        {isAddFormOpen && (
          <AddCardForm
            onClose={handleCloseModal}
            onSubmit={handleCreateProduct}
            categories={categories}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
