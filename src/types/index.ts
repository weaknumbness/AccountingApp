export type Product = {
  name: string;
  priceOne: number;
  priceTwo: number;
  stock: number;
  profit: number;
  categoryId:number;
  sold: number;
};

export type Category = {
  name: string;
  id:number;
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