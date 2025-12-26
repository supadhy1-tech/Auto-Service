# Auto Shop Website (MERN) – Giftable Template

A minimal, production-ready starting point for an auto shop site with online booking,
built with **React (Vite)**, **Node/Express**, **MongoDB (Mongoose)**, and **Nodemailer** for emails.

## Structure
- `frontend/` — React app (Home, Services, Book, Admin pages)
- `backend/` — Express API with bookings and email notifications

## Quick Start
1) **Backend**
```bash
cd backend
npm install
cp .env.example .env
# set MONGO_URI and (optionally) SMTP settings
npm run dev
```

2) **Frontend**
```bash
cd ../frontend
npm install
cp .env.example .env
npm run dev
```

Visit the frontend (default http://localhost:5173) and book an appointment;
backend default is http://localhost:5000.

## Deploy
- **Backend**: Render, Railway, Fly.io, or VPS. Set env vars there.
- **Frontend**: Vercel/Netlify. Set `VITE_API_BASE` to your backend URL.
- **Domain**: Point DNS (A/AAAA or CNAME) to hosting provider.

## Next Steps (recommended before production)
- Add admin authentication (JWT/OAuth) for bookings list.
- Add time-slot validation / shop hours.
- Add Google reCAPTCHA on booking form.
- Store services & prices in DB or CMS for easy updates.
- Add Terms/Privacy pages.
