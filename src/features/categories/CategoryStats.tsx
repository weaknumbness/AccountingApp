type CategoryStatsProps = {
  countOfCategories: number;
  generalStock: number;
  generalProfit: number;
  averageProfit: number;
};

const widthAndHeightOfSvg = 40;

export default function CategoryStats({
  countOfCategories,
  generalStock,
  generalProfit,
  averageProfit,
}: CategoryStatsProps) {
  return (
    <div className="stats">
      {/* Количество категорий */}
      <div className="stat count-of-categories">
        <div className="stat-pic">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={widthAndHeightOfSvg}
            height={widthAndHeightOfSvg}
            fill="currentColor"
            className="bi bi-folder"
            viewBox="0 0 16 16"
          >
            <path d="M.54 3.87.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31zM2.19 4a1 1 0 0 0-.996 1.09l.637 7a1 1 0 0 0 .995.91h10.348a1 1 0 0 0 .995-.91l.637-7A1 1 0 0 0 13.81 4H2.19zm4.69-1.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707z" />
          </svg>
        </div>
        <div className="stat-info">
          <h2 className="stat-description">Всего категорий</h2>
          <h3 className="stat-number">{countOfCategories}</h3>
          <h3 className="stat-description">Активных категорий</h3>
        </div>
      </div>

      {/* Общий остаток */}
      <div className="stat general-stock">
        <div className="stat-pic">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={widthAndHeightOfSvg}
            height={widthAndHeightOfSvg}
            fill="currentColor"
            className="bi bi-box"
            viewBox="0 0 16 16"
          >
            <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5 8.186 1.113zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z" />
          </svg>
        </div>
        <div className="stat-info">
          <h2 className="stat-description">Общий остаток</h2>
          <h3 className="stat-number">{generalStock}</h3>
          <h3 className="stat-description">По всем категориям</h3>
        </div>
      </div>
      {/* Общая прибыль */}
      <div className="stat generalProfit">
        <div className="stat-pic">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={widthAndHeightOfSvg}
            height={widthAndHeightOfSvg}
            fill="currentColor"
            className="bi bi-currency-dollar"
            viewBox="0 0 16 16"
          >
            <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73l.348.086z" />
          </svg>
        </div>
        <div className="stat-info">
          <h2 className="stat-description">Общая прибыль</h2>
          <h3 className="stat-number">{generalProfit}</h3>
          <h3 className="stat-description">За все время</h3>
        </div>
      </div>
      {/* Средняя прибыль */}
      <div className="stat average-profit">
        <div className="stat-pic">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={widthAndHeightOfSvg}
            height={widthAndHeightOfSvg}
            fill="currentColor"
            className="bi bi-graph-up-arrow"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M0 0h1v15h15v1H0V0Zm10 3.5a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V4.9l-3.613 4.417a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61L13.445 4H10.5a.5.5 0 0 1-.5-.5Z"
            />
          </svg>
        </div>
        <div className="stat-info">
          <h2 className="stat-description">Средняя прибыль</h2>
          <h3 className="stat-number">{averageProfit}</h3>
          <h3 className="stat-description">На категорию</h3>
        </div>
      </div>
    </div>
  );
}
