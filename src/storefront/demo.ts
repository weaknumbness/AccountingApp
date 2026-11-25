import type { PublicCatalog } from "../domain/catalog";
export const demoCatalog: PublicCatalog = {
  title: "Небольшой магазин",
  products: {
    crab: { id: "crab", title: "Лейс с крабом", categoryId: "chips", categoryTitle: "Чипсы", imageUrl: "", price: 17500, available: true },
    cream: { id: "cream", title: "Сметана и лук", categoryId: "chips", categoryTitle: "Чипсы", imageUrl: "", price: 17500, available: true },
    cheese: { id: "cheese", title: "Сырные чипсы", categoryId: "chips", categoryTitle: "Чипсы", imageUrl: "", price: 18000, available: false },
    cola: { id: "cola", title: "Кола", categoryId: "drinks", categoryTitle: "Напитки", imageUrl: "", price: 12000, available: true },
    tea: { id: "tea", title: "Холодный чай", categoryId: "drinks", categoryTitle: "Напитки", imageUrl: "", price: 11000, available: true },
    chocolate: { id: "chocolate", title: "Молочный шоколад", categoryId: "sweets", categoryTitle: "Сладости", imageUrl: "", price: 15000, available: true },
  },
};
