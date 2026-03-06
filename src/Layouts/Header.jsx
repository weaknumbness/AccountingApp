// import LogOut from "../Components/LogOut";
// import { useState } from "react";

// export default function Header(props) {
//   return <div className="Header">
//     <button className="wkBtn Logout" onClick={props.logOut}>Выйти из аккаунта <LogOut /></button>
//     <h1>Accounting App</h1>
//     <button className="wkBtn add" onClick={props.openCb}>Добавить Категорию</button>
//   </div>
// }

import { useState } from "react";
import LogOut from "../Components/LogOut";

export default function Header(props) {

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="Header">

      <h1>Accounting App</h1>

      <div className="headerButtons">

        <button className="wkBtn Logout desktopBtn" onClick={props.logOut}>
          Выйти из аккаунта <LogOut />
        </button>

        <button className="wkBtn add desktopBtn" onClick={props.openCb}>
          Добавить Категорию
        </button>

        <button
          className="burger"
          onClick={() => setMenuOpen(prev => !prev)}
        >
          ☰
        </button>

        {menuOpen && (
          <div className="burgerMenu">
            <button className="wkBtn Logout" onClick={props.logOut}>
              Выйти из аккаунта <LogOut />
            </button>

            <button className="wkBtn add" onClick={props.openCb}>
              Добавить Категорию
            </button>
          </div>
        )}

      </div>

    </div>
  );
}