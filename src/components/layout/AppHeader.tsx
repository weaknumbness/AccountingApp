import type { AppHeaderProps } from "../../types";


// export function AppHeader({title}: AppHeaderProps) {
export function AppHeader() {
  return (
    <header>
      {/* <h2>{title}</h2> */}
      {/* Какого-то хуя заголовок в сайд баре на другой высоте */}
      <h2>Товары</h2>
      <div>
        <button type="button" className="add-button">
          <div className="plus">+</div>
          <div className="add">Добавить товар</div>
        </button>
      </div>
    </header>
  );
}