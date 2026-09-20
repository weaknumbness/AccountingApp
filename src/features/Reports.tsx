import { useMemo, useState } from "react";
import { money, type AccountingState, type Sale } from "../domain/accounting";
export default function Reports({
  state,
  report = false,
}: {
  state: AccountingState;
  report?: boolean;
}) {
  const [from, setFrom] = useState(""),
    [to, setTo] = useState(""),
    [kind, setKind] = useState<"sales" | "receipts">("sales");
  const invalid = Boolean(from && to && from > to);
  const within = (time: number) =>
    !invalid &&
    (!from || time >= new Date(`${from}T00:00:00`).getTime()) &&
    (!to || time <= new Date(`${to}T23:59:59.999`).getTime());
  const sales = Object.values(state.sales)
    .filter((s) => within(s.createdAt))
    .sort((a, b) => b.createdAt - a.createdAt);
  const receipts = Object.values(state.receipts)
    .filter((s) => within(s.createdAt))
    .sort((a, b) => b.createdAt - a.createdAt);
  const ranked = useMemo(() => {
    const groups = new Map<
      string,
      {
        title: string;
        quantity: number;
        revenue: number;
        profit: number;
        unknown: number;
      }
    >();
    for (const s of sales) {
      const p = groups.get(s.productId) ?? {
        title: state.products[s.productId]?.title ?? s.title,
        quantity: 0,
        revenue: 0,
        profit: 0,
        unknown: 0,
      };
      p.quantity++;
      p.revenue += s.price;
      if (s.cost === null) p.unknown++;
      else p.profit += s.price - s.cost;
      groups.set(s.productId, p);
    }
    return [...groups.entries()].sort((a, b) => b[1].quantity - a[1].quantity);
  }, [sales, state.products]);
  const displayDate = (v: number) =>
    new Intl.DateTimeFormat("ru-RU", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(v);
  const sum = (fn: (s: Sale) => number) => sales.reduce((a, s) => a + fn(s), 0);
  return (
    <>
      <div className="report-filters">
        <label className="form-field">
          <span>С даты</span>
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </label>
        <label className="form-field">
          <span>По дату</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </label>
        <button
          className="secondary-button"
          onClick={() => {
            setFrom("");
            setTo("");
          }}
        >
          За всё время
        </button>
      </div>
      {invalid && (
        <p className="error" role="alert">
          Дата начала должна быть не позже даты окончания.
        </p>
      )}
      <p className="muted">
        Журнал ведётся с {displayDate(state.startedAt)}. Старая выручка
        учитывается в карточках, но не включается в отчёты по датам.
      </p>
      {report ? (
        <>
          <div className="stats">
            <div className="stat">
              <div>
                <p className="stat-description">Продано единиц</p>
                <strong className="stat-number">{sales.length}</strong>
              </div>
            </div>
            <div className="stat">
              <div>
                <p className="stat-description">Продано наименований</p>
                <strong className="stat-number">{ranked.length}</strong>
              </div>
            </div>
            <div className="stat">
              <div>
                <p className="stat-description">Выручка</p>
                <strong className="stat-number">
                  {money(sum((s) => s.price))}
                </strong>
              </div>
            </div>
            <div className="stat">
              <div>
                <p className="stat-description">Валовая прибыль *</p>
                <strong className="stat-number">
                  {money(sum((s) => (s.cost === null ? 0 : s.price - s.cost)))}
                </strong>
              </div>
            </div>
          </div>
          <p className="muted">
            * По известной себестоимости. Продаж без себестоимости:{" "}
            {sales.filter((s) => s.cost === null).length}.
          </p>
          <h3 className="section-title">Самые продаваемые товары</h3>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Товар</th>
                  <th>Продано</th>
                  <th>Выручка</th>
                  <th>Валовая прибыль *</th>
                </tr>
              </thead>
              <tbody>
                {ranked.map(([id, p]) => (
                  <tr key={id}>
                    <td>{p.title}</td>
                    <td>{p.quantity} шт.</td>
                    <td>{money(p.revenue)}</td>
                    <td>
                      {money(p.profit)}
                      {p.unknown ? " *" : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!ranked.length && (
            <p className="empty">За выбранный период продаж нет.</p>
          )}
        </>
      ) : (
        <>
          <div className="category-buttons operation-tabs">
            <button
              className={`category-button ${kind === "sales" ? "active" : ""}`}
              onClick={() => setKind("sales")}
            >
              Продажи
            </button>
            <button
              className={`category-button ${kind === "receipts" ? "active" : ""}`}
              onClick={() => setKind("receipts")}
            >
              Поступления
            </button>
          </div>
          <div className="table-scroll">
            {kind === "sales" ? (
              <table>
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Товар</th>
                    <th>Цена</th>
                    <th>Тип</th>
                    <th>Себестоимость</th>
                    <th>Прибыль</th>
                  </tr>
                </thead>
                <tbody>
                  {sales.map((s) => (
                    <tr key={s.id}>
                      <td>{displayDate(s.createdAt)}</td>
                      <td>{s.title}</td>
                      <td>{money(s.price)}</td>
                      <td>
                        {s.priceKind === "friend" ? "Для друзей" : "Обычная"}
                      </td>
                      <td>{s.cost === null ? "Неизвестна" : money(s.cost)}</td>
                      <td>{s.cost === null ? "—" : money(s.price - s.cost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Товар</th>
                    <th>Количество</th>
                    <th>Закупка за шт.</th>
                    <th>Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  {receipts.map((r) => (
                    <tr key={r.id}>
                      <td>{displayDate(r.createdAt)}</td>
                      <td>{r.title}</td>
                      <td>{r.quantity}</td>
                      <td>{money(r.unitCost)}</td>
                      <td>{money(r.quantity * r.unitCost)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {!(kind === "sales" ? sales : receipts).length && (
            <p className="empty">Операций за выбранный период нет.</p>
          )}
        </>
      )}
    </>
  );
}
