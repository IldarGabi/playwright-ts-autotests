import { Booking } from './types';


export const defaultBooking: Booking = {
    firstname: 'Ildar',
    lastname: 'Tester',
    totalprice: 150,
    depositpaid: true,
    bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
    additionalneeds: 'Breakfast',
};