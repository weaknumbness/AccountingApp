import { useRef, useState } from "react";
import type { AccountingState } from "../../domain/accounting";
import { catalogLink } from "../../domain/catalog";
import type { RunCommand } from "../products/ProductForm";
import { errorMessage } from "../../services/accountingService";
import "./settings.css";

export default function StorefrontSettings({ settings, ownerUid, demo, run }: {
  settings: AccountingState["storefront"]; ownerUid: string | null;
  demo: boolean; run: RunCommand;
}) {
  const [title, setTitle] = useState(settings.title);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const locked = useRef(false);
  const link = ownerUid ? catalogLink(ownerUid) : new URL("catalog.html?demo=1", window.location.href).href;
  async function save(enabled: boolean) {
    if (locked.current) return;
    locked.current = true; setBusy(true); setMessage("");
    try { await run({ type: "storefront", enabled, title: title.trim() || settings.title }); }
    catch (e) { setMessage(errorMessage(e)); }
    finally { locked.current = false; setBusy(false); }
  }
  async function copyLink() {
    try { await navigator.clipboard.writeText(link); setMessage("Ссылка скопирована."); }
    catch { setMessage("Выделите и скопируйте ссылку вручную."); }
  }
  return <section className="storefront-settings" aria-labelledby="storefront-heading">
    <div className="storefront-settings-heading">
      <h3 id="storefront-heading">Витрина для покупателей</h3>
      <span>{settings.enabled && !demo ? "Опубликована" : "Не опубликована"}</span>
    </div>
    <p>Отдельная страница без регистрации: название, фото, категория, обычная цена и наличие. Закупочная цена, цена для друзей и данные продаж скрыты.</p>
    {demo ? <p className="notice">В деморежиме доступен пример витрины. Для публикации своих товаров войдите в аккаунт.</p> : <>
      <label className="storefront-title">Название витрины
        <input value={title} maxLength={80} onChange={e => setTitle(e.target.value)} disabled={busy} />
      </label>
      {!settings.enabled && <p className="muted">После включения все неархивные товары станут доступны по ссылке. Перед первым включением опубликуйте обновлённые правила Firebase из проекта.</p>}
      <div className="storefront-settings-actions">
        <button className="primary-button" disabled={busy || !title.trim() || !ownerUid} onClick={() => void save(true)}>{busy ? "Сохранение…" : settings.enabled ? "Сохранить название" : "Опубликовать витрину"}</button>
        {settings.enabled && <button className="secondary-button" disabled={busy} onClick={() => void save(false)}>Скрыть витрину</button>}
      </div>
    </>}
    {(settings.enabled || demo) && <>
      <label className="storefront-title">Ссылка для покупателей<input aria-label="Ссылка для покупателей" value={link} readOnly onFocus={e => e.target.select()} /></label>
      <div className="storefront-settings-actions">
        <a className="secondary-button" href={link} target="_blank" rel="noopener noreferrer">{demo ? "Посмотреть пример" : "Открыть витрину"}</a>
        {!demo && <button className="secondary-button" onClick={() => void copyLink()}>Скопировать ссылку</button>}
      </div>
    </>}
    {message && <p role="status">{message}</p>}
  </section>;
}
