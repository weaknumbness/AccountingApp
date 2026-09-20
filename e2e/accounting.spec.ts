import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Открыть деморежим" }).click();
  await expect(page.locator("[data-product-id]")).toHaveCount(3);
});
test("sale changes only its card; persistence, receipt, reports and archive work", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const first = page.locator('[data-product-id="demo-0"]');
  const other = page.locator('[data-product-id="demo-1"]');
  await other.evaluate((element) => {
    element.setAttribute("data-test-sentinel", "preserved");
    const observer = new MutationObserver((records) => {
      if (records.length) element.setAttribute("data-test-mutated", "yes");
    });
    observer.observe(element, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  });
  await first.getByRole("button", { name: /Продать.*для друзей/ }).click();
  await expect(first.locator("[data-stock]")).toHaveText("9 шт.");
  await expect(other).toHaveAttribute("data-test-sentinel", "preserved");
  await expect(other).not.toHaveAttribute("data-test-mutated", "yes");
  await page
    .getByRole("button", { name: "Продажи", exact: true })
    .first()
    .click();
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("Для друзей");
  await expect(page.locator("tbody")).toContainText("65,00");
  await page.getByRole("button", { name: "Товары", exact: true }).click();
  await page.getByRole("button", { name: "Поступление", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Количество, шт.").fill("5");
  await dialog.getByLabel("Закупочная цена за штуку, ₽").fill("120");
  await dialog.getByRole("button", { name: "Принять поступление" }).click();
  await expect(first.locator("[data-stock]")).toHaveText("14 шт.");
  await page.reload();
  await page.getByRole("button", { name: "Открыть деморежим" }).click();
  await expect(first.locator("[data-stock]")).toHaveText("14 шт.");
  await first.getByRole("button", { name: /Действия/ }).click();
  await first.getByRole("button", { name: "В архив", exact: true }).click();
  await expect(first).toHaveCount(0);
  await page.getByLabel("Архив товаров").check();
  await expect(first).toHaveCount(1);
  await first.getByRole("button", { name: /Действия/ }).click();
  await first.getByRole("button", { name: "Восстановить" }).click();
  await page.getByLabel("Архив товаров").uncheck();
  await expect(first).toHaveCount(1);
  await page.getByRole("button", { name: "Отчёты", exact: true }).click();
  await expect(page.locator("tbody")).toContainText("Лейс с крабом");
  await expect(page.locator("tbody")).toContainText("165,00");
  expect(errors).toEqual([]);
});
test("creates category and a one-price product; form validation and keyboard close", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Категории", exact: true }).click();
  await page.getByRole("button", { name: "Добавить категорию" }).click();
  await page
    .getByRole("dialog")
    .getByLabel("Название", { exact: true })
    .fill("Батончики");
  await page.getByRole("button", { name: "Сохранить категорию" }).click();
  await expect(page.getByRole("heading", { name: "Батончики" })).toBeVisible();
  await page.getByRole("button", { name: "Товары", exact: true }).click();
  await page.getByRole("button", { name: "Добавить товар" }).click();
  let d = page.getByRole("dialog");
  await d.getByLabel("Название товара").fill("Тестовый батончик");
  await d
    .getByRole("combobox", { name: "Категория", exact: true })
    .selectOption({ label: "Батончики" });
  await d.getByLabel("Обычная цена, ₽", { exact: true }).fill("125,50");
  await d.getByRole("button", { name: "Сохранить товар" }).click();
  const card = page
    .locator("[data-product-id]")
    .filter({ hasText: "Тестовый батончик" });
  await expect(card).toBeVisible();
  await expect(card.locator(".card-buttons button")).toHaveCount(1);
  await expect(card.locator(".card-buttons button")).toBeDisabled();
  await card.getByRole("button", { name: /Действия/ }).click();
  await card.getByRole("button", { name: "Редактировать" }).click();
  d = page.getByRole("dialog");
  await expect(d.getByLabel("Цена для друзей, ₽ — необязательно")).toHaveValue(
    "",
  );
  await d.getByLabel("Название товара").fill("Изменённый батончик");
  await d.getByRole("button", { name: "Сохранить товар" }).click();
  await expect(
    page.getByRole("heading", { name: "Изменённый батончик" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Добавить товар" }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
test("responsive layout and original design", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: "test-results/desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator("[data-product-id]")).toHaveCount(3);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: "test-results/mobile.png", fullPage: true });
});

test('toast auto-dismisses, supports manual closing and financial values align', async ({ page }) => {
  const card = page.locator('[data-product-id="demo-0"]');
  await card.getByRole('button', { name: /Продать.*для друзей/ }).click();
  const toast = page.locator('.toast-region');
  await expect(toast).toContainText('Продажа сохранена.');
  await expect(page.locator('.save-status')).toHaveCount(0);
  await expect(page.locator('.toast')).toHaveCount(0, { timeout: 5000 });
  await card.getByRole('button', { name: /Продать.*для друзей/ }).click();
  await expect(page.locator('.toast')).toHaveCount(1);
  await page.getByRole('button', { name: 'Закрыть уведомление' }).click();
  await expect(page.locator('.toast')).toHaveCount(0);
  await page.getByRole('button', { name: 'Категории', exact: true }).click();
  await expect(page.locator('.category')).toHaveCount(2);
  // Wait for the entrance to complete before comparing physical baselines.
  await expect.poll(() => page.locator('.category').first().evaluate(e => getComputedStyle(e).opacity)).toBe('1');
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    const positions = await page.locator('.category-financials').first().locator('strong').evaluateAll(nodes => nodes.map(n => ({ top:n.getBoundingClientRect().top, height:n.getBoundingClientRect().height })));
    expect(Math.abs(positions[0]!.top - positions[1]!.top)).toBeLessThan(1);
    expect(Math.abs(positions[0]!.height - positions[1]!.height)).toBeLessThan(1);
  }
  await page.screenshot({ path: 'test-results/categories-update.png', fullPage: true });
});

test('archived deletion preserves revenue and history; avatar opens profile with logout', async ({ page }) => {
  const card = page.locator('[data-product-id="demo-0"]');
  await card.getByRole('button', { name: /Продать.*для друзей/ }).click();
  const revenue = await page.locator('.stat').nth(2).innerText();
  await card.getByRole('button', { name: /Действия/ }).click();
  await expect(card.getByRole('button', { name: 'Удалить', exact: true })).toHaveCount(0);
  await card.getByRole('button', { name: 'В архив', exact: true }).click();
  await expect(card).toHaveCount(0);
  await page.getByLabel('Архив товаров').check();
  await card.getByRole('button', { name: /Действия/ }).click();
  await card.getByRole('button', { name: 'Удалить', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Отмена' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(card).toBeVisible();
  await card.getByRole('button', { name: /Действия/ }).click();
  await card.getByRole('button', { name: 'Удалить', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Удалить товар', exact: true }).click();
  await expect(card).toHaveCount(0);
  await expect(page.locator('.stat').nth(2)).toHaveText(revenue, { useInnerText: true });
  await page.reload();
  await page.getByRole('button', { name: 'Открыть деморежим' }).click();
  await page.getByLabel('Архив товаров').check();
  await expect(card).toHaveCount(0);
  await expect(page.locator('.stat').nth(2)).toHaveText(revenue, { useInnerText: true });
  await page.getByRole('button', { name: 'Продажи', exact: true }).click();
  await expect(page.locator('tbody')).toContainText('Лейс с крабом');
  await expect(page.locator('tbody')).toContainText('165,00');
  await expect(page.locator('.side-bar')).not.toContainText('НАСТРОЙКИ');
  await expect(page.locator('.side-bar')).not.toContainText('Выйти');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Открыть профиль' }).click();
  await expect(page.getByRole('heading', { name: 'Профиль', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Выйти из аккаунта' }).click();
  await expect(page.getByRole('button', { name: 'Открыть деморежим' })).toBeVisible();
});
