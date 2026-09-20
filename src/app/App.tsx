import "../styles/reset.css";
import "../styles/newStyle.css";
import "../styles/complete.css";
import { useCallback, useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { MotionConfig } from "motion/react";
import { auth } from "../services/firebase/firebase";
import { AuthPage } from "../features/auth/AuthPage";
import {
  demoRepository,
  errorMessage,
  firebaseRepository,
  type Repository,
} from "../services/accountingService";
import Dashboard from "./Dashboard";
function Session({
  user,
  demo,
  onLogout,
}: {
  user: User | null;
  demo: boolean;
  onLogout: () => void;
}) {
  const [repository, setRepository] = useState<Repository | null>(null),
    [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    let active: Repository | undefined;
    async function connect() {
      try {
        const repo = demo
          ? demoRepository()
          : await firebaseRepository(user!.uid);
        if (cancelled) {
          repo.close();
          return;
        }
        active = repo;
        setRepository(repo);
      } catch (e) {
        if (!cancelled) setError(errorMessage(e));
      }
    }
    void connect();
    return () => {
      cancelled = true;
      active?.close();
    };
  }, [user, demo]);
  if (error)
    return (
      <div className="auth-page">
        <div className="product-form-modal">
          <h2>Не удалось открыть данные</h2>
          <p role="alert" className="error">
            {error}
          </p>
          <button
            className="secondary-button"
            onClick={() => window.location.reload()}
          >
            Повторить
          </button>
          <button className="secondary-button" onClick={onLogout}>
            Выйти
          </button>
        </div>
      </div>
    );
  return repository ? (
    <Dashboard
      repository={repository}
      email={demo ? "Деморежим" : (user?.email ?? "Личный аккаунт")}
      demo={demo}
      onLogout={onLogout}
    />
  ) : (
    <p className="empty" role="status">
      Подключение к базе…
    </p>
  );
}
export default function App() {
  const [user, setUser] = useState<User | null>(null),
    [loading, setLoading] = useState(Boolean(auth)),
    [demo, setDemo] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(
      auth,
      (current) => {
        setUser(current);
        setLoading(false);
      },
      (e) => {
        setError(errorMessage(e));
        setLoading(false);
      },
    );
  }, []);
  const logout = useCallback(() => {
    if (demo) {
      setDemo(false);
      return;
    }
    if (auth) void signOut(auth).catch((e) => setError(errorMessage(e)));
  }, [demo]);
  return (
    <MotionConfig reducedMotion="user">
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {loading ? (
        <p className="empty">Загрузка…</p>
      ) : demo || user ? (
        <Session
          key={demo ? "demo" : user?.uid}
          user={user}
          demo={demo}
          onLogout={logout}
        />
      ) : (
        <AuthPage onDemo={() => setDemo(true)} />
      )}
    </MotionConfig>
  );
}
