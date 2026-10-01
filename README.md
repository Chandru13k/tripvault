# TripVault — Travel Memory Journal

TripVault is a full-stack MERN (MongoDB, Express, React, Node.js) travel memory journal that enables users to log trips, upload cover & gallery photos, customize public profiles, and securely share travel memories.

This repository features an adversarial-tested REST API, JWT authentication, Mongoose schemas, Cloudinary media storage with local disk fallback, atomic single-step journey creation with cover uploads, skeleton loaders, toast notifications, SPA routing fallbacks, and production deployment configuration for Render & Vercel.

---

## 🛠️ Tech Stack & Architecture

* **Backend**: Node.js, Express.js, MongoDB, Mongoose ORM
* **Cloud Storage & Fallback**: Cloudinary, Multer, Multer Storage Cloudinary with automatic local disk fallback (`uploads/` folder)
* **Authentication**: JSON Web Token (JWT) & `bcryptjs` password hashing (10 salt rounds)
* **Frontend**: React 19 (Vite), React Router DOM (v7), Lucide Icons
* **HTTP Client**: Axios with centralized request/response interceptors & multipart/form-data single-step uploads
* **Styling & UI**: Custom Vanilla CSS Design System (Glassmorphism, Dark Mode, Interactive Micro-Animations, Shimmer Skeletons, Toast Notifications, Mobile Drawer Navigation)
* **Deployment Targets**: Render (Backend Web Service), Vercel (Frontend SPA), MongoDB Atlas (Database)

---

## 📁 Folder Structure

```text
tripvault/
├── client-premium/         ← React (Vite) Frontend Application
│   ├── public/             ← Favicons & vector icons
│   ├── src/
│   │   ├── api/            ← Centralized Axios instance (uses VITE_API_URL)
│   │   ├── assets/         ← Hero images & brand assets
│   │   ├── components/
│   │   │   ├── AnimatedCounter.jsx   ← Dynamic stat numbers counter
│   │   │   ├── CustomCursor.jsx     ← Ambient cursor glow effect
│   │   │   ├── DestinationModal.jsx ← Destination memory modal
│   │   │   ├── Footer.jsx           ← Responsive footer component
│   │   │   ├── MagneticButton.jsx   ← Magnetic interactive CTA buttons
│   │   │   ├── Navbar.jsx           ← Navigation bar with mobile drawer
│   │   │   ├── ProtectedRoute.jsx   ← Auth route guard component
│   │   │   ├── Skeletons.jsx        ← Shimmer loading card skeletons
│   │   │   ├── StoryModal.jsx       ← Travel story viewer modal
│   │   │   ├── Toast.jsx            ← Notification toast manager
│   │   │   └── TripModal.jsx        ← Create / Edit Journey modal with cover photo upload
│   │   ├── config/
│   │   │   └── images.js            ← High-resolution destination image fallbacks
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        ← Featured trip hero & trip collection grid
│   │   │   ├── EditProfile.jsx      ← Profile editor (avatar, bio, username)
│   │   │   ├── Landing.jsx          ← Landing page, features showcase, & call-to-action
│   │   │   ├── Login.jsx            ← Sign-in page
│   │   │   ├── PublicProfile.jsx    ← Public travel profile view
│   │   │   ├── Register.jsx         ← Sign-up page
│   │   │   └── TripDetail.jsx       ← Journey details & photo gallery view
│   │   ├── App.jsx                  ← Application routes & providers
│   │   └── index.css                ← Design system tokens & utility classes
│   ├── package.json
│   └── vercel.json                  ← Vercel SPA routing rules (`/index.html`)
├── server/                 ← Node.js + Express Backend
│   ├── middleware/
│   │   ├── authMiddleware.js        ← JWT verification middleware
│   │   ├── tripOwnership.js         ← Ownership authorization middleware
│   │   └── upload.js                ← Cloudinary storage with local disk fallback
│   ├── models/
│   │   ├── Trip.js                  ← Mongoose trip schema
│   │   └── User.js                  ← Mongoose user schema
│   ├── routes/
│   │   ├── auth.js                  ← Register, Login, and /me routes
│   │   ├── trips.js                 ← Trip CRUD & upload endpoints
│   │   └── users.js                 ← User profile endpoints
│   ├── scripts/
│   │   ├── testApi.js               ← Automated API tests
│   │   ├── qa_test.js               ← Security test suite
│   │   └── qa_week3.js              ← Upload & profile test suite
│   ├── .env.example
│   ├── index.js                     ← Express server entry point
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

### Client Environment Variables (`client-premium/.env`)
Create `client-premium/.env` based on `client-premium/.env.example`:

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
cd client-premium
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
| **POST** | `/api/trips` | Create trip (accepts JSON or `multipart/form-data` with cover image) | **Yes** |
| **GET** | `/api/trips` | Retrieve logged-in user's trips | **Yes** |
| **GET** | `/api/trips/:id` | Retrieve single trip details | **Yes** (Ownership Verified) |
| **PUT** | `/api/trips/:id` | Update a trip (accepts JSON or `multipart/form-data` with cover image) | **Yes** (Ownership Verified) |
| **DELETE**| `/api/trips/:id` | Delete a trip | **Yes** (Ownership Verified) |
| **POST** | `/api/trips/:id/upload` | Upload gallery photo | **Yes** (Ownership Verified) |

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
2. Set **Root Directory** to `client-premium`.
3. Configure environment variable in Vercel Dashboard:
   - `VITE_API_URL`: `https://tripvault-backend-8uhd.onrender.com`
4. Vercel automatically processes `client-premium/vercel.json` for SPA routing fallback (`/index.html`).

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
- Atomic single-step creation with cover photo attachment and Cloudinary + local disk fallback.
- Public profile sanitization (email, passwords, secrets strictly omitted).
