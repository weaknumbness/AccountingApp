import AppSideBar from "../../components/layout/AppSideBar";
import type { CategoryFormData, CategoryWithStats } from "../../types";
import AppCategoriesSection from "./AppCategoriesSection";

type PageOfCategoriesProps = {
  categories: CategoryWithStats[];
  setActivePage: (pageTitle: string) => void;
  onCreateCategory: ({ title, color, icon }: CategoryFormData) => void;
};

export default function PageOfCategories({
  categories,
  setActivePage,
  onCreateCategory,
}: PageOfCategoriesProps) {
  return (
    <div className="Page-of-categories">
      <AppSideBar setActivePage={setActivePage} />
      <AppCategoriesSection
        categories={categories}
        onCreateCategory={onCreateCategory}
      />
    </div>
  );
}
