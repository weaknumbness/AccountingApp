type ButtonProps = {
  title: string;
  isActive: boolean;
  getCountsOfProducts: (categoryName: string) => number;
};

export default function CategoryButton({ title, isActive, getCountsOfProducts}: ButtonProps) {
  // Придумать как реализовать активную кнопку
  return (
    <button className={isActive ? "category-button active" : "category-button"}>
      {title} {getCountsOfProducts(title)}
    </button>
  );
}
