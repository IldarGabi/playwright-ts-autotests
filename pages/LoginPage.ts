import { type Page, type Locator } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly userNameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginBtn: Locator;
    readonly errorTex: Locator;

    constructor(page: Page) {
        this.page = page;
        this.userNameInput = page.locator('[data-test="username"]');
        this.passwordInput = page.locator('[data-test="password"]');
        this.loginBtn = page.locator('[data-test="login-button"]');
        this.errorTex = page.locator('[data-test="error"]');
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
