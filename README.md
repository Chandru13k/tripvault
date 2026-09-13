# TripVault — Travel Memory Journal

TripVault is a full-stack MERN (MongoDB, Express, React, Node.js) travel memory journal that enables users to log trips, upload cover & gallery photos, customize public profiles, and securely share travel memories.

This repository contains the complete **Week 1 through Week 4** deliverables, featuring an adversarial-tested REST API, JWT authentication, Mongoose schemas, Cloudinary media storage, responsive dark-glass UI, skeleton loaders, toast notifications, SPA routing fallbacks, and production deployment preparation for Render & Vercel.

---

## 🛠️ Tech Stack & Architecture

* **Backend**: Node.js, Express.js, MongoDB, Mongoose ORM
* **Cloud Storage**: Cloudinary, Multer, Multer Storage Cloudinary
* **Authentication**: JSON Web Token (JWT) & `bcryptjs` password hashing (10 salt rounds)
* **Frontend**: React 19 (Vite), React Router DOM (v7)
* **HTTP Client**: Axios with centralized request/response interceptors
* **Styling & UI**: Custom Vanilla CSS Design System (Glassmorphism, Shimmer Skeletons, Toast Notifications, Mobile Drawer Navigation)
* **Deployment Targets**: Render (Backend Web Service), Vercel (Frontend SPA), MongoDB Atlas (Database)

---

## 📁 Folder Structure

```text
tripvault/
├── client/                 ← React (Vite) Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Footer.jsx         ← Reusable responsive footer
│   │   │   ├── Navbar.jsx         ← Responsive navbar with mobile hamburger menu
│   │   │   ├── ProtectedRoute.jsx ← Auth guard component
│   │   │   ├── SkeletonLoader.jsx ← Shimmer card & detail skeletons
│   │   │   ├── Toast.jsx          ← Lightweight Toast notification system
│   │   │   └── TripModal.jsx      ← Create/Edit trip modal
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx      ← Authenticated user dashboard
│   │   │   ├── EditProfile.jsx    ← Bio & username editor
│   │   │   ├── Login.jsx          ← Sign in view
│   │   │   ├── PublicProfile.jsx  ← Unauthenticated public profile view
│   │   │   ├── Register.jsx       ← Sign up view
│   │   │   └── TripDetail.jsx     ← Trip detail & photo gallery view
│   │   ├── api.js                 ← Central Axios instance (uses VITE_API_URL)
│   │   ├── App.jsx                ← Main routing & global providers
│   │   └── index.css              ← Glassmorphism tokens & media queries
│   ├── .env.example
│   ├── package.json
│   └── vercel.json                ← SPA routing fallback rules
├── server/                 ← Node.js + Express Backend
│   ├── middleware/
│   │   ├── authMiddleware.js      ← JWT verification
│   │   ├── tripOwnership.js       ← Ownership authorization pre-check
│   │   └── upload.js              ← Cloudinary & Multer configuration
│   ├── models/
│   │   ├── Trip.js                ← Mongoose trip schema
│   │   └── User.js                ← Mongoose user schema
│   ├── routes/
│   │   ├── auth.js                ← Auth endpoints
│   │   ├── trips.js               ← Trip CRUD & upload endpoints
│   │   └── users.js               ← Public profile & edit endpoints
│   ├── scripts/
│   │   ├── testApi.js             ← Automated API tests
│   │   ├── qa_test.js             ← Security & IDOR test suite
│   │   └── qa_week3.js            ← Upload & profile test suite
│   ├── .env.example
│   ├── .gitignore
│   ├── index.js                   ← Express entry point
│   └── package.json
└── README.md
```

---

## ⚙️ Prerequisites & Environment Variables

