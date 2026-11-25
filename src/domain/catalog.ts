import { z } from "zod";
import type { AccountingState } from "./accounting";

export const storefrontSchema = z.object({
  enabled: z.boolean(),
  title: z.string().trim().min(1).max(80),
});
export const publicProductSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1).max(150),
  categoryId: z.string().min(1),
  categoryTitle: z.string().min(1).max(100),
  imageUrl: z.string(),
  price: z.number().int().nonnegative(),
  available: z.boolean(),
});
export const publicCatalogSchema = z.object({
  title: z.string().min(1).max(80),
  products: z.preprocess(v => v == null ? {} : v, z.record(z.string(), publicProductSchema)),
});
export type PublicProduct = z.infer<typeof publicProductSchema>;
export type PublicCatalog = z.infer<typeof publicCatalogSchema>;

// Explicit allowlist: never spread a private product into the public projection.
export function projectCatalog(state: AccountingState): PublicCatalog | null {
  if (!state.storefront.enabled) return null;
  const products: Record<string, PublicProduct> = {};
  for (const p of Object.values(state.products)) {
    if (p.archived) continue;
    const category = state.categories[p.categoryId];
    if (!category) continue;
    products[p.id] = {
      id: p.id, title: p.title, categoryId: p.categoryId,
      categoryTitle: category.title,
      imageUrl: /^https?:\/\//i.test(p.imageUrl) ? p.imageUrl : "",
      price: p.price, available: p.stock > 0,
    };
  }
  return { title: state.storefront.title, products };
}

// One Firebase transaction writes inventory and public availability together.
export function toStoredState(state: AccountingState) {
  return { ...state, publicCatalog: projectCatalog(state) };
}

export function catalogLink(uid: string) {
  const url = new URL("catalog.html", window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set("shop", uid);
  return url.href;
}
