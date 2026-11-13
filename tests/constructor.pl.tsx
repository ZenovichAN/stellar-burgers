import { test, expect, type Page, type Locator } from '@playwright/test';

const BUN = 'Тестовая булка Марс';
const FILLING = 'Тестовая котлета Венера';
const ORDER_NUMBER = 123456;

const ingredientCard = (page: Page, name: string): Locator =>
  page
    .locator('li')
    .filter({ hasText: name })
    .filter({
      has: page.getByText('Добавить', { exact: true }),
    })
    .first();

const addIngredient = async (page: Page, name: string): Promise<void> => {
  await ingredientCard(page, name).getByText('Добавить', { exact: true }).click();
};

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR('tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false,
      notFound: 'abort',
    });

    await page.routeFromHAR('tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false,
      notFound: 'abort',
    });

    await page.routeFromHAR('tests/hars/order.har', {
      url: '**/api/orders',
      update: false,
      notFound: 'abort',
    });
  });

  test('Добавление булки и начинки', async ({ page }) => {
    await page.goto('/');

    const constructor = page.getByTestId('burger-constructor');

    const topBun = constructor.getByText(`${BUN} (верх)`);
    const bottomBun = constructor.getByText(`${BUN} (низ)`);
    const filling = constructor.locator('li').filter({
      hasText: FILLING,
    });

    await expect(topBun).toHaveCount(0);
    await expect(bottomBun).toHaveCount(0);

    await addIngredient(page, BUN);

    await expect(topBun).toBeVisible();
    await expect(bottomBun).toBeVisible();

    await expect(filling).toHaveCount(0);

    await addIngredient(page, FILLING);

    await expect(filling).toHaveCount(1);
  });

  test('Открытие и закрытие модального окна ингредиента', async ({ page }) => {
    await page.goto('/');

    const modal = page.locator('#modals');

    await expect(
      modal.getByRole('heading', {
        name: 'Детали ингредиента',
      })
    ).toHaveCount(0);

    await ingredientCard(page, BUN).getByText(BUN, { exact: true }).click();

    await expect(
      modal.getByRole('heading', {
        name: 'Детали ингредиента',
      })
    ).toBeVisible();

    await expect(modal.getByText(BUN, { exact: true })).toBeVisible();

    await expect(modal.getByText('200', { exact: true })).toBeVisible();

    await expect(page).toHaveURL(/\/ingredients\/test-bun-001$/);

    await modal.getByRole('button', { name: 'Закрыть' }).click();

    await expect(modal.getByText(BUN, { exact: true })).toHaveCount(0);

    await expect(page).toHaveURL(/\/$/);
  });

  test('Закрытие модального окна по оверлею', async ({ page }) => {
    await page.goto('/');

    await ingredientCard(page, BUN).getByText(BUN, { exact: true }).click();

    await expect(page.locator('#modals').getByText(BUN, { exact: true })).toBeVisible();

    await page.locator('#modals > div:last-child').click({
      position: { x: 5, y: 5 },
    });

    await expect(page.locator('#modals').getByText(BUN, { exact: true })).toHaveCount(0);

    await expect(page).toHaveURL(/\/$/);
  });

  test('Оформление заказа и очистка конструктора', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');

      document.cookie = 'accessToken=Bearer mock-access-token; path=/';
    });

    await page.goto('/');

    const constructor = page.getByTestId('burger-constructor');
    const modal = page.locator('#modals');

    await expect(page.getByText(BUN, { exact: true })).toBeVisible();

    await addIngredient(page, BUN);
    await addIngredient(page, FILLING);

    // Перед оформлением заказа конструктор заполнен
    await expect(constructor.getByText(`${BUN} (верх)`)).toBeVisible();
    await expect(constructor.getByText(`${BUN} (низ)`)).toBeVisible();

    await expect(constructor.locator('li').filter({ hasText: FILLING })).toHaveCount(1);

    // Модального окна с номером заказа еще нет
    await expect(
      modal.getByRole('heading', {
        name: String(ORDER_NUMBER),
      })
    ).toHaveCount(0);

    const orderRequestPromise = page.waitForRequest(
      (request) => request.url().endsWith('/api/orders') && request.method() === 'POST'
    );

    await page
      .getByRole('button', {
        name: 'Оформить заказ',
      })
      .click();

    const orderRequest = await orderRequestPromise;

    expect(orderRequest.postDataJSON()).toEqual({
      ingredients: ['test-bun-001', 'test-main-002', 'test-bun-001'],
    });

    await expect(
      modal.getByRole('heading', {
        name: String(ORDER_NUMBER),
      })
    ).toBeVisible();

    // После оформления заказа конструктор очищен
    await expect(page.getByText('Выберите булки').first()).toBeVisible();
    await expect(page.getByText('Выберите начинку')).toBeVisible();

    await modal.getByRole('button', { name: 'Закрыть' }).click();

    await expect(
      modal.getByRole('heading', {
        name: String(ORDER_NUMBER),
      })
    ).toHaveCount(0);
  });
});
