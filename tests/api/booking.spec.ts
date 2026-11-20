import { test, expect } from '../../fixtures/apiFixture';
import { type Booking, CreateBookingResponse, BookingListItem } from '../../api/types';

test.use({
    baseURL: 'https://restful-booker.herokuapp.com',
    extraHTTPHeaders: { Accept: 'application/json' },
});

const defaultBooking: Booking = {
    firstname: 'Ildar',
    lastname: 'Tester',
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
    additionalneeds: 'Breakfast',
};

test.describe('Бронирование через API', () => {
    test('GET /booking возвращает список бронирований', async ({ bookingApi }) => {
        const getBookingResp = await bookingApi.getBookingList();

        const bookings: BookingListItem[] = await getBookingResp.json();

        expect(getBookingResp.status()).toBe(200);
        expect(Array.isArray(bookings)).toBe(true);
        expect(bookings.length).toBeGreaterThan(0);
        expect(bookings[0]).toHaveProperty('bookingid')
    });
    test('PUT /booking изменение записи бронирования', async ({ authorizedBookingApi }) => {
        const createdBookingResp = await authorizedBookingApi.createBooking(defaultBooking);

        const bookingBody: CreateBookingResponse = await createdBookingResp.json();

        const bookingId = bookingBody.bookingid;

        const updateBooking = { ...defaultBooking, lastname: 'QA_lead' };

        const putResponse = await authorizedBookingApi.updateBooking(bookingId, updateBooking);

        const putRespBody: Booking = await putResponse.json();

        expect(createdBookingResp.ok()).toBeTruthy();
        expect(putResponse.status()).toBe(200);
        expect(putRespBody).toEqual(updateBooking);
    });
    test('DELETE /booking удаление созданной записи бронирования', async ({ authorizedBookingApi }) => {
        const createdBookingResp = await authorizedBookingApi.createBooking(defaultBooking);

        const bookingBody: CreateBookingResponse = await createdBookingResp.json();

        const bookingId = bookingBody.bookingid;

        const deleteResp = await authorizedBookingApi.deleteBooking(bookingId);

        const getDeletedBooking = await authorizedBookingApi.getBookingById(bookingId);

        expect(createdBookingResp.ok()).toBeTruthy();
        expect(deleteResp.status()).toBe(201);
        expect(getDeletedBooking.status()).toBe(404);
    });
    test('PUT /booking без токена', async ({ bookingApi }) => {
        const createdBookingResp = await bookingApi.createBooking(defaultBooking);
        const { bookingid } = await createdBookingResp.json();

        const putResp = await bookingApi.updateBooking(bookingid, { ...defaultBooking, lastname: 'Hacker' });

        expect(createdBookingResp.ok()).toBeTruthy();
        expect(putResp.status()).toBe(403);
    });
    test('GET /booking для несуществующего id', async ({ bookingApi }) => {
        const getResp = await bookingApi.getBookingById(999999);

        expect(getResp.status()).toBe(404);
    });
    test('POST /auth с неверной авторизацией', async ({ bookingApi }) => {
        const authResp = await bookingApi.auth('admin', 'password');

        const authRespBody = await authResp.json();

        expect(authResp.status()).toBe(200);
        expect(authRespBody.reason).toBe('Bad credentials');
    });
    test('PUT с невалидным токеном авторизации', async ({ authorizedBookingApi }) => {
        const createdBookingResp = await authorizedBookingApi.createBooking(defaultBooking);

        const bookingBody: CreateBookingResponse = await createdBookingResp.json();

        const bookingId = bookingBody.bookingid;

        authorizedBookingApi.setCustomerToken('invalid-token');

        const updateBooking = { ...defaultBooking, lastname: 'QA_lead' };

        const putResponse = await authorizedBookingApi.updateBooking(bookingId, updateBooking);

        expect(createdBookingResp.ok()).toBeTruthy();
        expect(putResponse.status()).toBe(403);
    })
});