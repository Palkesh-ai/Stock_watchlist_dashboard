# Stock Watchlist Dashboard

Stock Watchlist Dashboard is a full-stack TypeScript app for tracking stocks, managing a personal watchlist, and recording holdings in a portfolio. The repository contains a Next.js frontend and an Express/MongoDB backend that work together through a JSON REST API.

## Overview

The frontend provides an authenticated dashboard where users can search stocks, manage a watchlist, and maintain portfolio holdings. The backend handles authentication, stock market lookups, watchlist persistence, and portfolio CRUD operations.

## Features

- JWT-based authentication with signup, login, and current-user support
- Stock search, symbol lookup, and candlestick data retrieval
- Watchlist management
- Portfolio holdings management
- MongoDB persistence through Mongoose
- Request validation, security middleware, and centralized error handling
- Responsive dashboard UI built with Next.js, Tailwind CSS, and Framer Motion

## Tech Stack

- Frontend: Next.js 15, React 19, TypeScript, Tailwind CSS, Zustand, Framer Motion, Recharts, Sonner
- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, Joi, Axios, Helmet, CORS, Morgan, rate limiting

## Repository Structure

```text
Stock_watchlist_dashboard/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   └── server.ts
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── stores/
│   │   └── types/
│   └── package.json
└── package.json
```

## Prerequisites

- Node.js 18 or newer
- npm or pnpm
- MongoDB connection string
- Finnhub API key

## Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Stock_watchlist_dashboard
```

### 2. Install dependencies

Install the backend and frontend dependencies separately:

```bash
cd backend
npm install
```

```bash
cd ../frontend
pnpm install
```

From the repository root, you can also use:

```bash
npm run install:all
```

### 3. Configure environment variables

Create a `.env` file in the `backend/` directory.

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key

PORT=5000
NODE_ENV=development
JWT_EXPIRES_IN=7d

FINNHUB_API_KEY=your_finnhub_api_key
FINNHUB_BASE_URL=https://finnhub.io/api/v1

CORS_ORIGIN=http://localhost:3000
```

Required variables:

- `MONGO_URI`
- `JWT_SECRET`

Optional variables and defaults:

- `PORT` defaults to `5000`
- `NODE_ENV` defaults to `development`
- `JWT_EXPIRES_IN` defaults to `7d`
- `FINNHUB_BASE_URL` defaults to `https://finnhub.io/api/v1`
- `CORS_ORIGIN` defaults to `http://localhost:3000`

## Running the App

### Backend

```bash
cd backend
npm run dev
```

Production build:

```bash
npm run build
npm start
```

### Frontend

```bash
cd frontend
pnpm run dev
```

### Run both from the root

```bash
npm run dev
```

This uses `concurrently` to start the backend and frontend together.

## Scripts

### Root

- `npm run dev` starts backend and frontend together
- `npm run dev:all` starts both apps with `concurrently`
- `npm run dev:backend` starts the backend only
- `npm run dev:frontend` starts the frontend only
- `npm run install:all` installs dependencies for both apps

### Backend

- `npm run dev` starts the TypeScript server in watch mode
- `npm run build` compiles the backend to `dist/`
- `npm start` runs the compiled server

### Frontend

- `pnpm run dev` starts the Next.js dev server
- `pnpm run build` builds the frontend for production
- `pnpm run start` serves the production build
- `pnpm run lint` runs Next.js linting
- `pnpm run typecheck` runs TypeScript without emitting output

## API

Base URL: `http://localhost:5000`

API prefix: `/api`

Health check:

- `GET /health`

Authentication header format:

```http
Authorization: Bearer <token>
```

### Auth Routes

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

Example signup body:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

Example login body:

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Stock Routes

All stock routes require authentication.

- `GET /api/stocks/search?query=AAPL`
- `GET /api/stocks/query?symbol=AAPL`
- `GET /api/stocks/candles?symbol=AAPL&resolution=1&from=1710000000&to=1711000000`

### Watchlist Routes

All watchlist routes require authentication.

- `POST /api/watchlist`
- `GET /api/watchlist`
- `DELETE /api/watchlist/:symbol`

Example watchlist body:

```json
{
  "symbol": "AAPL"
}
```

### Portfolio Routes

All portfolio routes require authentication.

- `POST /api/portfolio`
- `GET /api/portfolio`
- `DELETE /api/portfolio/:id`

Example holding body:

```json
{
  "symbol": "AAPL",
  "shares": 10,
  "price": 180,
  "date": "2025-01-01"
}
```

## Frontend Pages

- `/login` for authentication
- `/signup` for account creation
- `/dashboard` for the authenticated user experience
- `/` redirects to `/login`

## Response Shape

Most API responses follow a consistent JSON envelope:

```json
{
  "success": true,
  "data": {}
}
```

## Notes

- The backend validates required environment variables at startup.
- The API applies rate limiting under `/api`.
- MongoDB must be reachable before the backend server starts.
- The frontend expects the backend to be available on the configured API origin.

## Testing

You can test endpoints with Postman, Thunder Client, or `curl`.

Suggested checks:

- Confirm MongoDB is running
- Confirm the backend `.env` file is configured
- Start the backend and verify `GET /health`
- Sign up or log in, then reuse the returned JWT for protected routes

## License

No license file is currently included in this repository.

