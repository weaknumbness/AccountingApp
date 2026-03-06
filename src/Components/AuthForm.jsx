import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function AuthForm(props) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState("");

  const handleChangeEmail = (e) => {
    setEmail(e.target.value)
  }

  const handleChangePassword = (e) => {
    setPassword(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // пользователь залогинен автоматически
    } catch (err) {
      setError("Неверный email или пароль");
    }
  };

  return <div className="AuthForm">
    <form onSubmit={handleSubmit}>
      <h2>Accounting App</h2>
      <label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={handleChangeEmail}
          placeholder="Danil_Kolbasenko2017@mail.ru"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChangePassword}
          placeholder="***********"
          required
        />
        {error && <p className="error">{error}</p>}
      </label>
      <button type="submit" className="confirmButton">Войти</button>
      <div className="withoutAcc"><a href="#" onClick={() => props.cb()}>Нет аккаунта</a></div>
    </form>
  </div>
}