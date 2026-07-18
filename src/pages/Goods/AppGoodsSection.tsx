import { useState } from "react";
import AppGoodsBodySection from "./AppGoodsBodySection";
import { AnimatePresence } from "motion/react";
import { AppHeader } from "../../components/layout/AppHeader";
import type { Category, Product, ProductFormData } from "../../types";
import AddCardForm from "../../features/products/AddCardForm";

type AppGoodsSectionProps = {
  mockCards: Product[];
  setMockCards: React.Dispatch<React.SetStateAction<Product[]>>;
  getCategoryCount: (categoryName: string) => number;
  categories: Category[];
};

export default function AppGoodsSection({
  mockCards,
  setMockCards,
  getCategoryCount,
  categories,
}: AppGoodsSectionProps) {
  const handleDelete = (productId: string) => {
    setMockCards((prev) => prev.filter((product) => product.id !== productId));
  };

  const [isAddCardFormOpen, setIsAddCardFormOpen] = useState<Boolean>(false);

  const handleSale = (productId: string) => {};
  const handleChange = (productId: string) => {};

  const handleOpenModal = () => {
    setIsAddCardFormOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddCardFormOpen(false);
  };

  const handleCreateProduct = (formData: ProductFormData) => {
    const newProduct: Product = {
      id: crypto.randomUUID(),
      ...formData,
      profit: 0,
    };

    setMockCards((prevProducts) => [...prevProducts, newProduct]);
    setIsAddCardFormOpen(false);
  };

  return (
    <div className="main-section">
      <AppHeader onOpenModal={handleOpenModal} title="Товары" />
      <AppGoodsBodySection
        mockCards={mockCards}
        handleDelete={handleDelete}
        handleChange={handleChange}
        handleSale={handleSale}
        categories={categories}
        getCategoryCount={getCategoryCount}
      />
      <AnimatePresence>
        {isAddCardFormOpen && (
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
