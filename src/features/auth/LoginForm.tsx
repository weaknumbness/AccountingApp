import { useState, type FormEvent, type ChangeEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase/firebase";

type LoginFormProps = {
  onToggleMode: () => void;
};

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError("Неверный email или пароль");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <h2>AccountingApp</h2>

        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Email"
          required
        />

        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Пароль"
          required
        />

        {error && <p>{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Вход..." : "Войти"}
        </button>

        <button type="button" onClick={onToggleMode}>
          Нет аккаунта? Зарегистрироваться
        </button>
      </form>
    </section>
  );
}