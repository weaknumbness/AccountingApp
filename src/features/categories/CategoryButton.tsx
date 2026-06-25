type ButtonProps = {
  title: string;
  isActive: boolean;
};

export default function CategoryButton({ title, isActive }: ButtonProps) {
  // Придумать как реализовать активную кнопку
  return (
    <button className={isActive ? "category-button active" : "category-button"}>
      {title}
    </button>
  );
}
