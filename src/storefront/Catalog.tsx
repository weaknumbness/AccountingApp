import { useEffect, useMemo, useState } from "react";
import { onValue, ref } from "firebase/database";
import { db } from "../services/firebase/client";
import { publicCatalogSchema, type PublicCatalog, type PublicProduct } from "../domain/catalog";
import { demoCatalog } from "./demo";

const rubles = new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 2 });
function ProductImage({ product }: { product: PublicProduct }) {
  const [failed, setFailed] = useState(false);
  const safeImage = /^https?:\/\//i.test(product.imageUrl);
  return <div className={`catalog-product-image ${product.available ? "" : "unavailable"}`}>
    {safeImage && !failed ? <img src={product.imageUrl} alt={product.title} loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} /> : <div className="catalog-placeholder" aria-label="Фото пока нет">
      <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="m14 21 18-10 18 10v23L32 54 14 44V21Z"/><path d="m14 21 18 10 18-10M32 31v23M23 16l18 10v10"/></svg>
      <span>Фото скоро появится</span>
    </div>}
    <span className={`catalog-availability ${product.available ? "in-stock" : "out-of-stock"}`}>{product.available ? "В наличии" : "Нет в наличии"}</span>
  </div>;
}

export function CatalogView({ catalog, demo = false, connected = true }: { catalog: PublicCatalog; demo?: boolean; connected?: boolean }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sort, setSort] = useState("availability");
  const products = useMemo(() => Object.values(catalog.products), [catalog.products]);
  const categories = useMemo(() => {
    const map = new Map<string, { title: string; count: number }>();
    for (const p of products) map.set(p.categoryId, { title: p.categoryTitle, count: (map.get(p.categoryId)?.count ?? 0) + 1 });
    return [...map.entries()].sort((a, b) => a[1].title.localeCompare(b[1].title, "ru"));
  }, [products]);
  const activeCategory = categories.some(([id]) => id === category) ? category : "all";
  const filtered = useMemo(() => products.filter(p =>
    (activeCategory === "all" || p.categoryId === activeCategory) &&
    (!onlyAvailable || p.available) &&
    `${p.title} ${p.categoryTitle}`.toLocaleLowerCase("ru").includes(search.trim().toLocaleLowerCase("ru"))
  ).sort((a, b) => {
    if (sort === "price-up") return a.price - b.price || a.title.localeCompare(b.title, "ru");
    if (sort === "price-down") return b.price - a.price || a.title.localeCompare(b.title, "ru");
    if (sort === "title") return a.title.localeCompare(b.title, "ru");
    return Number(b.available) - Number(a.available) || a.title.localeCompare(b.title, "ru");
  }), [products, activeCategory, onlyAvailable, search, sort]);
  function reset() { setSearch(""); setCategory("all"); setOnlyAvailable(false); setSort("availability"); }
  useEffect(() => { document.title = `${catalog.title} — ассортимент`; }, [catalog.title]);
  return <div className="catalog-shell">
    <a className="catalog-skip" href="#catalog-products">Перейти к товарам</a>
    <header className="catalog-header">
      <a className="catalog-brand" href={window.location.href} aria-label={`${catalog.title}, главная`}>
        <span className="catalog-brand-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M5 8h14l1 12H4L5 8Z"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/></svg></span>
        <span>{catalog.title}</span>
      </a>
      <span className="catalog-header-caption">Витрина товаров</span>
    </header>
    <main className="catalog-main">
      {demo && <div className="catalog-banner">Пример витрины · демонстрационные товары и цены</div>}
      {!connected && !demo && <div className="catalog-banner" role="status">Нет связи с магазином. Показаны последние загруженные данные; наличие и цены могут измениться.</div>}

      <section aria-label="Поиск и фильтры" className="catalog-controls">
        <div className="catalog-search-row">
          <label className="catalog-search"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg><input aria-label="Поиск товаров" type="search" placeholder="Найти что-нибудь вкусное…" value={search} onChange={e => setSearch(e.target.value)} /></label>
          <label className="catalog-only"><input type="checkbox" checked={onlyAvailable} onChange={e => setOnlyAvailable(e.target.checked)} />Только в наличии</label>
        </div>
        <div className="catalog-category-list" aria-label="Категории">
          <button aria-pressed={activeCategory === "all"} onClick={() => setCategory("all")}>Все товары <span>{products.length}</span></button>
          {categories.map(([id, c]) => <button key={id} aria-pressed={activeCategory === id} onClick={() => setCategory(id)}>{c.title}<span>{c.count}</span></button>)}
        </div>
      </section>
      <section id="catalog-products" aria-label="Товары">
        <div className="catalog-results"><p role="status">Найдено товаров: <strong>{filtered.length}</strong></p><label>Сортировка<select aria-label="Сортировка" value={sort} onChange={e => setSort(e.target.value)}><option value="availability">Сначала в наличии</option><option value="price-up">Сначала дешевле</option><option value="price-down">Сначала дороже</option><option value="title">По названию</option></select></label></div>
        {filtered.length ? <div className="catalog-grid">{filtered.map(p => <article key={p.id} className="catalog-product" data-catalog-product={p.id}>
          <ProductImage key={p.imageUrl} product={p} />
          <div className="catalog-product-details"><p className="catalog-product-category">{p.categoryTitle}</p><h2>{p.title}</h2><p className="catalog-price">{rubles.format(p.price / 100)}</p></div>
        </article>)}</div> : <div className="catalog-empty"><h2>{products.length ? "Ничего не нашлось" : "Здесь скоро появятся товары"}</h2><p>{products.length ? "Попробуйте другое название или уберите фильтры." : "Магазин ещё наполняет свой ассортимент. Загляните немного позже."}</p>{products.length > 0 && <button onClick={reset}>Сбросить фильтры</button>}</div>}
      </section>
    </main>
    {/* <footer className="catalog-footer"><span>{catalog.title}</span><p>Каталог для знакомства с ассортиментом.<br/>Покупка и оплата на этой странице не предусмотрены.</p></footer> */}
  </div>;
}

