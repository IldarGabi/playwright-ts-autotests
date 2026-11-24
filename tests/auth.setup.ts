import { test as setup, expect } from "@playwright/test";
import { LoginPage } from '../pages/LoginPage'
import { InventoryPage } from '../pages/InventoryPage'

const authFile = 'playwright/.auth/user.json';

setup('авторизация типового пользователя', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(inventoryPage.title).toHaveText('Products');
    await page.context().storageState({ path: authFile })

})