
export type ProductCard = {
  id: string;
  name: string;
  prices: number[];
  stock: number;
  profit: number;
  category: string;
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

export type Product = {
  id: string;
  prices: number[];
  imageUrl: string;
  title: string;
  stock: number;
  profit: number;
  category: string;
};

export type ProductCardProps = {
  product: Product;
  onDelete: (productId: string) => void;
  onChange: (productId: string) => void;
  onSale: (productId: string, price: number) => void;
};
