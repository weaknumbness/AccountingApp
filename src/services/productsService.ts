import { ref, set, remove, update, onValue } from "firebase/database";
import type { Product, ProductFormState } from "../types";
import { auth, db } from "./firebase/firebase";

export const addProduct = (data: ProductFormState) => {
  const uid = auth.currentUser?.uid;

  if (!uid) return;

  const id = crypto.randomUUID();

  set(ref(db, `users/${uid}/cards/${id}`), {
    id,
    ...data,
    sold: 0,
    profit: 0,
  });
};