import { test as base, expect } from '@playwright/test';
import { type CreateBookingResponse } from '../api/types';
import { BookingApi } from '../api/BookingApi';
import { defaultBooking } from '../api/testData';


type ApiFixtures = {
    bookingApi: BookingApi;
    authorizedBookingApi: BookingApi;
    createdBooking: CreateBookingResponse;
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

    createdBooking: async ({ authorizedBookingApi }, use) => {
        // создание и проверка
        const response = await authorizedBookingApi.createBooking(defaultBooking);

        expect(response.ok()).toBeTruthy();

        const body: CreateBookingResponse = await response.json();

        // данные бронирования для тестов
        await use(body);

        // удаление после теста
        await authorizedBookingApi.deleteBooking(body.bookingid);
    },
});

export { expect } from '@playwright/test';