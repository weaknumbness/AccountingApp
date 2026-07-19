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
  categories: Category[];
  handleEditCard: (product: Product) => void;
  handleOpenEditForm: (prod: Product) => void;
};

export type ProductFormData = {
  title: string;
  prices: number[];
  imageUrl: string;
  stock: number;
  category: string;
};

export type ProductFormForInputs = {
  title: string;
  firstPrice: string;
  secondPrice: string;
  imageUrl: string;
  stock: string;
  category: string;
};

export type Category = {
  id: string;
  title: string;
  color: string;
  icon: string;
  imageUrl?: string;
};

export type CategoryFormData = {
  title: string;
  color: string;
  icon: string;
  imageUrl?: string;
};

export type CategoryWithStats = Category & {
  count: number;
  stock: number;
  profit: number;
};
