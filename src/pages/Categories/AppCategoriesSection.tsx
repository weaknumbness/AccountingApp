import { useState } from "react";
import AppCategoriesBodySection from "./AppCategoriesBodySection";
import type { Category } from "../../types";
import { AppCategoryHeader } from "../../components/layout/AppCategoryHeader";

type AppCategoriesSectionProps = {
  categories: Category[];
};

export default function AppCategoriesSection({
  categories,
}: AppCategoriesSectionProps) {
  const [isAddCategoryFormOpen, setIsAddCategoryFormOpen] = useState(false);

  const handleOpenCategoryModal = () => {
    setIsAddCategoryFormOpen(true);
  };

  return (
    <div className="categories-section">
      <AppCategoryHeader title="Категории" />
      <AppCategoriesBodySection categories={categories} />
    </div>
  );
}
