import { useRef, useState, type FormEvent } from "react";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, isConfigured } from "../../services/firebase/firebase";
import { errorMessage } from "../../services/accountingService";
import { registerAccount } from "../../services/authService";
export function AuthPage({ onDemo }: { onDemo: () => void }) {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [notice, setNotice] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [confirmation, setConfirmation] = useState("");
  const locked = useRef(false);
  const registering = mode === "register";
  function toggleMode() {
    if (locked.current) return;
    setMode((current) => (current === "login" ? "register" : "login"));
    setPassword("");
    setConfirmation("");
    setError("");
    setNotice("");
  }
  async function login(e: FormEvent) {
    e.preventDefault();
    if (!auth || locked.current) return;
    locked.current = true;
    setBusy(true);
    setError("");
    try {
      setNotice("");
      if (registering) await registerAccount(email, password, confirmation);
      else await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }
  async function reset() {
    if (!auth || locked.current) return;
    if (!email.trim()) {
      setError("Сначала введите email.");
      return;
    }
    locked.current = true;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setNotice(
        "Если аккаунт существует, письмо для сброса пароля будет отправлено.",
      );
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }
  return (
    <main className="auth-page">
      <section className="product-form-modal">
        <div className="product-form-header">
          <div>
            <h1>AccountingApp</h1>
            <p>
              {registering
                ? "Создайте аккаунт для учёта своих товаров"
                : "Товары, продажи и остатки в одном месте"}
            </p>
          </div>
        </div>
        <form className="product-form" onSubmit={(e) => void login(e)}>
          <label className="form-field">
            <span>Email</span>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="form-field">
            <span>Пароль</span>
            <input
              type="password"
              autoComplete={registering ? "new-password" : "current-password"}
              minLength={registering ? 6 : undefined}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {registering && (
            <>
              <label className="form-field">
                <span>Повторите пароль</span>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  minLength={6}
                  required
                />
              </label>
              <p className="muted">
                Не менее 6 символов. У каждого аккаунта свои товары, категории и
                история продаж. Новый каталог будет пустым.
              </p>
            </>
          )}
          {!isConfigured && (
            <p className="notice">
              Для входа настройте Firebase в .env.local. Деморежим доступен без
              настройки.
            </p>
          )}
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          {notice && <p role="status">{notice}</p>}
          <button className="primary-button" disabled={busy || !isConfigured}>
            {busy
              ? registering
                ? "Создание аккаунта…"
                : "Подключение…"
              : registering
                ? "Зарегистрироваться"
                : "Войти"}
          </button>
          <button
            type="button"
            className="secondary-button"
            disabled={busy}
            onClick={toggleMode}
          >
            {registering
              ? "Уже есть аккаунт? Войти"
              : "Нет аккаунта? Зарегистрироваться"}
          </button>
          {!registering && (
            <button
              type="button"
              className="secondary-button"
              disabled={busy || !isConfigured}
              onClick={() => void reset()}
            >
              Восстановить пароль
            </button>
          )}
          <button
            type="button"
            className="secondary-button"
            onClick={onDemo}
            disabled={busy}
          >
            Открыть деморежим
          </button>
          <p className="muted">
            Деморежим хранит учебные данные только в этом браузере.
          </p>
        </form>
      </section>
    </main>
  );
}
