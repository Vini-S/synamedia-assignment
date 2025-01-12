const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
// Session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

const roomsFilePath = './data/rooms.json';

// Read room data from JSON
const getRoomData = () => {
    const data = fs.readFileSync(roomsFilePath);
    return JSON.parse(data);
};

// Write room data to JSON
const writeRoomData = (data) => {
    fs.writeFileSync(roomsFilePath, JSON.stringify(data, null, 2));
};

// Booking Room
app.post('/book', (req, res) => {
    const { name, email, contact, checkInDate, checkOutDate } = req.body;
    let rooms = getRoomData().rooms;

    // Find an available room
    const availableRoom = rooms.find(room => !room.isBooked);

    if (!availableRoom) {
        return res.status(400).json({ message: 'No rooms available' });
    }

    availableRoom.isBooked = true;
    const bookingId = uuidv4();
    const newBooking  = { bookingId, name, email, contact, checkInDate, checkOutDate, roomNumber: availableRoom.roomNumber };

    // Initialize session booking array if not present
    if (!req.session.bookings) {
        req.session.bookings = [];
    }
    req.session.bookings.push(newBooking);
    writeRoomData({ rooms });

    res.json({
        message: 'Room booked successfully',
        bookingDetails: req.session.bookings
    });
});

// View Booking Details for a Specific Email
app.get('/view', (req, res) => {
    const { email } = req.query;

    if (!req.session.bookings) {
        return res.status(404).json({ message: 'No bookings found' });
    }

    // Find all bookings for the provided email
    const userBookings = req.session.bookings.filter(booking => booking.email === email);

    if (userBookings.length > 0) {
        res.json({ bookings: userBookings });
    } else {
        res.status(404).json({ message: 'No bookings found for the provided email' });
    }
});

// View All Guests
app.get('/guests', (req, res) => {
    if (req.session.bookings && req.session.bookings.length > 0) {
        return res.json(req.session.bookings);
    } else {
        return res.status(404).json({ message: 'No guests currently in the hotel' });
    }
});

// Cancel Room Booking
app.delete('/cancel', (req, res) => {
    const { email, roomNumber } = req.body;

    if (!req.session.bookings) {
        return res.status(404).json({ message: 'No bookings found' });
    }

    // Find the booking to cancel
    const bookingIndex = req.session.bookings.findIndex(booking => booking.email === email && booking.roomNumber === roomNumber);

    if (bookingIndex !== -1) {
        // Set the room as available again
        let rooms = getRoomData().rooms;
        const room = rooms.find(room => room.roomNumber === req.session.bookings[bookingIndex].roomNumber);
        room.isBooked = false;
        writeRoomData({ rooms });

        // Remove the booking from the session array
        req.session.bookings.splice(bookingIndex, 1);
        return res.json({ message: 'Booking canceled successfully' });
    } else {
        return res.status(404).json({ message: 'No bookings found' });
    }
});

// Modify Booking
app.put('/update-booking', (req, res) => {
    const { email, roomNumber, checkInDate, checkOutDate } = req.body;

    // Find the booking to modify based on email and room number
    const bookingIndex = req.session.bookings.findIndex(booking => booking.email === email && booking.roomNumber === roomNumber);

    if (bookingIndex !== -1) {
        // Modify the booking's check-in and check-out dates
        req.session.bookings[bookingIndex].checkInDate = checkInDate;
        req.session.bookings[bookingIndex].checkOutDate = checkOutDate;

        return res.json({
            message: 'Booking modified successfully',
            bookingDetails: req.session.bookings[bookingIndex]
        });
    } else {
        return res.status(404).json({ message: 'Booking not found for the provided email and room number' });
    }
});

module.exports = app;






