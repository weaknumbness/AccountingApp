import { useState } from "react";
import AppGoodsBodySection from "./AppGoodsBodySection";
import { AnimatePresence } from "motion/react";
import { AppHeader } from "../../components/layout/AppHeader";
import type { Category, Product, ProductFormData } from "../../types";
import AddCardForm from "../../features/products/AddCardForm";
import EditCardForm from "../../features/products/EditCardForm";

type AppGoodsSectionProps = {
  mockCards: Product[];
  setMockCards: React.Dispatch<React.SetStateAction<Product[]>>;
  getCategoryCount: (categoryName: string) => number;
  categories: Category[];
  handleEditCard: (product: Product) => void;
};

export default function AppGoodsSection({
  mockCards,
  setMockCards,
  getCategoryCount,
  categories,
  handleEditCard,
}: AppGoodsSectionProps) {
  const handleDelete = (productId: string) => {
    setMockCards((prev) => prev.filter((product) => product.id !== productId));
  };

  const [isAddCardFormOpen, setIsAddCardFormOpen] = useState<Boolean>(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product>();
  const handleCloseEditForm = () => {
    setIsEditFormOpen(false);
  };

  const handleOpenEditForm = (prod: Product) => {
    setEditingProduct(prod);
    setIsEditFormOpen(true);
  };

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
        handleEditCard={handleEditCard}
        handleOpenEditForm={handleOpenEditForm}
      />
      <AnimatePresence>
        {isAddCardFormOpen && (
          <AddCardForm
            onClose={handleCloseModal}
            onSubmit={handleCreateProduct}
            categories={categories}
          />
        )}
        {isEditFormOpen && editingProduct && (
          <EditCardForm
            onSubmit={handleEditCard}
            onClose={handleCloseEditForm}
            categories={categories}
            product={editingProduct}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
