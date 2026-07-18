import AppGoodsSection from "./AppGoodsSection";
import AppSideBar from "../../components/layout/AppSideBar";
import type { Category, Product } from "../../types";

type PageOfGoodsProps = {
  mockCards: Product[];
  setMockCards: React.Dispatch<React.SetStateAction<Product[]>>;
  getCategoryCount: (categoryName: string) => number;
  setActivePage: (pageTitle: string) => void;
  categories: Category[];
};

export default function PageOfGoods({
  mockCards,
  setMockCards,
  getCategoryCount,
  setActivePage,
  categories
}: PageOfGoodsProps) {
  return (
    <div className="PageOfGoods">
      <AppSideBar setActivePage={setActivePage}/>
      <AppGoodsSection
        mockCards={mockCards}
        setMockCards={setMockCards}
        getCategoryCount={getCategoryCount}
        categories={categories}
      />
    </div>
  );
}
