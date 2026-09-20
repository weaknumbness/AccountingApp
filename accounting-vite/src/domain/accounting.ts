import { z } from "zod";
const amount = z.number().int().nonnegative().max(1_000_000_000_000);
const count = z.number().int().nonnegative().max(1_000_000_000);
const id = z
  .string()
  .min(1)
  .regex(/^[^.#$[\]/]+$/);
export const categorySchema = z.object({
  id,
  title: z.string().trim().min(1).max(100),
  color: z.string().regex(/^#[0-9a-f]{6}$/i),
  icon: z.string().max(40),
});
export const productSchema = z.object({
  id,
  title: z.string().trim().min(1).max(150),
  categoryId: id,
  imageUrl: z.string(),
  price: amount,
  friendPrice: amount.nullable().default(null),
  stock: count,
  stockValue: amount.nullable().default(null),
  openingRevenue: amount,
  revenue: amount,
  sold: count,
  knownProfit: z.number().int(),
  unknownCostSold: count,
  legacy: z.boolean(),
  archived: z.boolean(),
});
export const deletedProductSchema = productSchema.pick({
  id: true, title: true, categoryId: true, openingRevenue: true,
  revenue: true, sold: true, knownProfit: true, unknownCostSold: true, legacy: true,
});
export const saleSchema = z.object({
  id,
  productId: id,
  title: z.string(),
  categoryId: id,
  quantity: z.literal(1),
  price: amount,
  cost: amount.nullable().default(null),
  createdAt: z.number(),
  priceKind: z.enum(["regular", "friend"]),
});
export const receiptSchema = z.object({
  id,
  productId: id,
  title: z.string(),
  quantity: count.positive(),
  unitCost: amount,
  createdAt: z.number(),
});
const dictionary = <T extends z.ZodType>(schema: T) =>
  z.preprocess((v) => (v == null ? {} : v), z.record(id, schema));
export const stateSchema = z.object({
  version: z.literal(2),
  startedAt: z.number(),
  legacyImported: z.boolean(),
  products: dictionary(productSchema),
  deletedProducts: dictionary(deletedProductSchema),
  categories: dictionary(categorySchema),
  sales: dictionary(saleSchema),
  receipts: dictionary(receiptSchema),
});
export type Product = z.infer<typeof productSchema>;
export type Category = z.infer<typeof categorySchema>;
export type Sale = z.infer<typeof saleSchema>;
export type AccountingState = z.infer<typeof stateSchema>;
export type ProductInput = Pick<
  Product,
  "title" | "categoryId" | "imageUrl" | "price" | "friendPrice"
>;
export type CategoryInput = Omit<Category, "id">;
export type Command =
  | { type: "product"; id: string; input: ProductInput; openingCost?: number }
  | { type: "deleteProduct"; id: string }
  | { type: "archive"; id: string; archived: boolean }
  | { type: "category"; id: string; input: CategoryInput }
  | { type: "deleteCategory"; id: string }
  | {
      type: "sale";
      id: string;
      productId: string;
      priceKind: "regular" | "friend";
      expectedPrice: number;
      createdAt: number;
    }
  | {
      type: "receipt";
      id: string;
      productId: string;
      quantity: number;
      unitCost: number;
      createdAt: number;
    };
export function emptyState(now = Date.now()): AccountingState {
  return {
    version: 2,
    startedAt: now,
    legacyImported: false,
    products: {},
    deletedProducts: {},
    categories: {},
    sales: {},
    receipts: {},
  };
}
export function parseState(value: unknown): AccountingState {
  const s = stateSchema.parse(value);
  for (const [key, p] of Object.entries(s.products)) {
    if (key !== p.id || !s.categories[p.categoryId])
      throw new Error("Нарушена связь товара с категорией.");
  }
  for (const [key, p] of Object.entries(s.deletedProducts))
    if (key !== p.id || s.products[key]) throw new Error("Неверные данные удалённого товара.");
  for (const [key, c] of Object.entries(s.categories))
    if (key !== c.id) throw new Error("Неверный ID категории.");
  return s;
}
export function moneyInput(value: string): number {
  const v = value.trim().replace(",", ".");
  if (!/^\d+(\.\d{1,2})?$/.test(v))
    throw new Error("Укажите сумму: не более двух знаков после запятой.");
  return amount.parse(Math.round(Number(v) * 100));
}
export const money = (v: number) =>
  new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 2,
  }).format(v / 100);
export function applyCommand(
  s: AccountingState,
  cmd: Command,
): AccountingState {
  if (cmd.type === "category") {
    const category = categorySchema.parse({ ...cmd.input, id: cmd.id });
    if (
      Object.values(s.categories).some(
        (c) =>
          c.id !== cmd.id &&
          c.title.toLocaleLowerCase("ru") ===
            category.title.toLocaleLowerCase("ru"),
      )
    )
      throw new Error("Категория с таким названием уже существует.");
    return { ...s, categories: { ...s.categories, [cmd.id]: category } };
  }
  if (cmd.type === "deleteCategory") {
    if (Object.values(s.products).some((p) => p.categoryId === cmd.id))
      throw new Error(
        "Сначала переместите товары этой категории, включая архивные.",
      );
    const categories = { ...s.categories };
    delete categories[cmd.id];
    return { ...s, categories };
  }
  if (cmd.type === "deleteProduct") {
    const p = s.products[cmd.id];
    if (!p && s.deletedProducts[cmd.id]) return s;
    if (!p) throw new Error("Товар не найден.");
    if (!p.archived) throw new Error("Удалять можно только товары из архива.");
    const products = { ...s.products };
    delete products[cmd.id];
    return { ...s, products, deletedProducts: {
      ...s.deletedProducts, [cmd.id]: deletedProductSchema.parse(p),
    } };
  }
  if (cmd.type === "product") {
    if (s.deletedProducts[cmd.id]) throw new Error("Товар уже удалён. Создайте новый товар.");
    if (!s.categories[cmd.input.categoryId])
      throw new Error("Выберите существующую категорию.");
    if (cmd.input.imageUrl && !/^https?:\/\//i.test(cmd.input.imageUrl))
      throw new Error(
        "Ссылка на изображение должна начинаться с https:// или http://.",
      );
    const old = s.products[cmd.id];
    let p: Product = productSchema.parse({
      stock: 0,
      stockValue: 0,
      openingRevenue: 0,
      revenue: 0,
      sold: 0,
      knownProfit: 0,
      unknownCostSold: 0,
      legacy: false,
      archived: false,
      ...old,
      ...cmd.input,
      id: cmd.id,
    });
    if (cmd.openingCost !== undefined && p.stockValue === null)
      p = { ...p, stockValue: amount.parse(cmd.openingCost) * p.stock };
    return {
      ...s,
      products: { ...s.products, [p.id]: productSchema.parse(p) },
    };
  }
  const p = s.products[cmd.type === "archive" ? cmd.id : cmd.productId];
  if (!p) throw new Error("Товар не найден. Обновите страницу.");
  if (cmd.type === "archive")
    return {
      ...s,
      products: { ...s.products, [p.id]: { ...p, archived: cmd.archived } },
    };
  if (p.archived) throw new Error("Сначала восстановите товар из архива.");
  if (cmd.type === "sale") {
    if (s.sales[cmd.id]) return s; // Idempotent retry: never charge twice for the same operation.
    if (p.stock < 1) throw new Error("Товар закончился.");
    const price = cmd.priceKind === "regular" ? p.price : p.friendPrice;
    if (price === null) throw new Error("Цена для друзей не задана.");
    if (price !== cmd.expectedPrice)
      throw new Error(
        "Цена изменилась. Проверьте карточку и повторите продажу.",
      );
    const cost =
      p.stockValue === null ? null : Math.round(p.stockValue / p.stock);
    const next = productSchema.parse({
      ...p,
      stock: p.stock - 1,
      stockValue:
        p.stock === 1
          ? 0
          : p.stockValue === null
            ? null
            : p.stockValue - (cost ?? 0),
      sold: p.sold + 1,
      revenue: p.revenue + price,
      knownProfit: p.knownProfit + (cost === null ? 0 : price - cost),
      unknownCostSold: p.unknownCostSold + (cost === null ? 1 : 0),
    });
    const sale = saleSchema.parse({
      ...cmd,
      title: p.title,
      categoryId: p.categoryId,
      quantity: 1,
      price,
      cost,
    });
    return {
      ...s,
      products: { ...s.products, [p.id]: next },
      sales: { ...s.sales, [cmd.id]: sale },
    };
  }
  if (s.receipts[cmd.id]) return s;
  const receipt = receiptSchema.parse({ ...cmd, title: p.title });
  const next = productSchema.parse({
    ...p,
    stock: p.stock + receipt.quantity,
    stockValue:
      p.stockValue === null
        ? null
        : p.stockValue + receipt.quantity * receipt.unitCost,
  });
  return {
    ...s,
    products: { ...s.products, [p.id]: next },
    receipts: { ...s.receipts, [receipt.id]: receipt },
  };
}
// Preserve references across Firebase snapshots so memoized unrelated cards stay untouched.
export function reconcileState(
  old: AccountingState | null,
  next: AccountingState,
): AccountingState {
  if (!old) return next;
  function reuse<T>(
    a: Record<string, T>,
    b: Record<string, T>,
  ): Record<string, T> {
    const result: Record<string, T> = {};
    let same = Object.keys(a).length === Object.keys(b).length;
    for (const [key, value] of Object.entries(b)) {
      result[key] =
        JSON.stringify(a[key]) === JSON.stringify(value) ? a[key]! : value;
      if (result[key] !== a[key]) same = false;
    }
    return same ? a : result;
  }
  return {
    ...next,
    products: reuse(old.products, next.products),
    deletedProducts: reuse(old.deletedProducts, next.deletedProducts),
    categories: reuse(old.categories, next.categories),
    sales: reuse(old.sales, next.sales),
    receipts: reuse(old.receipts, next.receipts),
  };
}
const legacySchema = z.object({
  cards: dictionary(
    z.object({
      name: z.string().min(1),
      category: z.string().min(1),
      stock: z.union([z.string(), z.number()]),
      profit: z.union([z.string(), z.number()]),
      price: z
        .array(z.union([z.string(), z.number()]))
        .min(1)
        .max(2),
    }),
  ),
  categories: dictionary(z.boolean()),
});
export function migrateLegacy(value: unknown, now: number): AccountingState {
  const raw = legacySchema.parse(value ?? {});
  const s = emptyState(now);
  s.legacyImported = Object.keys(raw.cards).length > 0;
  const categoryIds = new Map<string, string>();
  for (const title of new Set([
    ...Object.keys(raw.categories),
    ...Object.values(raw.cards).map((p) => p.category),
  ])) {
    const key = `legacy-category-${categoryIds.size + 1}`;
    categoryIds.set(title, key);
    s.categories[key] = { id: key, title, color: "#DBEAFE", icon: "" };
  }
  const parseLegacyMoney = (v: string | number) =>
    moneyInput(String(v).replace(/[Р₽\s]/g, ""));
  for (const [key, p] of Object.entries(raw.cards)) {
    const stock = count.parse(Number(p.stock));
    s.products[key] = productSchema.parse({
      id: key,
      title: p.name,
      categoryId: categoryIds.get(p.category),
      imageUrl: "",
      price: parseLegacyMoney(p.price[0]!),
      friendPrice:
        p.price[1] === undefined ? null : parseLegacyMoney(p.price[1]),
      stock,
      stockValue: stock ? null : 0,
      openingRevenue: parseLegacyMoney(p.profit),
      revenue: 0,
      sold: 0,
      knownProfit: 0,
      unknownCostSold: 0,
      legacy: true,
      archived: false,
    });
  }
  return parseState(s);
}
type TotalsProduct = z.infer<typeof deletedProductSchema> & Partial<Pick<Product, "stock" | "archived">>;
export function totals(products: TotalsProduct[]) {
  return products.reduce(
    (t, p) => ({
      stock: t.stock + (p.archived ? 0 : (p.stock ?? 0)),
      sold: t.sold + p.sold,
      unique: t.unique + (p.sold > 0 ? 1 : 0),
      revenue: t.revenue + p.revenue + p.openingRevenue,
      profit: t.profit + p.knownProfit,
      unknown: t.unknown + p.unknownCostSold,
      legacy: t.legacy || p.legacy,
    }),
    {
      stock: 0,
      sold: 0,
      unique: 0,
      revenue: 0,
      profit: 0,
      unknown: 0,
      legacy: false,
    },
  );
}
