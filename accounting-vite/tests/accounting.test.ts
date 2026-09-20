import { describe, it, expect } from "vitest";
import {
  applyCommand,
  emptyState,
  migrateLegacy,
  parseState,
  reconcileState,
  moneyInput,
  totals,
} from "../src/domain/accounting";
import type { AccountingState, Command } from "../src/domain/accounting";
function fixture() {
  let s = emptyState(100);
  s = applyCommand(s, {
    type: "category",
    id: "c",
    input: { title: "Чипсы", color: "#FEF3C7", icon: "" },
  });
  for (const id of ["p", "q"])
    s = applyCommand(s, {
      type: "product",
      id,
      input: {
        title: id,
        categoryId: "c",
        imageUrl: "",
        price: 17500,
        friendPrice: 16500,
      },
    });
  return s;
}
const receipt = (id: string, quantity: number, unitCost: number): Command => ({
  type: "receipt",
  id,
  productId: "p",
  quantity,
  unitCost,
  createdAt: 1000,
});
const sale = (id: string, friend = false): Command => ({
  type: "sale",
  id,
  productId: "p",
  priceKind: friend ? "friend" : "regular",
  expectedPrice: friend ? 16500 : 17500,
  createdAt: 2000,
});
describe("Inventory and financial accounting", () => {
  it("uses actual discounted price and rejects selling out of stock", () => {
    let s = fixture();
    expect(() => applyCommand(s, sale("no"))).toThrow("закончился");
    s = applyCommand(s, receipt("r", 2, 10000));
    s = applyCommand(s, sale("s1"));
    s = applyCommand(s, sale("s2", true));
    expect(s.products.p).toMatchObject({
      stock: 0,
      stockValue: 0,
      sold: 2,
      revenue: 34000,
      knownProfit: 14000,
    });
    expect(totals(Object.values(s.products))).toMatchObject({
      unique: 1,
      sold: 2,
    });
    expect(() => applyCommand(s, sale("s3"))).toThrow();
  });
  it("weights purchases and exhausts inventory value without rounding drift", () => {
    let s = fixture();
    s = applyCommand(s, receipt("r1", 2, 10000));
    s = applyCommand(s, receipt("r2", 1, 10001));
    for (let i = 0; i < 3; i++) s = applyCommand(s, sale(`s${i}`));
    expect(Object.values(s.sales).reduce((n, s) => n + (s.cost ?? 0), 0)).toBe(
      30001,
    );
    expect(s.products.p?.stockValue).toBe(0);
  });
  it("does not reprice historical sales when a product is edited", () => {
    let s = applyCommand(fixture(), receipt("r", 3, 10000));
    s = applyCommand(s, sale("s"));
    s = applyCommand(s, {
      type: "product",
      id: "p",
      input: {
        title: "Новое имя",
        categoryId: "c",
        imageUrl: "",
        price: 20000,
        friendPrice: null,
      },
    });
    expect(s.sales.s).toMatchObject({ title: "p", price: 17500, cost: 10000 });
    expect(() => applyCommand(s, sale("changed"))).toThrow("Цена изменилась");
  });
  it("retries a sale or receipt idempotently", () => {
    const a = applyCommand(fixture(), receipt("r", 2, 10000));
    expect(applyCommand(a, receipt("r", 2, 10000))).toBe(a);
    const b = applyCommand(a, sale("s"));
    expect(applyCommand(b, sale("s"))).toBe(b);
  });
  it("retains old revenue without inventing sales or cost", () => {
    const s = migrateLegacy(
      {
        cards: {
          old: {
            name: "Краб",
            price: ["175Р", "165Р"],
            stock: "19",
            profit: 3225,
            category: "Чипсы",
          },
        },
        categories: { Чипсы: true },
      },
      100,
    );
    expect(s.products.old).toMatchObject({
      openingRevenue: 322500,
      sold: 0,
      stockValue: null,
      price: 17500,
      friendPrice: 16500,
    });
    const next = applyCommand(s, {
      type: "sale",
      id: "s",
      productId: "old",
      priceKind: "regular",
      expectedPrice: 17500,
      createdAt: 101,
    });
    expect(next.products.old).toMatchObject({
      revenue: 17500,
      knownProfit: 0,
      unknownCostSold: 1,
    });
    expect(totals(Object.values(next.products)).revenue).toBe(340000);
  });
  it("preserves unknown costs through mixed receipts and allows explicit opening valuation", () => {
    let s = migrateLegacy(
      {
        cards: {
          p: {
            name: "Краб",
            price: ["175Р"],
            stock: 2,
            profit: 0,
            category: "Чипсы",
          },
        },
      },
      100,
    );
    s = applyCommand(s, receipt("r", 1, 10000));
    expect(s.products.p?.stockValue).toBeNull();
    const p = s.products.p!;
    s = applyCommand(s, {
      type: "product",
      id: "p",
      input: {
        title: p.title,
        categoryId: p.categoryId,
        imageUrl: "",
        price: p.price,
        friendPrice: null,
      },
      openingCost: 9000,
    });
    expect(s.products.p?.stockValue).toBe(27000);
  });
  it("normalizes null fields omitted by Firebase", () => {
    const raw = JSON.parse(JSON.stringify(fixture())) as Record<
      string,
      unknown
    >;
    const products = raw.products as Record<string, Record<string, unknown>>;
    delete products.p!.friendPrice;
    delete products.p!.stockValue;
    delete raw.sales;
    expect(parseState(raw).products.p).toMatchObject({
      friendPrice: null,
      stockValue: null,
    });
    expect(parseState(raw).sales).toEqual({});
  });
  it("preserves unchanged card and category references across remote snapshots", () => {
    const before = applyCommand(fixture(), receipt("r", 2, 10000));
    const after = applyCommand(before, sale("s"));
    const next = reconcileState(
      before,
      parseState(JSON.parse(JSON.stringify(after))),
    );
    expect(next.products.q).toBe(before.products.q);
    expect(next.products.p).not.toBe(before.products.p);
    expect(next.categories).toBe(before.categories);
  });
  it("keeps totals and ledger when a product is archived, prevents further sales", () => {
    let s = applyCommand(fixture(), receipt("r", 2, 10000));
    s = applyCommand(s, sale("s"));
    s = applyCommand(s, { type: "archive", id: "p", archived: true });
    expect(totals(Object.values(s.products))).toMatchObject({
      revenue: 17500,
      sold: 1,
      stock: 0,
    });
    expect(s.sales.s).toBeDefined();
    expect(() => applyCommand(s, sale("s2"))).toThrow("архива");
  });
  it("rejects bad data, missing categories, duplicate category names and negative receipts", () => {
    const s = fixture();
    expect(() => applyCommand(s, receipt("r", -1, 10000))).toThrow();
    expect(() =>
      applyCommand(s, { type: "deleteCategory", id: "c" }),
    ).toThrow();
    expect(() =>
      applyCommand(s, {
        type: "category",
        id: "c2",
        input: { title: " чИпСы ", color: "#FEF3C7", icon: "" },
      }),
    ).toThrow();
    expect(() => parseState({ ...s, version: 3 })).toThrow();
    expect(() =>
      migrateLegacy(
        {
          cards: {
            p: {
              name: "X",
              price: ["bad"],
              stock: 1,
              profit: 0,
              category: "X",
            },
          },
        },
        100,
      ),
    ).toThrow();
    expect(() =>
      applyCommand(s, {
        type: "product",
        id: "x",
        input: {
          title: "X",
          categoryId: "missing",
          imageUrl: "",
          price: 1,
          friendPrice: null,
        },
      }),
    ).toThrow();
  });
  it("stores exact cents, accepts zero discount, rejects excess decimal precision", () => {
    expect(moneyInput("12,34")).toBe(1234);
    expect(moneyInput("0")).toBe(0);
    expect(() => moneyInput("1.234")).toThrow();
    expect(() => moneyInput("")).toThrow();
    const s = fixture();
    expect(() => applyCommand(s, receipt("r", 0.5, 100))).toThrow();
  });
  it("does not mutate earlier snapshots", () => {
    const before: AccountingState = fixture();
    const copy = JSON.stringify(before);
    applyCommand(before, receipt("r", 10, 10000));
    expect(JSON.stringify(before)).toBe(copy);
  });
});

