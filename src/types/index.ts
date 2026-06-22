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