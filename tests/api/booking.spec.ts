import { test, expect, APIRequestContext } from '@playwright/test';

test.use({
    baseURL: 'https://restful-booker.herokuapp.com',
    extraHTTPHeaders: { Accept: 'application/json' },
});

type BookingListItem = {
    bookingid: number;
};

type BookingDates = { checkin: string; checkout: string };

type Booking = {
    firstname: string;
    lastname: string;
    totalprice: number;
    depositpaid: boolean;
    bookingdates: BookingDates;
    additionalneeds?: string;
};

const defaultBooking: Booking = {
    firstname: 'Ildar',
    lastname: 'Tester',
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
    additionalneeds: 'Breakfast',
};

async function createBooking(request: APIRequestContext, booking: Booking = defaultBooking): Promise<number> {
    const response = await request.post('/booking', {
        data: booking
    });

    expect(response.status()).toBe(200);

    const body = await response.json();

    return body.bookingid;
}

test.describe('Бронирование через API', () => {
    let accessToken: string;

    test.beforeAll(async ({ request }) => {
        const authResp = await request.post('/auth', {
            data: {
                username: "admin",
                password: "password123"
            },
        });


        expect(authResp.status()).toBe(200);

        const authRespBody = await authResp.json();

        accessToken = authRespBody.token;
        expect(accessToken).toEqual(expect.any(String));
        expect(accessToken.length).toBeGreaterThan(0);
    });
    test('GET /booking возвращает список бронирований', async ({ request }) => {
        const resp = await request.get('/booking');

        expect(resp.status()).toBe(200);

        const bookings: BookingListItem[] = await resp.json();

        expect(Array.isArray(bookings)).toBe(true);
        expect(bookings.length).toBeGreaterThan(0);
        expect(bookings[0]).toHaveProperty('bookingid')
    });
    test('PUT /booking изменени записи бронирования', async ({ request }) => {
        const bookingId = await createBooking(request);

        const updateBooking = { ...defaultBooking, lastname: 'QA_lead' };

        const putResponse = await request.put(`/booking/${bookingId}`, {
            data: updateBooking,
            headers: {
                Cookie: `token=${accessToken}`
            },
        });

        const putRespBody = await putResponse.json();

        expect(putResponse.status()).toBe(200);
        expect(putRespBody).toEqual(updateBooking);
    });
    test('DELETE /booking удаление созданной записи бронирования', async ({ request }) => {
        const bookingId = await createBooking(request);

        const deleteResp = await request.delete(`/booking/${bookingId}`, {
            headers: {
                Cookie: `token=${accessToken}`
            },
        });

        expect(deleteResp.status()).toBe(201);

        const getAfterDelete = await request.get(`/booking/${bookingId}`);
        expect(getAfterDelete.status()).toBe(404);
    });
    test('PUT /booking с некорректным токеном', async ({ request }) => {
        const bookingId = await createBooking(request);
        const updateBooking = { ...defaultBooking, lastname: 'QA_lead' };
        const putResp = await request.put(`/booking/${bookingId}`, {
            data: updateBooking,
            headers: {
                Cookie: `token=failedToken`
            },
        });

        expect(putResp.status()).toBe(403);
    });
    test('GET /booking для несуществующего id', async ({ request }) => {
        const getResp = await request.get('/booking/999999999');

        expect(getResp.status()).toBe(404);
    });
    test('POST /auth с неверной авторизацией', async ({ request }) => {
        const authResp = await request.post('/auth', {
            data: {
                username: "admin",
                password: "password"
            },
        });

        const authRespBody = await authResp.json();
        expect(authResp.status()).toBe(200);
        expect(authRespBody.reason).toBe('Bad credentials');
    });
});