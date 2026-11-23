import { type Page, type Locator } from '@playwright/test';

export class InventoryPage {
    readonly page: Page;
    readonly title: Locator
    readonly cartLink: Locator
    readonly cartBadge: Locator

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('[data-test="title"]');
        this.cartLink = page.locator('[data-test="shopping-cart-link"]');
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    }

    async open() {
        await this.page.goto('/inventory.html');
    }
    async addItems(productIds: string[]) {
        for (const productId of productIds) {
            await this.page.locator(`[data-test="add-to-cart-${productId}"]`).click();
        }
    }

    async removeItems(productIds: string[]) {
        for (const productId of productIds) {
            await this.page.locator(`[data-test="remove-${productId}"]`).click();
        }
    }
};


