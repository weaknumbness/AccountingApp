import { useState, type FormEvent, type ChangeEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase/firebase";

type RegisterFormProps = {
  onToggleMode: () => void;
};

export function RegisterForm({ onToggleMode }: RegisterFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSecondPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSecondPassword(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== secondPassword) {
      setError("Пароли не совпадают");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch {
      setError("Не удалось зарегистрироваться");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section>
      <form onSubmit={handleSubmit}>
        <h2>Регистрация</h2>

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

        <input
          type="password"
          value={secondPassword}
          onChange={handleSecondPasswordChange}
          placeholder="Повторите пароль"
          required
        />

        {error && <p>{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
        </button>

        <button type="button" onClick={onToggleMode}>
          Уже есть аккаунт? Войти
        </button>
      </form>
    </section>
  );
}