export default function Catalog() {
  const params = new URLSearchParams(window.location.search);
  const demo = params.get("demo") === "1";
  const shop = params.get("shop") ?? "";
  const validShop = shop.length > 0 && shop.length <= 128 && !/[.#$[\]/\u0000-\u001f\u007f]/.test(shop);
  const [catalog, setCatalog] = useState<PublicCatalog | null>(null);
  const [error, setError] = useState("");
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    if (demo || !validShop || !db) return;
    const stopConnection = onValue(ref(db, ".info/connected"), snapshot => setConnected(snapshot.val() === true));
    const stopCatalog = onValue(ref(db, `users/${shop}/accountingV2/publicCatalog`), snapshot => {
      if (!snapshot.exists()) { setCatalog(null); setError("Витрина пока не опубликована или уже скрыта владельцем."); return; }
      const parsed = publicCatalogSchema.safeParse(snapshot.val());
      if (!parsed.success) { setCatalog(null); setError("Не удалось прочитать ассортимент. Попробуйте зайти позже."); return; }
      setCatalog(parsed.data); setError("");
    }, () => { setCatalog(null); setError("Витрина недоступна. Возможно, владелец скрыл её или ссылка устарела."); });
    return () => { stopCatalog(); stopConnection(); };
  }, [demo, shop, validShop]);
  if (demo) return <CatalogView catalog={demoCatalog} demo />;
  if (!validShop || !db || error) return <div className="catalog-message"><span className="catalog-eyebrow">ВИТРИНА ТОВАРОВ</span><h1>Не удалось открыть витрину</h1><p role="alert">{!validShop ? "В ссылке не указан магазин. Попросите продавца прислать ссылку из его профиля." : !db ? "Подключение магазина ещё не настроено. Попробуйте зайти позже." : error}</p><button onClick={() => window.location.reload()}>Попробовать снова</button></div>;
  if (!catalog) return <div className="catalog-message" role="status"><div className="catalog-loader"/><h1>Загружаем ассортимент</h1><p>{connected ? "Собираем товары на витрине…" : "Подключаемся к магазину. Проверьте интернет, если загрузка затянулась."}</p></div>;
  return <CatalogView catalog={catalog} connected={connected} />;
}
