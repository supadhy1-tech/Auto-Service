# Auto Shop Backend (Express + MongoDB)

## Setup
1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env` and fill values.
4. Run dev server: `npm run dev`

## Endpoints
- `GET /health` → service health
- `POST /api/bookings` → create a booking (JSON body)
- `GET /api/bookings` → list recent bookings (add auth before production)
