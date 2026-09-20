import { test, expect } from "@playwright/test";
test("registration validates confirmation, handles occupied email and switches to login", async ({
  page,
}) => {
  let requests = 0;
  // No accounts are created on the real Firebase project during this check.
  await page.route("**/identitytoolkit.googleapis.com/**", async (route) => {
    requests++;
    await route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({
        error: {
          code: 400,
          message: "EMAIL_EXISTS",
          errors: [
            { message: "EMAIL_EXISTS", domain: "global", reason: "invalid" },
          ],
        },
      }),
    });
  });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Нет аккаунта? Зарегистрироваться" })
    .click();
  await page.getByLabel("Email", { exact: true }).fill("test@example.com");
  await page.getByLabel("Пароль", { exact: true }).fill("Secret123!");
  await page.getByLabel("Повторите пароль").fill("Other123!");
  await page
    .getByRole("button", { name: "Зарегистрироваться", exact: true })
    .click();
  await expect(page.getByRole("alert")).toHaveText("Пароли не совпадают.");
  expect(requests).toBe(0);
  await page.getByLabel("Повторите пароль").fill("Secret123!");
  await page
    .getByRole("button", { name: "Зарегистрироваться", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("уже зарегистрирован");
  expect(requests).toBe(1);
  await page.getByRole("button", { name: "Уже есть аккаунт? Войти" }).click();
  await expect(page.getByLabel("Повторите пароль")).toHaveCount(0);
  await expect(page.getByLabel("Email", { exact: true })).toHaveValue(
    "test@example.com",
  );
  await expect(page.getByLabel("Пароль", { exact: true })).toHaveValue("");
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Восстановить пароль" }),
  ).toBeVisible();
});
