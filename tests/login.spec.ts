import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';


let loginPage: LoginPage;

const errorLoginCases = [
    {
        name: 'заблокированный пользователь',
        login: 'locked_out_user',
        password: 'secret_sauce',
        errorMessage: 'Epic sadface: Sorry, this user has been locked out.',
    },
    {
        name: 'неверный пароль',
        login: 'standard_user',
        password: 'wrong',
        errorMessage: 'Epic sadface: Username and password do not match any user in this service',
    },
    {
        name: 'пустой логин',
        login: '',
        password: 'secret_sauce',
        errorMessage: 'Epic sadface: Username is required',
    },
    {
        name: 'пустой пароль',
        login: 'standard_user',
        password: '',
        errorMessage: 'Epic sadface: Password is required',
    },
];

test.describe('Проверка логина', () => {
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.open();
    });
    test('Успешный логин пользователя', async ({ page }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await expect.soft(page).toHaveURL('/inventory.html');
        await expect.soft(loginPage.loginTitleText).toHaveText('Products');
    });

    for (const errorLoginCase of errorLoginCases) {
        test(`Неуспешный логин: ${errorLoginCase.name}`, async () => {
            await loginPage.login(errorLoginCase.login, errorLoginCase.password);
            await expect(loginPage.errorText).toHaveText(errorLoginCase.errorMessage);
        });
    }
});