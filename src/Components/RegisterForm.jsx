import { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function RegisterForm(props) {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [error, setError] = useState("");


  const handleChangeEmail = (e) => {
    setEmail(e.target.value)
  }

  const handleChangePassword = (e) => {
    if (e.target.name === "password") {
      setPassword(e.target.value)
    } else {
      setSecondPassword(e.target.value)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== secondPassword) {
      setError("Пароли не совпадают");
      return;
    }

    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // пользователь автоматически залогинен
    } catch (err) {
      setError(err.message);
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
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={handleChangePassword}
          placeholder="***********"
        />
        <input
          type="password"
          name="secondPassword"
          value={secondPassword}
          onChange={handleChangePassword}
          placeholder="***********"
        />
        {error && <p className="error">{error}</p>}
      </label>
      <button type="submit" className="confirmButton">Зарегистрироваться</button>
      <div className="withoutAcc"><a href="" onClick={() => props.cb()}>Есть аккаунт</a></div>
    </form>
  </div>
}