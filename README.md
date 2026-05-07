# 📈 Stock Watchlist Dashboard

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express.js-Backend-black?style=for-the-badge&logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?style=for-the-badge&logo=mongodb)
![JWT](https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge)
![Finnhub](https://img.shields.io/badge/Market%20Data-Finnhub-blue?style=for-the-badge)

### REST API for Watchlist, Portfolio & Real-Time Stock Market Data

</div>

---

# ✨ Features

- 🔐 JWT Authentication
- 📊 Real-time stock data using Finnhub API
- ⭐ Watchlist management
- 💼 Portfolio tracking
- 📈 Candlestick market data
- ⚡ Rate limiting & secure APIs
- 🌐 RESTful API architecture
- 🧩 Modular scalable backend structure

---

# 🛠 Tech Stack

| Technology | Usage |
|---|---|
| Node.js | Runtime |
| Express.js | Backend framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| Finnhub API | Market Data |
| TypeScript | Type Safety |

---

# 📦 Prerequisites

Before running the project, ensure you have:

- Node.js `18+`
- npm or pnpm
- MongoDB URI (Atlas/local)
- Finnhub API key

---

# 🚀 Backend Setup
2️⃣ Install Dependencies
npm install
3️⃣ Create .env

Create a .env file inside the backend directory.

Example
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key

PORT=5000
NODE_ENV=development
JWT_EXPIRES_IN=7d

FINNHUB_API_KEY=your_finnhub_api_key
FINNHUB_BASE_URL=https://finnhub.io/api/v1

CORS_ORIGIN=http://localhost:3000
4️⃣ Run Development Server
npm run dev
5️⃣ Production Build
npm run build
npm start
🎨 Frontend Setup
cd frontend

pnpm install
pnpm dev

Or using npm:

npm install
npm run dev
🔑 Environment Variables

See:

backend/src/config/env.ts
Required Variables
Variable	Description
MONGO_URI	MongoDB connection string
JWT_SECRET	Secret used for JWT signing
Optional Variables
Variable	Default
PORT	5000
NODE_ENV	development
JWT_EXPIRES_IN	7d
FINNHUB_API_KEY	—
FINNHUB_BASE_URL	https://finnhub.io/api/v1
CORS_ORIGIN	http://localhost:3000
🌐 API Information
Base URL
http://localhost:5000
API Prefix
/api
❤️ Health Check
Endpoint
GET /health

No authentication required.

🔐 Authentication

Protected routes require JWT token.

Header Format
Authorization: Bearer <token>

Middleware:

backend/src/middlewares/auth.ts
📚 API Endpoints
👤 Auth Routes
Signup
POST /api/auth/signup
Body
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
Login
POST /api/auth/login
Body
{
  "email": "john@example.com",
  "password": "password123"
}
Current User
GET /api/auth/me

✅ Requires Authentication

📈 Stock Routes

All stock routes require authentication.

Search Symbol
GET /api/stocks/search?query=AAPL
Stock Lookup
GET /api/stocks/query?symbol=AAPL
Candlestick Data
GET /api/stocks/candles?symbol=AAPL&resolution=1&from=1710000000&to=1711000000
⭐ Watchlist Routes
Add to Watchlist
POST /api/watchlist
Body
{
  "symbol": "AAPL"
}
Get Watchlist
GET /api/watchlist
Remove Watchlist Item
DELETE /api/watchlist/:symbol

Example:

DELETE /api/watchlist/AAPL
💼 Portfolio Routes
Add Holding
POST /api/portfolio
Body
{
  "symbol": "AAPL",
  "shares": 10,
  "price": 180,
  "date": "2025-01-01"
}
Get Portfolio
GET /api/portfolio
Remove Holding
DELETE /api/portfolio/:id
📦 Response Format

All APIs follow this structure:

{
  "success": true,
  "data": {}
}
🗂 Project Structure
backend/
├── src/
│   ├── app.ts
│   ├── server.ts
│   ├── config/
│   │   └── env.ts
│   ├── routes/
│   ├── controllers/
│   ├── models/

frontend/
├── src/
│   ├── app/
│   ├── components/
│   └── services/
│       └── api/
🧪 Testing

You can test the API using:

Postman
Thunder Client
curl

Before testing:

Ensure MongoDB is running
Ensure .env is configured correctly
📝 Notes
Rate limiting is applied on /api
Health route available at /health
API routes available under /api
👨‍💻 Author

Built with ❤️ using Node.js, Express, MongoDB & Finnhub API.
```bash
git clone <your-repo-url>
cd backend

