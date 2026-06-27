export type CategoryName = string;

export type ProductCard = {
  id: string;
  name: string;
  prices: number[];
  stock: number;
  profit: number;
  category: CategoryName;
};

export type User = {
  uid: string;
  email: string | null;
};

export type ProductFormState = {
  name: string;
  categoryId: string;
  price: number;
  stock: number;
};

export type AppHeaderProps = {
  title: string;
};

export type CardProps = {
  id: string;
  price: number[];
  img: string;
  title: string;
  stock: number;
  profit: number;
  category: string;
  onDelete: () => void;
  onChange: () => void;
  onSale: () => void;
};

export type CardData = Omit<CardProps, "onDelete" | "onChange" | "onSale">;
