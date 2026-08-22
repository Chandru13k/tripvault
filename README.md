# TripVault — Travel Memory Journal (Week 1 Setup)

TripVault is a full-stack MERN travel memory journal that enables users to log trips, upload photos, and securely store and share travel memories. 

This repository contains the completed Week 1 deliverables, laying down a highly robust backend server, a database connection, and a premium React frontend user authentication system.

---

## 🛠️ Tech Stack

* **Backend**: Node.js, Express, MongoDB, Mongoose
* **Authentication**: JSON Web Token (JWT) & `bcryptjs` for secure password hashing
* **Frontend**: React (Vite), React Router DOM (v6)
* **HTTP Client**: Axios (configured with automated JWT interceptors)
* **Styles**: Custom premium Vanilla CSS design system (Glassmorphism inspired, responsive, and dark-theme oriented)

---

## 📁 Folder Structure

```text
tripvault/
├── client/                 ← React (Vite) Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── api.js          ← Reusable Axios Client
│   │   ├── App.jsx         ← Routing and Navigation
│   │   └── main.jsx
│   └── package.json
├── server/                 ← Node.js + Express Backend
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   └── auth.js
│   ├── .env.example
│   ├── .gitignore
│   ├── index.js
│   └── package.json
└── README.md
```

---

## ⚙️ Prerequisites

Ensure you have the following installed on your local machine:
* [Node.js](https://nodejs.org/) (v18.x or higher recommended)
* [MongoDB](https://www.mongodb.com/try/download/community) running locally or a cloud database instance (MongoDB Atlas)

---

## 🚀 Installation & Local Run

### 1. Backend Server Setup

Navigate to the `server` directory, install packages, and create your environment configuration:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory (you can copy the structure from `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/tripvault
JWT_SECRET=your_secure_secret_key_here
```

Start the Express development server:
```bash
npm run dev
```
The server will boot and connect to your MongoDB database, listening on port `5000`.

---

### 2. Frontend Setup

In a new terminal window, navigate to the `client` directory and install packages:

```bash
cd client
npm install
```

Start the Vite development web server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔌 API Endpoints Reference

All Auth endpoints are prefixed with `/api/auth`:

| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new user profile | No |
| **POST** | `/api/auth/login` | Authenticate user & return JWT token | No |
| **GET** | `/api/auth/me` | Retrieve current user profile details | **Yes** (Bearer Token) |

---

## 🔒 Authentication Flow & Architecture

1. **User Sign Up**: User submits their details. Password is encrypted using `bcryptjs` (salt factor 10) in a pre-save hook before registering in the database.
2. **User Sign In**: User submits credentials. If correct, the backend issues a signed JWT containing the user id.
3. **Session Store**: The token and user profile object are saved in `localStorage` in the browser.
4. **Authorized Calls**: The frontend reusable Axios client automatically attaches the `Authorization: Bearer <token>` header to all requests.
5. **Route Protection**: If the user tries to access `/dashboard` without a token, the frontend redirects them to `/login`. If the token is invalid or expired, Axios interceptor clears the invalid token and securely logs out the user.

---

## 📋 Week 1 Deliverables Checklist

- [x] **Public Git Repository**: Structured cleanly with a descriptive README.md.
- [x] **Running Express Server**: Listening on port `5000` with active MongoDB connection.
- [x] **Secure User Schema**: Hashed passwords with `bcryptjs`.
- [x] **Register API**: `POST /api/auth/register` validates input, rejects duplicates, and saves user securely.
- [x] **Login API**: `POST /api/auth/login` returns token and profile details.
- [x] **Protected Me Route**: `GET /api/auth/me` verifies tokens and returns authenticated user info.
- [x] **Vite React UI**: Premium responsive UI pages: Home/Landing, Register, Login, and Dashboard.
- [x] **Secure Routing**: Protected `/dashboard` path with custom route guard and logout hooks.
