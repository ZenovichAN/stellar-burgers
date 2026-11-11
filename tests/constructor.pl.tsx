
import { test, expect, type Page } from '@playwright/test';

const BUN = 'Тестовая булка Марс';
const FILLING = 'Тестовая котлета Венера';
const ORDER_NUMBER = 123456;

const ingredientCard = (page: Page, name: string) =>
  page
    .locator('li')
    .filter({ hasText: name })
    .filter({
      has: page.getByText('Добавить', { exact: true })
    })
    .first();

const addIngredient = async (
  page: Page,
  name: string
) => {
  await ingredientCard(page, name)
    .getByText('Добавить', { exact: true })
    .click();
};

test.describe('Конструктор бургера', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(
      'tests/hars/ingredients.har',
      {
        url: '**/api/ingredients',
        update: false,
        notFound: 'abort'
      }
    );

    await page.routeFromHAR(
      'tests/hars/user.har',
      {
        url: '**/api/auth/user',
        update: false,
        notFound: 'abort'
      }
    );

    await page.routeFromHAR(
      'tests/hars/order.har',
      {
        url: '**/api/orders',
        update: false,
        notFound: 'abort'
      }
    );
  });

  test('Добавление булки и начинки', async ({
    page
  }) => {
    await page.goto('/');

    await addIngredient(page, BUN);

    await expect(
      page.getByText(`${BUN} (верх)`)
    ).toBeVisible();

    await expect(
      page.getByText(`${BUN} (низ)`)
    ).toBeVisible();

    await addIngredient(page, FILLING);

    await expect(
      page.locator('li').filter({
        hasText: FILLING
      })
    ).toHaveCount(2);
  });

  test('Открытие и закрытие модального окна ингредиента', async ({
    page
  }) => {
    await page.goto('/');

    await ingredientCard(page, BUN)
      .getByText(BUN, { exact: true })
      .click();

    const modal = page.locator('#modals');

    await expect(
      modal.getByRole('heading', {
        name: 'Детали ингредиента'
      })
    ).toBeVisible();

    // Проверяем данные выбранной булки.
    await expect(
      modal.getByText(BUN, { exact: true })
    ).toBeVisible();

    await expect(
      modal.getByText('200', { exact: true })
    ).toBeVisible();

    await expect(page).toHaveURL(
      /\/ingredients\/test-bun-001$/
    );

    await modal
      .getByRole('button', { name: 'Закрыть' })
      .click();

    await expect(
      modal.getByText(BUN, { exact: true })
    ).toHaveCount(0);

    await expect(page).toHaveURL(/\/$/);
  });

  test('Закрытие модального окна по оверлею', async ({
    page
  }) => {
    await page.goto('/');

    await ingredientCard(page, BUN)
      .getByText(BUN, { exact: true })
      .click();

    await expect(
      page.locator('#modals').getByText(
        BUN,
        { exact: true }
      )
    ).toBeVisible();

    await page
      .locator('#modals > div:last-child')
      .click({
        position: { x: 5, y: 5 }
      });

    await expect(
      page.locator('#modals').getByText(
        BUN,
        { exact: true }
      )
    ).toHaveCount(0);

    await expect(page).toHaveURL(/\/$/);
  });

  test('Оформление заказа и очистка конструктора', async ({
    page
  }) => {
    // Токены устанавливаются до открытия сайта.
    await page.addInitScript(() => {
      localStorage.setItem(
        'refreshToken',
        'mock-refresh-token'
      );

      document.cookie =
        'accessToken=Bearer mock-access-token; path=/';
    });

    await page.goto('/');

    await expect(
      page.getByText(BUN, { exact: true })
    ).toBeVisible();

    await addIngredient(page, BUN);
    await addIngredient(page, FILLING);

    // Проверяем содержимое отправленного заказа.
    const orderRequestPromise =
      page.waitForRequest((request) =>
        request.url().endsWith('/api/orders') &&
        request.method() === 'POST'
      );

    await page
      .getByRole('button', {
        name: 'Оформить заказ'
      })
      .click();

    const orderRequest = await orderRequestPromise;

    expect(orderRequest.postDataJSON()).toEqual({
      ingredients: [
        'test-bun-001',
        'test-main-002',
        'test-bun-001'
      ]
    });

    const modal = page.locator('#modals');

    await expect(
      modal.getByRole('heading', {
        name: String(ORDER_NUMBER)
      })
    ).toBeVisible();

    // Проверяем очистку конструктора.
    await expect(
      page.getByText('Выберите булки').first()
    ).toBeVisible();

    await expect(
      page.getByText('Выберите начинку')
    ).toBeVisible();

    await modal
      .getByRole('button', { name: 'Закрыть' })
      .click();

    await expect(
      modal.getByRole('heading', {
        name: String(ORDER_NUMBER)
      })
    ).toHaveCount(0);
  });
});