it("deletes only archived products, retaining historical totals and immutable ledgers", () => {
  let s = applyCommand(fixture(), receipt("r", 3, 10000));
  s = applyCommand(s, sale("s"));
  s.products.p = { ...s.products.p!, openingRevenue: 322500, legacy: true };
  expect(() => applyCommand(s, { type: "deleteProduct", id: "p" })).toThrow("архива");
  s = applyCommand(s, { type: "archive", id: "p", archived: true });
  const before = s;
  const expected = totals(Object.values(s.products));
  s = applyCommand(s, { type: "deleteProduct", id: "p" });
  expect(s.products.p).toBeUndefined();
  expect(before.products.p).toBeDefined();
  expect(s.sales).toBe(before.sales);
  expect(s.receipts).toBe(before.receipts);
  expect(totals([...Object.values(s.products), ...Object.values(s.deletedProducts)])).toEqual(expected);
  expect(s.deletedProducts.p).not.toHaveProperty("stock");
  expect(applyCommand(s, { type: "deleteProduct", id: "p" })).toBe(s);
  expect(() => applyCommand(s, { type: "product", id: "p", input: before.products.p! })).toThrow("уже удалён");
  s = applyCommand(s, { type: "archive", id: "q", archived: true });
  s = applyCommand(s, { type: "deleteProduct", id: "q" });
  s = applyCommand(s, { type: "deleteCategory", id: "c" });
  expect(parseState(JSON.parse(JSON.stringify(s))).deletedProducts.p?.openingRevenue).toBe(322500);
});
it("reads existing databases without deleted product summaries", () => {
  const raw: Record<string, unknown> = { ...fixture() };
  delete raw.deletedProducts;
  expect(parseState(raw).deletedProducts).toEqual({});
});
