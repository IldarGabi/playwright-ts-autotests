import { test as base } from '@playwright/test';
import { BookingApi } from '../api/BookingApi';


type ApiFixtures = {
    bookingApi: BookingApi;
    authorizedBookingApi: BookingApi;
};

export const test = base.extend<ApiFixtures>({
    bookingApi: async ({ request }, use) => {
        await use(new BookingApi(request));
    },
    authorizedBookingApi: async ({ request }, use) => {
        const api = new BookingApi(request);
        await api.auth();
        await use(api);
    },
});

export { expect } from '@playwright/test';