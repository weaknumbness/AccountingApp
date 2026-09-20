import { beforeEach, describe, expect, it, vi } from "vitest";
const { createUser } = vi.hoisted(() => ({ createUser: vi.fn() }));
vi.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: createUser,
}));
vi.mock("../src/services/firebase/firebase", () => ({
  auth: { name: "test-auth" },
  db: null,
}));
import { registerAccount } from "../src/services/authService";
import { errorMessage } from "../src/services/accountingService";
import { migrateLegacy } from "../src/domain/accounting";
beforeEach(() => {
  createUser.mockReset();
});
describe("Registration", () => {
  it("sends trimmed email but unchanged password to Firebase", async () => {
    createUser.mockResolvedValue({ user: { uid: "new-account" } });
    const result = await registerAccount(
      " person@example.com ",
      " Secret12! ",
      " Secret12! ",
    );
    expect(createUser).toHaveBeenCalledExactlyOnceWith(
      { name: "test-auth" },
      "person@example.com",
      " Secret12! ",
    );
    expect(result.user.uid).toBe("new-account");
  });
  it("rejects mismatched confirmation and short passwords before network calls", async () => {
    await expect(
      registerAccount("p@example.com", "secret1", "secret2"),
    ).rejects.toThrow("не совпадают");
    await expect(
      registerAccount("p@example.com", "12345", "12345"),
    ).rejects.toThrow("6 символов");
    expect(createUser).not.toHaveBeenCalled();
  });
  it("reports existing email and password policy errors clearly", async () => {
    createUser.mockRejectedValue(
      Object.assign(new Error("Email exists"), {
        code: "auth/email-already-in-use",
      }),
    );
    await expect(
      registerAccount("p@example.com", "secret1", "secret1"),
    ).rejects.toThrow("Email exists");
    expect(errorMessage({ code: "auth/email-already-in-use" })).toContain(
      "уже зарегистрирован",
    );
    expect(
      errorMessage({ code: "auth/password-does-not-meet-requirements" }),
    ).toContain("Пароль не соответствует");
  });
  it("initializes absent user data as an empty independent inventory", () => {
    const a = migrateLegacy(null, 100);
    const b = migrateLegacy(null, 101);
    expect(a.products).toEqual({});
    expect(a.categories).toEqual({});
    expect(a.sales).toEqual({});
    expect(a.legacyImported).toBe(false);
    expect(a.products).not.toBe(b.products);
  });
});
