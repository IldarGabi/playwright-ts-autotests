import { test, expect } from '@playwright/test';

const FRUIT_URL = '*/**/api/v1/fruits';

test.describe('Подмена ответов сервера', () => {
    test('Показывает фрукты из подменённого ответа', async ({ page }) => {
        await page.route(FRUIT_URL, async (route) => {
            await route.fulfill({
                json: [{ name: 'Тестовый фрукт', id: 1 }]
            });
        });

        await page.goto('https://demo.playwright.dev/api-mocking');
        await expect(page.getByText('Тестовый фрукт')).toBeVisible();
    });
    test('Проверка пустого массива в ответе', async ({ page }) => {
        await page.route(FRUIT_URL, async (route) => {
            await route.fulfill({
                json: [],
            });
        });

        const responsePromise = page.waitForResponse(FRUIT_URL);   // начинаем ждать до goto

        await page.goto('https://demo.playwright.dev/api-mocking');
        await responsePromise;
        await expect(page.locator('li')).toHaveCount(0);
    });
    test('Проверка 500 кода от сервера', async ({ page }) => {
        await page.route(FRUIT_URL, async (route) => {
            await route.fulfill({
                status: 500, body: "Internal Server Error"
            });
        });

        await page.goto('https://demo.playwright.dev/api-mocking');
        await expect(page.locator('li')).toHaveCount(0);
    });
    test('Проверка измененного ответа', async ({ page }) => {
        await page.route(FRUIT_URL, async (route) => {
            const resp = await route.fetch();
            const respJson = await resp.json();

            respJson.push({ name: 'Ананас-мутант', id: 100 });
            await route.fulfill({ response: resp, json: respJson });
        });

        await page.goto('https://demo.playwright.dev/api-mocking');
        await expect(page.getByText('Ананас-мутант', { exact: true })).toBeVisible();
        await expect(page.getByText('Strawberry', { exact: true })).toBeVisible();
    });
});