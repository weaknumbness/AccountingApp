import { memo } from "react";
import logo from "../assets/Logo.png";
export type Page = "goods" | "categories" | "sales" | "reports" | "profile";
const pages: { id: Page; label: string }[] = [
  { id: "goods", label: "Товары" },
  { id: "categories", label: "Категории" },
  { id: "sales", label: "Продажи" },
  { id: "reports", label: "Отчёты" },
];
export default memo(function AppSideBar({
  page,
  onPage,
  email,
}: {
  page: Page;
  onPage: (p: Page) => void;
  email: string;
}) {
  return (
    <aside className="side-bar">
      <div className="top-side">
        <div className="logo">
          <div className="logo-picture">
            <img src={logo} alt="" />
          </div>
          <h1>AccountingApp</h1>
        </div>
        <div className="menu-settings">
          <nav className="menu" aria-label="Главное меню">
            <h2>МЕНЮ</h2>
            <ul>
              {pages.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className={page === p.id ? "nav-selected" : ""}
                    aria-current={page === p.id ? "page" : undefined}
                    onClick={() => onPage(p.id)}
                  >
                    {p.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <div className="down-side">
        <button type="button" className="user-profile profile-trigger"
          aria-label="Открыть профиль"
          aria-current={page === "profile" ? "page" : undefined}
          onClick={() => onPage("profile")}>
          <span className="profile-avatar" aria-hidden="true">{email.slice(0, 1).toUpperCase()}</span>
          <div className="user-info">
            <div className="user-mail" title={email}>
              {email}
            </div>
            <div className="name">Личный учёт</div>
          </div>
        </button>
      </div>
    </aside>
  );
});
