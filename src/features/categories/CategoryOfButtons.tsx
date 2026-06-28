import CategoryButton from "./CategoryButton";

type CategoriesProps = {
  categories: string[];
  getCountsOfProducts: (categoryName: string) => number;
};

export default function CategoryOfButtons({
  categories,
  getCountsOfProducts,
}: CategoriesProps) {
  return (
    <div className="category-buttons">
      <CategoryButton
        title="Все"
        isActive={true}
        getCountsOfProducts={getCountsOfProducts}
      />
      {categories.map((button) => (
        <CategoryButton
          title={button}
          isActive={false}
          getCountsOfProducts={getCountsOfProducts}
        />
      ))}
    </div>
  );
}
