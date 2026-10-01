# TripVault — Travel Memory Journal

TripVault is a full-stack MERN (MongoDB, Express, React, Node.js) travel memory journal that enables users to log trips, upload cover & gallery photos, customize public profiles, and securely share travel memories.

This repository features the complete **Week 1 through Week 4** deliverables and the **Premium Glassmorphism Edition** (`client-premium`), including an adversarial-tested REST API, JWT authentication, Mongoose schemas, Cloudinary media storage with local fallback, atomic single-step journey creation with cover uploads, skeleton loaders, toast notifications, SPA routing fallbacks, and production deployment configuration for Render & Vercel.

---

## 🛠️ Tech Stack & Architecture

* **Backend**: Node.js, Express.js, MongoDB, Mongoose ORM
* **Cloud Storage & Fallback**: Cloudinary, Multer, Multer Storage Cloudinary with automatic local disk fallback (`uploads/` folder)
* **Authentication**: JSON Web Token (JWT) & `bcryptjs` password hashing (10 salt rounds)
* **Premium Frontend (`client-premium`)**: React 19 (Vite), React Router DOM (v7), Lucide Icons
* **Classic Frontend (`client`)**: React 19 (Vite), React Router DOM (v7)
* **HTTP Client**: Axios with centralized request/response interceptors & multipart/form-data single-step uploads
* **Styling & UI**: Custom Vanilla CSS Design System (Glassmorphism 2.0, Dark Mode, Interactive Micro-Animations, Shimmer Skeletons, Toast Notifications, Mobile Drawer Navigation)
* **Deployment Targets**: Render (Backend Web Service), Vercel (Frontend SPA), MongoDB Atlas (Database)

---

## 📁 Folder Structure

```text
tripvault/
├── client-premium/         ← Active Premium React (Vite) Frontend
│   ├── public/             ← Favicons & vector icons
│   ├── src/
│   │   ├── api/            ← Centralized Axios instance (uses VITE_API_URL)
│   │   ├── assets/         ← Hero images & brand assets
│   │   ├── components/
│   │   │   ├── AnimatedCounter.jsx   ← Dynamic stat numbers counter
│   │   │   ├── CustomCursor.jsx     ← Modern ambient cursor glow
│   │   │   ├── DestinationModal.jsx ← Quick destination memory modal
│   │   │   ├── Footer.jsx           ← Premium responsive footer
│   │   │   ├── MagneticButton.jsx   ← Interactive magnetic CTA buttons
│   │   │   ├── Navbar.jsx           ← Glassmorphism navbar with mobile drawer
│   │   │   ├── ProtectedRoute.jsx   ← Auth route guard
│   │   │   ├── Skeletons.jsx        ← Shimmer loading cards & detail skeletons
│   │   │   ├── StoryModal.jsx       ← Fullscreen travel story memory viewer
│   │   │   ├── Toast.jsx            ← Notification toast manager
│   │   │   └── TripModal.jsx        ← Create / Edit Journey modal with cover photo upload
│   │   ├── config/
│   │   │   └── images.js            ← Curated high-res Unsplash destination fallbacks
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        ← Featured trip hero & 4:3 card collection grid
│   │   │   ├── EditProfile.jsx      ← Profile editor (avatar, bio, username)
│   │   │   ├── Landing.jsx          ← Hero banner, features, and public showcase
│   │   │   ├── Login.jsx            ← Sign-in view with validation
│   │   │   ├── PublicProfile.jsx    ← Unauthenticated public trip journal profile
│   │   │   ├── Register.jsx         ← Sign-up view
│   │   │   └── TripDetail.jsx       ← Interactive journey view & photo gallery
│   │   ├── App.jsx                  ← Main router & provider setup
│   │   └── index.css                ← Glassmorphism design tokens & media queries
│   ├── package.json
│   └── vercel.json                  ← Vercel SPA routing rewrite rules (`/index.html`)
├── client/                 ← Classic React (Vite) Frontend
├── server/                 ← Node.js + Express Backend
│   ├── middleware/
│   │   ├── authMiddleware.js        ← JWT verification middleware
│   │   ├── tripOwnership.js         ← IDOR & ownership pre-check middleware
│   │   └── upload.js                ← Cloudinary storage + local disk fallback streaming
│   ├── models/
│   │   ├── Trip.js                  ← Mongoose trip schema
│   │   └── User.js                  ← Mongoose user schema
│   ├── routes/
│   │   ├── auth.js                  ← Register, Login, and /me endpoints
│   │   ├── trips.js                 ← Atomic Trip CRUD & image upload endpoints
│   │   └── users.js                 ← Public profiles & profile edit endpoints
│   ├── scripts/
│   │   ├── testApi.js               ← Automated API verification
│   │   ├── qa_test.js               ← Security & IDOR test suite
│   │   └── qa_week3.js              ← Photo upload & profile test suite
│   ├── .env.example
│   ├── index.js                     ← Express entry point & static `/uploads` serving
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

### 2. Start Premium Frontend App

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
| **POST** | `/api/trips` | Atomic trip creation (accepts JSON or `multipart/form-data` with cover image) | **Yes** |
| **GET** | `/api/trips` | Retrieve logged-in user's trips | **Yes** |
| **GET** | `/api/trips/:id` | Retrieve single trip details | **Yes** (Ownership Verified) |
| **PUT** | `/api/trips/:id` | Update a trip (accepts JSON or `multipart/form-data` with updated cover image) | **Yes** (Ownership Verified) |
| **DELETE**| `/api/trips/:id` | Delete a trip | **Yes** (Ownership Verified) |
| **POST** | `/api/trips/:id/upload` | Upload additional gallery photo | **Yes** (Ownership Verified) |

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

### Frontend: Vercel Deployment (Premium Version)
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

---

## 📋 Deliverables Checklist (Weeks 1–4 & Premium Edition)

- [x] **Week 1**: JWT auth, bcrypt hashing, protected `/me`, React login/register UI, ProtectedRoute guard.
- [x] **Week 2**: Mongoose Trip schema, complete CRUD APIs, ownership middleware, dashboard cards, create/edit modal.
- [x] **Week 3**: Cloudinary file uploads with local fallback, cover images & photo gallery, public profile API & page, profile editing.
- [x] **Week 4**: Reusable Navbar with mobile hamburger drawer, Footer with GitHub link, Toast notification system, Skeleton loaders, responsive CSS (375px mobile through desktop), centralized `VITE_API_URL` and `CLIENT_URL`, Vercel SPA routing fallback (`vercel.json`), and Render/Vercel deployment documentation.
- [x] **Premium Glassmorphism Edition**: Modern dark glass design system, magnetic CTA buttons, animated counters, custom cursor glow, 4:3 trip collection card grid, featured trip hero banner, and single-step atomic trip & image creation.
