# Railway Management System API

A RESTful API for a railway management system built with Node.js, Express, and PostgreSQL.

## Features

- User authentication (register/login)
- Admin-only operations for managing trains
- Seat availability checking
- Secure booking system with race condition handling
- Booking details retrieval

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database (e.g., Neon DB)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
DATABASE_URL=your_neon_db_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_API_KEY=your_admin_api_key
PORT=3000
```

```schema
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trains table
CREATE TABLE trains (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    source VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    total_seats INTEGER NOT NULL,
    available_seats INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    train_id INTEGER REFERENCES trains(id),
    booking_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints
```Authentication
POST /api/auth/register - Register a new user
POST /api/auth/login - Login user
```

```Trains
POST /api/trains - Add new train (Admin only)
GET /api/trains/availability - Get seat availability
```

```Bookings
POST /api/bookings - Book a seat
GET /api/bookings/:id - Get booking details
```

## Security Features
JWT authentication
Admin API key protection
Rate limiting
CORS enabled
Helmet security headers
Password hashing
Race condition handling in bookings

## Error Handling
The API includes comprehensive error handling for:
Invalid requests
Authentication errors
Database errors
Concurrent booking conflicts
