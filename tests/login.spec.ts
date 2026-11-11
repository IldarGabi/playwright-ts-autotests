import { test, expect } from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'


test.describe('Логин', () => {
    test('Успешный логин пользователя', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.open();
        await loginPage.login('standard_user', 'secret_sauce');

        await expect(page).toHaveURL('/inventory.html');
        await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    })
})