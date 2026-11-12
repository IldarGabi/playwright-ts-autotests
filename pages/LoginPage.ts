import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly userNameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginBtn: Locator;
    readonly errorText: Locator;
    readonly loginTitleText: Locator;

    constructor(page: Page) {
        this.page = page;
        this.userNameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginBtn = page.locator('[data-test="login-button"]');
        this.errorText = page.locator('[data-test="error"]');
        this.loginTitleText = page.locator('[data-test="title"]');
    }

    async open() {
        await this.page.goto('/');
    }
    async login(username: string, password: string) {
        await this.userNameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginBtn.click();
    }
}