Ensure you have the following installed locally:
* [Node.js](https://nodejs.org/) (v18.x or v22.x)
* [MongoDB](https://www.mongodb.com/) running locally (`mongodb://127.0.0.1:27017/tripvault`) or a MongoDB Atlas URI

### Server Environment Variables (`server/.env`)
Create `server/.env` based on `server/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/tripvault
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=http://localhost:5173

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Client Environment Variables (`client/.env`)
Create `client/.env` based on `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000
VITE_GITHUB_URL=https://github.com/Chandru13k/TripVault
```

> [!WARNING]
> NEVER expose `JWT_SECRET`, `MONGO_URI`, or `CLOUDINARY_API_SECRET` to frontend code or commit them to Git.

---

## 🚀 Local Installation & Execution

### 1. Start Backend Server

```bash
cd server
npm install
npm run dev # or npm start
```
The server will connect to MongoDB and listen on `http://localhost:5000`.

### 2. Start Frontend App

```bash
cd client
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔌 API Endpoints Reference

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| **POST** | `/api/auth/register` | Register a new user | No |
| **POST** | `/api/auth/login` | Authenticate user & return JWT token | No |
| **GET** | `/api/auth/me` | Fetch authenticated user profile | **Yes** |

### User Profile Endpoints (`/api/users`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| **GET** | `/api/users/:username/profile` | Retrieve public user profile & trips | No |
| **PUT** | `/api/users/profile` | Update user profile (username, bio) | **Yes** |

### Trip Endpoints (`/api/trips`)
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :---: |
| **POST** | `/api/trips` | Create a new trip | **Yes** |
| **GET** | `/api/trips` | Retrieve logged-in user's trips | **Yes** |
| **GET** | `/api/trips/:id` | Retrieve single trip details | **Yes** (Ownership Verified) |
| **PUT** | `/api/trips/:id` | Update a trip | **Yes** (Ownership Verified) |
| **DELETE**| `/api/trips/:id` | Delete a trip | **Yes** (Ownership Verified) |
| **POST** | `/api/trips/:id/upload` | Upload cover/gallery photo | **Yes** (Ownership Verified) |

---

## 🌐 Production Deployment Guide

### Backend: Render Deployment
- **Live Backend URL**: `https://tripvault-backend-8uhd.onrender.com`
1. Connect GitHub repository to Render Web Service.
2. Set **Root Directory** to `server`.
3. Set **Start Command** to `node index.js`.
4. Configure environment variables in Render Dashboard:
   - `MONGO_URI`: MongoDB Atlas connection string
   - `JWT_SECRET`: Random 256-bit key
   - `CLIENT_URL`: `https://tripvault-two.vercel.app`
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### Frontend: Vercel Deployment
- **Live Application URL**: `https://tripvault-two.vercel.app`
1. Connect GitHub repository to Vercel.
2. Set **Root Directory** to `client`.
3. Configure environment variable in Vercel Dashboard:
   - `VITE_API_URL`: `https://tripvault-backend-8uhd.onrender.com`
4. Vercel automatically processes `client/vercel.json` for SPA routing fallback (`/index.html`).

---

## 🧪 Testing & QA Verification

Run backend test scripts from the `server` directory:

```bash
node scripts/testApi.js
node scripts/qa_test.js
node scripts/qa_week3.js
```

These automated tests verify:
- Registration, password hashing, and token issuance.
- Data isolation (User A cannot access User B's trips).
- Ownership protection (IDOR defense on GET/PUT/DELETE/Upload).
- Pre-upload authorization check before Cloudinary processing.
- Public profile sanitization (email, passwords, secrets strictly omitted).

---

## 📋 Deliverables Checklist (Weeks 1–4)

- [x] **Week 1**: JWT auth, bcrypt hashing, protected `/me`, React login/register UI, ProtectedRoute guard.
- [x] **Week 2**: Mongoose Trip schema, complete CRUD APIs, ownership middleware, dashboard cards, create/edit modal.
- [x] **Week 3**: Cloudinary file uploads, cover images & photo gallery, public profile API & page, profile editing.
- [x] **Week 4**: Reusable Navbar with mobile hamburger menu, Footer with GitHub link, Toast notification system, Skeleton loaders, responsive CSS (375px mobile through desktop), centralized `VITE_API_URL` and `CLIENT_URL`, Vercel SPA routing fallback (`vercel.json`), and Render/Vercel deployment documentation.
