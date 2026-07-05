import AppSideBar from "../../components/layout/AppSideBar";
import type { Category } from "../../types";
import AppCategoriesSection from "./AppCategoriesSection";

type PageOfCategoriesProps = {
  categories: Category[];
  setActivePage: (pageTitle: string) => void;
};

export default function PageOfCategories({
  categories,
  setActivePage
}: PageOfCategoriesProps) {
  return (
    <div className="Page-of-categories">
      <AppSideBar setActivePage={setActivePage} />
      <AppCategoriesSection categories={categories} />
    </div>
  );
}
