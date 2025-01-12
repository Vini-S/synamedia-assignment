# Hotel Room Booking System API

This is a simple Hotel Room Booking System API built with Node.js and Express.js. The backend manages hotel room bookings, allowing users to book rooms, view bookings, modify, and cancel them. The system stores bookings in session data, ensuring user data is temporarily stored during interactions with the API.


## Features
- **Book a Room:** Users can book rooms by providing their details (name, email, check-in and check-out dates).
- **View Booking Details:** Retrieve booking details by providing an email address.
- **View All Guests:** List all the guests currently staying at the hotel.
- **Cancel a Room Booking:** Cancel a booking by providing email and room details.
- **Modify a Room Booking:** Update a guest's check-in or check-out date by providing booking details.

## Techologies
- **Node.js** (Backend)
- **Express.js** (Framework)
- **Express-Session** (For session storage)
- **Vitest** (For testing)
- **Supertest** (For testing API endpoints)
- **UUID** (For unique booking IDs)
