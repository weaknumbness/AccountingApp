import type { ProductCard } from "../types";

export const subscribeToProducts = (
  callback: (products: ProductCard[]) => void,
) => {
  callback([]);
};
