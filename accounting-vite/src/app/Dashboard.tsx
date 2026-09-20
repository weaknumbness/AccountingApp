import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  money,
  totals,
  reconcileState,
  type AccountingState,
  type Command,
} from "../domain/accounting";
import { errorMessage, type Repository } from "../services/accountingService";
import AppSideBar, { type Page } from "../components/layout/AppSideBar";
import Card from "../features/products/Card";
import DeleteProductDialog from "../features/products/DeleteProductDialog";
import ProductForm from "../features/products/ProductForm";
import ReceiptForm from "../features/products/ReceiptForm";
import CategoryForm from "../features/categories/CategoryForm";
import Reports from "../features/Reports";
type Dialog =
  | { kind: "product"; id: string | null }
  | { kind: "category"; id: string | null }
  | { kind: "deleteProduct"; id: string }
  | { kind: "receipt" }
  | null;
const titles: Record<Page, string> = {
  goods: "Товары",
  categories: "Категории",
  sales: "Продажи",
  reports: "Отчёты",
  profile: "Профиль",
};
export default function Dashboard({
  repository,
  email,
  demo,
  onLogout,
}: {
  repository: Repository;
  email: string;
  demo: boolean;
  onLogout: () => void;
}) {
  const [state, setState] = useState<AccountingState | null>(null),
    [error, setError] = useState(""),
    [notice, setNotice] = useState<{ id: string; text: string } | null>(null);
  const [page, setPage] = useState<Page>("goods"),
    [dialog, setDialog] = useState<Dialog>(null),
    [search, setSearch] = useState(""),
    [categoryId, setCategoryId] = useState("all"),
    [showArchive, setShowArchive] = useState(false),
    [categorySearch, setCategorySearch] = useState(""),
    [sort, setSort] = useState("revenue");
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(
    () =>
      repository.subscribe(
        (next) => {
          setState((old) => reconcileState(old, next));
          setError("");
        },
        (e) => setError(errorMessage(e)),
      ),
    [repository],
  );
  useEffect(() => {
    const change = () => setOnline(navigator.onLine);
    window.addEventListener("online", change);
    window.addEventListener("offline", change);
    return () => {
      window.removeEventListener("online", change);
      window.removeEventListener("offline", change);
    };
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => {
      setNotice((current) => (current?.id === notice.id ? null : current));
    }, 3200);
    return () => window.clearTimeout(timer);
  }, [notice]);
  const run = useCallback(
    async (cmd: Command) => {
      if (!demo && !navigator.onLine)
        throw new Error("Нет подключения. Операция не отправлена.");
      await repository.execute(cmd);
      setNotice({
        id: crypto.randomUUID(),
        text:
          cmd.type === "sale"
            ? "Продажа сохранена."
            : cmd.type === "receipt"
              ? "Поступление сохранено."
              : cmd.type === "deleteProduct" ? "Товар удалён." : "Изменения сохранены.",
      });
    },
    [repository, demo],
  );
  const onEdit = useCallback(
    (id: string) => setDialog({ kind: "product", id }),
    [],
  );
  const onDelete = useCallback((id: string) => setDialog({ kind: "deleteProduct", id }), []);
  const close = useCallback(() => setDialog(null), []);
  const products = useMemo(
    () => Object.values(state?.products ?? {}),
    [state?.products],
  );
  const categories = useMemo(
    () => Object.values(state?.categories ?? {}),
    [state?.categories],
  );
  const financialProducts = useMemo(
    () => [...products, ...Object.values(state?.deletedProducts ?? {})],
    [products, state?.deletedProducts],
  );
  const stats = useMemo(() => totals(financialProducts), [financialProducts]);
  const visibleProducts = useMemo(
    () =>
      products.filter(
        (p) =>
          p.archived === showArchive &&
          (categoryId === "all" || p.categoryId === categoryId) &&
          p.title
            .toLocaleLowerCase("ru")
            .includes(search.trim().toLocaleLowerCase("ru")),
      ),
    [products, showArchive, categoryId, search],
  );
  const categoryRows = useMemo(
    () =>
      categories
        .map((c) => ({
          c,
          items: products.filter((p) => p.categoryId === c.id),
          stats: totals(financialProducts.filter((p) => p.categoryId === c.id)),
        }))
        .filter((r) =>
          r.c.title
            .toLocaleLowerCase("ru")
            .includes(categorySearch.trim().toLocaleLowerCase("ru")),
        )
        .sort((a, b) =>
          sort === "title"
            ? a.c.title.localeCompare(b.c.title, "ru")
            : sort === "stock"
              ? b.stats.stock - a.stats.stock
              : sort === "sold"
                ? b.stats.sold - a.stats.sold
                : b.stats.revenue - a.stats.revenue,
        ),
    [categories, products, financialProducts, categorySearch, sort],
  );
  async function removeCategory(id: string) {
    try {
      await run({ type: "deleteCategory", id });
    } catch (e) {
      setError(errorMessage(e));
    }
  }
  function exportData() {
    if (!state) return;
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = `accounting-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="PageOfGoods">
      <AppSideBar
        page={page}
        onPage={setPage}
        email={email}
      />
      <main className="main-section">
        <header>
          <h2>{titles[page]}</h2>
          <div className="header-actions">
            {page === "goods" && (
              <>
                <button
                  className="secondary-button"
                  onClick={() => setDialog({ kind: "receipt" })}
                  disabled={!products.some((p) => !p.archived)}
                >
                  Поступление
                </button>
                <button
                  className="add-button"
                  onClick={() => setDialog({ kind: "product", id: null })}
                >
                  <span className="plus">+</span>Добавить товар
                </button>
              </>
            )}
            {page === "categories" && (
              <button
                className="add-button"
                onClick={() => setDialog({ kind: "category", id: null })}
              >
                <span className="plus">+</span>Добавить категорию
              </button>
            )}
          </div>
        </header>
        <div className="body-section">
          {demo && (
            <p className="notice">
              Деморежим · данные сохраняются только в этом браузере.
            </p>
          )}
          {!online && !demo && (
            <p role="alert" className="notice">
              Нет подключения к интернету. Новые операции недоступны.
            </p>
          )}
          {error && (
            <p role="alert" className="error">
              {error}
            </p>
          )}
          {!state && !error && <p role="status">Загрузка данных…</p>}
          {state && (
            <>
              {(page === "goods" || page === "categories") && (
                <>
                  <div className="stats">
                    <div className="stat">
                      <div>
                        <p className="stat-description">Общий остаток</p>
                        <strong className="stat-number">
                          {stats.stock} шт.
                        </strong>
                      </div>
                    </div>
                    <div className="stat">
                      <div>
                        <p className="stat-description">
                          Продано{stats.legacy ? " с перехода" : ""}
                        </p>
                        <strong className="stat-number">
                          {stats.sold} шт.
                        </strong>
                        <p className="muted">{stats.unique} наименований</p>
                      </div>
                    </div>
                    <div className="stat">
                      <div>
                        <p className="stat-description">Выручка за всё время</p>
                        <strong className="stat-number">
                          {money(stats.revenue)}
                        </strong>
                      </div>
                    </div>
                    <div className="stat">
                      <div>
                        <p className="stat-description">Валовая прибыль *</p>
                        <strong className="stat-number">
                          {money(stats.profit)}
                        </strong>
                      </div>
                    </div>
                  </div>
                  <p className="muted stats-explanation">
                    * По продажам с известной себестоимостью. Без себестоимости:{" "}
                    {stats.unknown} шт.
                    {stats.legacy
                      ? " Количество старых продаж неизвестно; их выручка сохранена."
                      : ""}
                  </p>
                </>
              )}
              {page === "goods" && (
                <>
                  <div className="goods-tools">
                    <label id="search-input">
                      <input
                        aria-label="Поиск товаров"
                        placeholder="Поиск товаров…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </label>
                    <label className="archive-toggle">
                      <input
                        type="checkbox"
                        checked={showArchive}
                        onChange={(e) => setShowArchive(e.target.checked)}
                      />
                      Архив товаров
                    </label>
                  </div>
                  <div className="category-buttons">
                    <button
                      className={`category-button ${categoryId === "all" ? "active" : ""}`}
                      onClick={() => setCategoryId("all")}
                    >
                      Все{" "}
                      {
                        products.filter((p) => p.archived === showArchive)
                          .length
                      }
                    </button>
                    {categories.map((c) => (
                      <button
                        key={c.id}
                        className={`category-button ${categoryId === c.id ? "active" : ""}`}
                        onClick={() => setCategoryId(c.id)}
                      >
                        {c.title}{" "}
                        {
                          products.filter(
                            (p) =>
                              p.archived === showArchive &&
                              p.categoryId === c.id,
                          ).length
                        }
                      </button>
                    ))}
                  </div>
                  <div className="cards-section">
                    <div className="cards">
                      <AnimatePresence>
                        {visibleProducts.map((p) => (
                          <Card
                            key={p.id}
                            product={p}
                            category={state.categories[p.categoryId]}
                            run={run}
                            onEdit={onEdit}
                            onDelete={onDelete}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                    {!visibleProducts.length && (
                      <p className="empty">
                        {products.length
                          ? "Товары не найдены."
                          : "Добавьте категорию, затем товар и его первое поступление."}
                      </p>
                    )}
                  </div>
                </>
              )}
              {page === "categories" && (
                <>
                  <div className="tools">
                    <label id="search-input">
                      <input
                        placeholder="Поиск категорий…"
                        aria-label="Поиск категорий"
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)}
                      />
                    </label>
                    <label id="sort">
                      Сортировка:
                      <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                      >
                        <option value="revenue">По выручке</option>
                        <option value="sold">По продажам</option>
                        <option value="stock">По остатку</option>
                        <option value="title">По названию</option>
                      </select>
                    </label>
                  </div>
                  <div className="categories">
                    <AnimatePresence>
                      {categoryRows.map(({ c, items, stats: s }) => (
                        <motion.article
                          key={c.id}
                          className="category"
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.97 }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        >
                          <div className="category-top-info">
                            <div
                              className="category-pic"
                              style={{ background: c.color }}
                            >
                              {c.icon || c.title.slice(0, 1)}
                            </div>
                            <div className="category-title">
                              <div className="category-first-info">
                                <h3>{c.title}</h3>
                                <p>
                                  {items.filter((p) => !p.archived).length}{" "}
                                  наименований
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="category-down-info">
                            <div>
                              <p className="category-down-title">Остаток</p>
                              <strong>{s.stock} шт.</strong>
                            </div>
                            <div>
                              <p className="category-down-title">Продано</p>
                              <strong>
                                {s.sold} шт. / {s.unique} наим.
                              </strong>
                            </div>
                          </div>
                          <div className="category-down-info category-financials">
                            <div>
                              <p className="category-down-title">Выручка</p>
                              <strong className="profit-profit">
                                {money(s.revenue)}
                              </strong>
                            </div>
                            <div>
                              <p className="category-down-title">
                                Валовая прибыль *
                              </p>
                              <strong>{money(s.profit)}</strong>
                            </div>
                          </div>
                          <div className="category-actions">
                            <button
                              className="secondary-button"
                              onClick={() =>
                                setDialog({ kind: "category", id: c.id })
                              }
                            >
                              Изменить
                            </button>
                            <button
                              className="secondary-button"
                              disabled={items.length > 0}
                              title={
                                items.length
                                  ? "Категория содержит товары"
                                  : "Удалить пустую категорию"
                              }
                              onClick={() => void removeCategory(c.id)}
                            >
                              Удалить
                            </button>
                          </div>
                        </motion.article>
                      ))}
                    </AnimatePresence>
                  </div>
                  {!categoryRows.length && (
                    <p className="empty">Категории не найдены.</p>
                  )}
                </>
              )}
              {(page === "sales" || page === "reports") && (
                <Reports key={page} state={state} report={page === "reports"} />
              )}
              {page === "profile" && (
                <section className="profile-panel">
                  <h3 className="section-title">{email}</h3>
                  <p>
                    {demo
                      ? "Учебные данные в этом браузере."
                      : "Данные привязаны к вашему аккаунту Firebase."}
                  </p>
                  <p className="muted">
                    Учёт операций начат{" "}
                    {new Date(state.startedAt).toLocaleDateString("ru-RU")}.
                    Старые данные при переносе не удаляются.
                  </p>
                  <button className="primary-button" onClick={exportData}>
                    Скачать резервную копию JSON
                  </button>
                  <p className="muted">
                    Архивные и удалённые товары сохраняют историю и выручку. Гостевой
                    каталог будет отдельным этапом.
                  </p>
                  <button className="secondary-button logout-button" onClick={onLogout}>
                    Выйти из аккаунта
                  </button>
                </section>
              )}
            </>
          )}
        </div>
      </main>
      <div
        className="toast-region"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence>
          {notice && (
            <motion.div
              key={notice.id}
              className="toast"
              initial={{ opacity: 0, y: -18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.22 }}
            >
              <span>{notice.text}</span>
              <button
                type="button"
                className="toast-close"
                aria-label="Закрыть уведомление"
                onClick={() => setNotice(null)}
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {state && dialog?.kind === "product" && (
          <ProductForm
            key={`product-${dialog.id ?? "new"}`}
            product={dialog.id ? (state.products[dialog.id] ?? null) : null}
            state={state}
            onClose={close}
            run={run}
          />
        )}
        {state && dialog?.kind === "deleteProduct" && state.products[dialog.id] && (
          <DeleteProductDialog key={`delete-${dialog.id}`} product={state.products[dialog.id]!} run={run} onClose={close} />
        )}
        {state && dialog?.kind === "receipt" && (
          <ReceiptForm
            key="receipt"
            products={products.filter((p) => !p.archived)}
            run={run}
            onClose={close}
          />
        )}
        {state && dialog?.kind === "category" && (
          <CategoryForm
            key={`category-${dialog.id ?? "new"}`}
            category={dialog.id ? (state.categories[dialog.id] ?? null) : null}
            run={run}
            onClose={close}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
