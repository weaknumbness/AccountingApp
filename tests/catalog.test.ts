import { describe, it, expect } from "vitest";
import { applyCommand, emptyState, parseState } from "../src/domain/accounting";
import { projectCatalog, publicCatalogSchema, toStoredState } from "../src/domain/catalog";
function fixture() {
  let s = applyCommand(emptyState(1), { type: "category", id: "c", input: { title: "Чипсы", color: "#ffffff", icon: "" } });
  s = applyCommand(s, { type: "product", id: "p", input: { title: "Краб", categoryId: "c", price: 17500, friendPrice: 16500, imageUrl: "" } });
  s = applyCommand(s, { type: "receipt", id: "r", productId: "p", quantity: 1, unitCost: 10000, createdAt: 2 });
  return s;
}
describe("public catalog", () => {
  it("defaults existing accounts to private and only publishes an explicit allowlist", () => {
    const old: Record<string, unknown> = { ...fixture() }; delete old.storefront;
    expect(parseState(old).storefront.enabled).toBe(false);
    expect(projectCatalog(fixture())).toBeNull();
    const state = applyCommand(fixture(), { type: "storefront", title: "Магазин", enabled: true });
    expect(projectCatalog(state)).toEqual({ title: "Магазин", products: { p: {
      id: "p", title: "Краб", categoryId: "c", categoryTitle: "Чипсы", imageUrl: "", price: 17500, available: true,
    } } });
  });
  it("updates availability in the same stored snapshot as a sale and restocking", () => {
    let s = applyCommand(fixture(), { type: "storefront", title: "Магазин", enabled: true });
    s = applyCommand(s, { type: "sale", id: "sale", productId: "p", priceKind: "friend", expectedPrice: 16500, createdAt: 3 });
    expect(toStoredState(s).publicCatalog?.products.p).toMatchObject({ available: false, price: 17500 });
    expect(s.products.p?.stock).toBe(0);
    s = applyCommand(s, { type: "receipt", id: "r2", productId: "p", quantity: 2, unitCost: 10000, createdAt: 4 });
    expect(toStoredState(s).publicCatalog?.products.p?.available).toBe(true);
  });
  it("hides archived and deleted products, restores products and clears disabled catalog", () => {
    let s = applyCommand(fixture(), { type: "storefront", title: "Магазин", enabled: true });
    s = applyCommand(s, { type: "archive", id: "p", archived: true });
    expect(projectCatalog(s)?.products).toEqual({});
    s = applyCommand(s, { type: "archive", id: "p", archived: false });
    expect(projectCatalog(s)?.products.p).toBeDefined();
    s = applyCommand(s, { type: "archive", id: "p", archived: true });
    s = applyCommand(s, { type: "deleteProduct", id: "p" });
    expect(projectCatalog(s)?.products).toEqual({});
    s = applyCommand(s, { type: "storefront", title: "Магазин", enabled: false });
    expect(toStoredState(s).publicCatalog).toBeNull();
  });
  it("reflects category edits and normalizes empty Firebase products", () => {
    let s = applyCommand(fixture(), { type: "storefront", title: "Магазин", enabled: true });
    s = applyCommand(s, { type: "category", id: "c", input: { title: "Снеки", color: "#ffffff", icon: "" } });
    expect(projectCatalog(s)?.products.p?.categoryTitle).toBe("Снеки");
    expect(publicCatalogSchema.parse({ title: "Магазин" }).products).toEqual({});
  });
});
