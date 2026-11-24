import { test, expect } from '../fixtures/pagesFixture';


type ErrorCase = {
    name: string,
    login: string,
    password: string,
    errorMessage: string,
};

const errorLoginCases: ErrorCase[] = [
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
    test('Успешный логин пользователя', async ({ loginPage, inventoryPage, page }) => {
        await loginPage.login('standard_user', 'secret_sauce');
        await expect.soft(page).toHaveURL('/inventory.html');
        await expect.soft(inventoryPage.title).toHaveText('Products');
    });

    for (const errorLoginCase of errorLoginCases) {
        test(`Неуспешный логин: ${errorLoginCase.name}`, async ({ loginPage }) => {
            await loginPage.login(errorLoginCase.login, errorLoginCase.password);
            await expect(loginPage.errorText).toHaveText(errorLoginCase.errorMessage);
        });
    }
});