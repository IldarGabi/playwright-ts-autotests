import { test, expect } from '../../fixtures/apiFixture';
import { type Booking, BookingListItem } from '../../api/types';
import { defaultBooking } from '../../api/testData';


test.use({
    baseURL: 'https://restful-booker.herokuapp.com',
    extraHTTPHeaders: { Accept: 'application/json' },
});

test.describe('Бронирование через API', () => {
    test('GET /booking возвращает список бронирований', async ({ bookingApi }) => {
        const getBookingResp = await bookingApi.getBookingList();

        expect(getBookingResp.status()).toBe(200);

        const bookings: BookingListItem[] = await getBookingResp.json();

        expect(Array.isArray(bookings)).toBe(true);
        expect(bookings.length).toBeGreaterThan(0);
        expect(bookings[0]).toHaveProperty('bookingid')
    });
    test('GET /booking/{id} возвращает созданное бронирование', async ({ bookingApi, createdBooking }) => {
        const response = await bookingApi.getBookingById(createdBooking.bookingid);

        expect(response.status()).toBe(200);

        const body: Booking = await response.json();

        expect(body).toEqual(defaultBooking);
    });
    test('PUT /booking изменение записи бронирования', async ({ authorizedBookingApi, createdBooking }) => {
        const updateBooking: Booking = { ...defaultBooking, lastname: 'QA_lead' };

        const putResponse = await authorizedBookingApi.updateBooking(createdBooking.bookingid, updateBooking);

        expect(putResponse.status()).toBe(200)

        const putRespBody: Booking = await putResponse.json();

        expect(putRespBody).toEqual(updateBooking);
    });
    test('DELETE /booking удаление созданной записи бронирования', async ({ authorizedBookingApi, createdBooking }) => {
        const bookingId = createdBooking.bookingid;

        const deleteResp = await authorizedBookingApi.deleteBooking(bookingId);

        const getDeletedBooking = await authorizedBookingApi.getBookingById(bookingId);

        expect(deleteResp.status()).toBe(201);
        expect(getDeletedBooking.status()).toBe(404);
    });
    test('PUT /booking без токена', async ({ bookingApi, createdBooking }) => {
        const putResponse = await bookingApi.updateBooking(createdBooking.bookingid, { ...defaultBooking, lastname: 'Hacker' });

        expect(putResponse.status()).toBe(403);
    });
    test('GET /booking для несуществующего id', async ({ bookingApi }) => {
        const getResp = await bookingApi.getBookingById(999999);

        expect(getResp.status()).toBe(404);
    });
    test('POST /auth с неверной авторизацией', async ({ bookingApi }) => {
        const authResp = await bookingApi.auth('admin', 'password');

        expect(authResp.status()).toBe(200);

        const authRespBody = await authResp.json();

        expect(authRespBody.reason).toBe('Bad credentials');
    });
    test('PUT с невалидным токеном авторизации', async ({ bookingApi, createdBooking }) => {
        bookingApi.setCustomerToken('invalid-token');

        const putResponse = await bookingApi.updateBooking(createdBooking.bookingid, { ...defaultBooking, lastname: 'QA_lead' });

        expect(putResponse.status()).toBe(403);
    });
});