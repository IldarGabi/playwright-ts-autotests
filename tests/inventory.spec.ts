import { test, expect } from '../fixtures/pagesFixture';

type ItemList = string[];

const productIdstForAdd: ItemList = [
    'sauce-labs-bike-light',
    'test.allthethings()-t-shirt-(red)',
];
const productIdsForRemove: ItemList = [
    'sauce-labs-bike-light',
];

test.describe('Проверка добавления и удаление товаров в корзину', () => {
    test.beforeEach(async ({ loginPage, inventoryPage }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await inventoryPage.addItems(productIdstForAdd);
    });
    test('Добавлено 2 товара в корзину', async ({ inventoryPage }) => {
        await expect(inventoryPage.cartBadge).toHaveText('2');
    });
    test('Удален 1 товар из корзины', async ({ inventoryPage }) => {
        await inventoryPage.removeItems(productIdsForRemove);
        await expect(inventoryPage.cartBadge).toHaveText('1');
    });
    test('Удалены все товары из корзины', async ({ inventoryPage }) => {
        await inventoryPage.removeItems(productIdstForAdd);
        await expect(inventoryPage.cartBadge).toBeHidden();
    });
});

