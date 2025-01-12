import { describe, it, expect } from 'vitest';
const request = require('supertest');
import app from '../app';

describe("POST /guests" , () => {
    const agent = request.agent(app);

    it('should book a room and return booking details', async () => {
        const res = await agent
            .post('/book')
            .send({
                name: 'John Doe',
                email: 'john@example.com',
                contact: "9878236782",
                checkInDate: "12-10-2024",
                checkOutDate: "24-10-2024"
            });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Room booked successfully');
        expect(res.body.bookingDetails[0].email).toBe('john@example.com');
    });


    it('should return an error if no rooms available', async () => {
        const res = await agent
            .post('/book')
            .send({
                name: 'John Doe',
                email: 'john@example.com',
                contact: "9878236782",
                checkInDate: "12-10-2024",
                checkOutDate: "24-10-2024"
            });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('No rooms available');
    })
});

describe('GET /view', () => {
    const agent = request.agent(app);

    it('should return booking details for a specific email', async () => {
        const res = await agent
            .get('/view')
            .query({ email: 'john@example.com' })

            expect(res.status).toBe(200);
            expect(res.body.bookings).toHaveLength(1);
            expect(res.body.bookingDetails[0].email).toBe('john@example.com');
        });

    it('should return an error if no bookings are found', async () => {
        const res = await agent
            .get('/view')
            .query({ email: 'wrongemail@gmail.com' })

            expect(res.status).toBe(404);
            expect(res.body.message).toBe('No bookings found');
        });
});

describe('GET /guests', () => {
    const agent = request.agent(app);

    it('should return a list of all guests currently staying in the hotel', async () => {
        const res = await agent
            .get('/guests')

            expect(res.status).toBe(200);
            expect(res.body[0]).toHaveProperty('roomNumber');
            expect(res.body[0]).toHaveProperty('bookingId');
        });

    it('should return an error if no bookings are found', async () => {
        const res = await agent
            .get('/guests')

            expect(res.status).toBe(404);
            expect(res.body.message).toBe('No guests currently in the hotel');
        });
});

describe('POST /cancel', () => {
    const agent = request.agent(app);

    it('should cancel a booking and mark the room as available', async () => {
        const res = await agent
            .delete('/cancel')
            .send({
                email: 'john@gmail.com',
                roomNumber: 103
            })

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Booking canceled successfully');

        });

    it('should return an error if no bookings are found', async () => {
        const res = await agent
            .delete('/cancel')
            .send({
                email: 'john@gmail.com',
                roomNumber: 103
            })

            expect(res.status).toBe(404);
            expect(res.body.message).toBe('No bookings found');
        });
});

describe('PUT /update-booking', () => {
    const agent = request.agent(app);

    it('should update the booking details matching with the email and roomNumber in request body', async () => {
        const res = await agent
            .put('/update-booking')
            .send({
                email: 'john@gmail.com',
                roomNumber: 103,
                checkInDate: "12-10-2024",
                checkOutDate: "24-10-2024"
            })

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Booking modified successfully');
            expect(res.body.bookingDetails[0].email).toBe('john@example.com');
        });

    it('should return an error if no bookings are found', async () => {
        const res = await agent
            .put('/update-booking')
            .send({
                email: 'john@gmail.com',
                roomNumber: 103,
                checkInDate: "12-10-2024",
                checkOutDate: "24-10-2024"
            })

            expect(res.status).toBe(404);
            expect(res.body.message).toBe('Booking not found for the provided email and room number');

        });
});