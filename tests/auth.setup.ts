import { test as setup, expect } from "@playwright/test";
import { LoginPage } from '../pages/LoginPage'

const authFile = 'playwright/.auth/user.json';

setup('авторизация типового пользователя', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(loginPage.loginTitleText).toHaveText('Products');
    await page.context().storageState({ path: authFile })

})