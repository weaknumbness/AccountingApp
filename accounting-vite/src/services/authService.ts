import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase/firebase";

export async function registerAccount(
  email: string,
  password: string,
  confirmation: string,
) {
  if (!auth) throw new Error("Firebase не настроен.");
  if (password !== confirmation) throw new Error("Пароли не совпадают.");
  if (password.length < 6)
    throw new Error("Пароль должен содержать не менее 6 символов.");
  // Firebase signs the new user in. App's existing auth subscription opens
  // users/<new uid>/accountingV2, never the previous account or demo store.
  return createUserWithEmailAndPassword(auth, email.trim(), password);
}
