import { useState } from "react";
import AppCategoriesBodySection from "./AppCategoriesBodySection";
import type {
  CategoryFormData,
  CategoryWithStats,
} from "../../types";
import { AppCategoryHeader } from "../../components/layout/AppCategoryHeader";
import { AnimatePresence } from "motion/react";
import AddCategoryForm from "../../features/categories/AddCategoryForm";

type AppCategoriesSectionProps = {
  categories: CategoryWithStats[];
  onCreateCategory: ({ title, color, icon }: CategoryFormData) => void;
};

export default function AppCategoriesSection({
  categories,
  onCreateCategory,
}: AppCategoriesSectionProps) {
  const [isAddCategoryFormOpen, setIsAddCategoryFormOpen] = useState(false);

  const handleOpenCategoryModal = () => {
    setIsAddCategoryFormOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddCategoryFormOpen(false);
  };

  return (
    <div className="categories-section">
      <AppCategoryHeader
        title="Категории"
        onOpenModal={handleOpenCategoryModal}
      />
      <AppCategoriesBodySection categories={categories} />
      <AnimatePresence>
        {isAddCategoryFormOpen && (
          <AddCategoryForm
            onClose={handleCloseModal}
            onSubmit={onCreateCategory}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
