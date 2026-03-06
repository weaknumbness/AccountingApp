import { useState, useRef, useEffect } from "react";
import LogOut from "../Components/LogOut";

export default function Header(props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null); // ссылка на меню
  const burgerRef = useRef(null); // ссылка на кнопку бургер

  // закрытие меню при клике вне области
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        burgerRef.current &&
        !burgerRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
          ref={burgerRef}
          className="burger"
          onClick={() => setMenuOpen(prev => !prev)}
        >
          ☰
        </button>

        {menuOpen && (
          <div ref={menuRef} className="burgerMenu">
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