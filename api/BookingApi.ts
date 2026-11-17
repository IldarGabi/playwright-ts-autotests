import { type APIRequestContext, type APIResponse } from "@playwright/test";
import { type Booking } from "./types";

export class BookingApi {
    private token?: string;

    constructor(private readonly request: APIRequestContext) { }

    async auth(username = 'admin', password = 'password123'): Promise<APIResponse> {
        const authResponse = await this.request.post('/auth', { data: { username, password } });
        const body = await authResponse.json();
        this.token = body.token;
        return authResponse;
    };

    async getBookingList(): Promise<APIResponse> {
        return this.request.get('/booking')
    };

    async getBookingById(id: number): Promise<APIResponse> {
        return this.request.get(`/booking/${id}`);
    };

    async createBooking(bookingData: Booking): Promise<APIResponse> {
        return await this.request.post('/booking', { data: bookingData });
    };

    private getAuthHeader(): Record<string, string> {
        return this.token ? { Cookie: `token=${this.token}` } : {}
    };

    async updateBooking(id: number, updateBookingData: Booking): Promise<APIResponse> {
        return await this.request.put(`/booking/${id}`, { data: updateBookingData, headers: this.getAuthHeader() });
    };

    async deleteBooking(id: number): Promise<APIResponse> {
        return await this.request.delete(`/booking/${id}`, { headers: this.getAuthHeader() });
    };
}