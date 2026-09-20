import { get, onValue, ref, runTransaction } from "firebase/database";
import { db } from "./firebase/firebase";
import {
  applyCommand,
  emptyState,
  migrateLegacy,
  parseState,
} from "../domain/accounting";
import type { AccountingState, Command } from "../domain/accounting";
export interface Repository {
  subscribe: (
    next: (s: AccountingState) => void,
    error: (e: unknown) => void,
  ) => () => void;
  execute: (cmd: Command) => Promise<void>;
  close: () => void;
}
export async function firebaseRepository(uid: string): Promise<Repository> {
  if (!db) throw new Error("Firebase не настроен.");
  const path = ref(db, `users/${uid}/accountingV2`);
  const current = await get(path);
  if (!current.exists()) {
    // Legacy data is copied, never overwritten. Repeated initialization cannot reset v2.
    const old = await get(ref(db, `users/${uid}`));
    const raw: unknown = old.val();
    const migrated = migrateLegacy(raw, Date.now());
    await runTransaction(path, (value) => value ?? migrated, {
      applyLocally: false,
    });
  }
  return {
    subscribe(next, error) {
      return onValue(
        path,
        (snapshot) => {
          try {
            const raw: unknown = snapshot.val();
            next(parseState(raw));
          } catch (e) {
            error(e);
          }
        },
        error,
      );
    },
    async execute(cmd) {
      const result = await runTransaction(
        path,
        (value: unknown) => {
          // The SDK may first call with an empty local cache; wait for the actual state.
          if (value === null) return null;
          return applyCommand(parseState(value), cmd);
        },
        { applyLocally: false },
      );
      if (!result.committed || result.snapshot.val() === null)
        throw new Error("Операция не сохранена. Перезагрузите страницу.");
    },
    close() {},
  };
}
export function demoRepository(): Repository {
  const key = "accounting-demo-v2";
  const saved = localStorage.getItem(key);
  let state = saved ? parseState(JSON.parse(saved)) : emptyState();
  if (!saved) {
    state = applyCommand(state, {
      type: "category",
      id: "chips",
      input: { title: "Чипсы", color: "#FEF3C7", icon: "" },
    });
    state = applyCommand(state, {
      type: "category",
      id: "drinks",
      input: { title: "Напитки", color: "#DBEAFE", icon: "" },
    });
    for (const [i, title] of [
      "Лейс с крабом",
      "Сметана и лук",
      "Кола",
    ].entries()) {
      const id = `demo-${i}`;
      state = applyCommand(state, {
        type: "product",
        id,
        input: {
          title,
          categoryId: i === 2 ? "drinks" : "chips",
          imageUrl: "",
          price: i === 2 ? 12000 : 17500,
          friendPrice: i === 2 ? 10000 : 16500,
        },
      });
      state = applyCommand(state, {
        type: "receipt",
        id: `receipt-${id}`,
        productId: id,
        quantity: 10,
        unitCost: 10000,
        createdAt: Date.now(),
      });
    }
    localStorage.setItem(key, JSON.stringify(state));
  }
  const listeners = new Set<(s: AccountingState) => void>();
  const onStorage = (e: StorageEvent) => {
    if (e.key === key && e.newValue) {
      try {
        state = parseState(JSON.parse(e.newValue));
        listeners.forEach((fn) => fn(state));
      } catch {
        /* Keep last valid demo snapshot. */
      }
    }
  };
  window.addEventListener("storage", onStorage);
  return {
    subscribe(next) {
      listeners.add(next);
      next(state);
      return () => {
        listeners.delete(next);
      };
    },
    async execute(cmd) {
      const next = applyCommand(state, cmd);
      localStorage.setItem(key, JSON.stringify(next));
      state = next;
      listeners.forEach((fn) => fn(state));
    },
    close() {
      window.removeEventListener("storage", onStorage);
    },
  };
}
export function errorMessage(error: unknown): string {
  const code =
    error && typeof error === "object" && "code" in error
      ? String(error.code)
      : "";
  if (/permission.denied|PERMISSION_DENIED/i.test(code))
    return "Нет доступа к базе. Проверьте правила Firebase для своего аккаунта.";
  if (/auth\/(invalid-credential|wrong-password|user-not-found)/.test(code))
    return "Неверный email или пароль.";
  if (code === "auth/email-already-in-use")
    return "Этот email уже зарегистрирован. Войдите или восстановите пароль.";
  if (code === "auth/invalid-email") return "Проверьте правильность email.";
  if (
    code === "auth/weak-password" ||
    code === "auth/password-does-not-meet-requirements"
  )
    return "Пароль не соответствует требованиям. Используйте более длинный пароль с буквами разного регистра, цифрами и специальными символами.";
  if (code === "auth/operation-not-allowed")
    return "Вход по email и паролю отключён в настройках Firebase Authentication.";
  if (code === "auth/user-disabled") return "Этот аккаунт отключён.";
  if (/network|unavailable/i.test(code))
    return "Не удалось подключиться. Проверьте интернет.";
  if (/too-many-requests/.test(code))
    return "Слишком много попыток. Повторите позже.";
  if (error instanceof Error && error.name !== "ZodError") return error.message;
  return "Некорректные данные. Проверьте поля; если ошибка при загрузке — структуру базы.";
}
