# 📄 Smart Resume Builder with AI ATS Checker

![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Node Version](https://img.shields.io/badge/v18+-brightgreen?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)

---

**Smart Resume Builder** is a full-stack, production-ready web application that enables users to **build professional resumes, check ATS compatibility using AI, and export polished PDFs instantly**. It features a live preview builder, OpenAI-powered resume scoring, JWT authentication, and a personal dashboard — all built with a modern tech stack and designed for a premium user experience. Deployed on **Vercel**.

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Live Demo](#-live-demo)
3. [Features](#-features)
4. [How It Works](#-how-it-works)
5. [Tech Stack](#-tech-stack)
6. [Project Structure](#-project-structure)
7. [Getting Started](#-getting-started)
8. [Environment Variables](#-environment-variables)
9. [API Reference](#-api-reference)
10. [Deployment Guide](#-deployment-guide)
11. [Contributing](#-contributing)
12. [License](#-license)

---

## 🔍 Overview

**Smart Resume Builder** gives job seekers a complete edge. Users sign up, build their resume with a guided form and **live side-by-side preview**, save it to their personal dashboard, and then run it through an **AI-powered ATS Checker** that uses OpenAI's Vision API to return a score, strengths, weaknesses, and specific improvement recommendations. Resumes can be exported to print-ready multi-page PDFs at any time.

---

## 🌐 Live Demo

> 🚀 **[View the Live App on Vercel →](https://smart-resume-builder-a1ej.vercel.app)**

---

## ✨ Features

### 1. 📝 Interactive Resume Builder
- Guided multi-section form: Personal Info, Work Experience, Education, and Skills.
- **Real-time live preview** pane that updates as you type.
- Create new resumes or edit existing ones from your dashboard (`/builder/:id`).

### 2. 🤖 AI-Powered ATS Checker
- Upload an image/screenshot of any resume.
- Powered by **OpenAI Vision API** — analyzes layout, keywords, and formatting.
- Returns an **ATS score (0–100)** with color-coded rating: Excellent / Good / Needs Work.
- Detailed breakdown of **Strengths**, **Weaknesses**, and **Recommendations**.

### 3. 🖨️ Multi-Page PDF Export
- Export your finished resume as a high-quality PDF.
- Smart pagination via `html2pdf.js` — content never gets clipped across pages.

### 4. 🎨 Modern, Responsive UI
- Built with **Tailwind CSS** with glassmorphism card components.
- Full **Dark Mode / Light Mode** toggle powered by `ThemeContext`.
- Smooth animated transitions using **Framer Motion**.

### 5. 🔐 Secure Authentication
- Full JWT-based stateless auth (register → login → protected routes).
- Passwords hashed with **bcryptjs**.
- `PrivateRoute` guard redirects unauthenticated users to `/login`.
- Protected pages: Dashboard, Builder, ATS Checker.
- Public pages: Home, Login, Register, Help.

### 6. 🗂️ Personal Dashboard
- View all your saved resumes in one place.
- One-click edit or delete for any resume.
- Quick-launch button to jump into the Resume Builder.

### 7. 💬 Help Center
- Comprehensive guide covering AI Resume Building and ATS Checking workflows.
- Direct **WhatsApp** and **Email** support buttons for instant assistance.

---

## ⚙️ How It Works

```
User Registers / Logs In (JWT issued)
          │
          ▼
    Resume Builder  ──────────────────────────────┐
    (Form + Live Preview)                         │
          │                                       │
          ▼                                       ▼
  Save Resume to SQLite DB           ATS Checker (Upload Image)
          │                                       │
          ▼                                       ▼
   Dashboard (Manage Resumes)    OpenAI Vision API → Score + Feedback
          │
          ▼
  Export Resume as PDF (html2pdf.js)
```

---

## 💻 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 18 | UI Framework (via Vite) |
| **Tailwind CSS** | v3 | Styling & Design System |
| **Framer Motion** | latest | Animations & Transitions |
| **Lucide React** | latest | Icon Library |
| **html2pdf.js** | latest | PDF Generation & Export |
| **React Router DOM** | v6 | Client-Side Routing |
| **Axios** | latest | HTTP Client |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | v18+ | Runtime Environment |
| **Express.js** | 4.x | Web Server & REST API |
| **SQLite** (sqlite3) | 6.x | Embedded Local Database |
| **OpenAI SDK** | 4.x | AI Vision Resume Analysis |
| **Multer** | 2.x | Multipart Image Upload |
| **jsonwebtoken** | 9.x | JWT Authentication |
| **bcryptjs** | 2.x | Password Hashing |
| **Helmet** | 7.x | HTTP Security Headers |
| **Morgan** | 1.x | HTTP Request Logging |
| **dotenv** | 16.x | Environment Variable Loader |

---

## 📂 Project Structure

```text
📦 Smart-Resume-Builder/
├── 📁 backend/                    # Express.js API Server
│   ├── 📁 config/
│   │   └── 📄 db.js               # SQLite DB initialization (initDb)
│   ├── 📁 controllers/
│   │   ├── 📄 authController.js   # Register & Login logic
│   │   ├── 📄 resumeController.js # Resume CRUD operations
│   │   └── 📄 aiController.js     # OpenAI ATS analysis
│   ├── 📁 middleware/
│   │   └── 📄 authMiddleware.js   # JWT verification middleware
│   ├── 📁 models/                 # DB query helpers (User, Resume)
│   ├── 📁 routes/
│   │   ├── 📄 authRoutes.js       # POST /api/auth/register, /login
│   │   ├── 📄 resumeRoutes.js     # GET/POST/DELETE /api/resumes
│   │   └── 📄 aiRoutes.js         # POST /api/ai/analyze-ats-image
│   ├── 📄 database.sqlite         # Local SQLite database file
│   └── 📄 server.js               # Entry point (Express app setup)
│
├── 📁 frontend/                   # React 18 + Vite UI
│   ├── 📁 public/                 # Static assets
│   ├── 📁 src/
│   │   ├── 📁 components/
│   │   │   ├── 📄 Navbar.jsx      # Top navigation bar
│   │   │   └── 📄 ResumePreview.jsx # Live resume preview pane
│   │   ├── 📁 context/
│   │   │   ├── 📄 AuthContext.jsx # Global auth state & JWT storage
│   │   │   └── 📄 ThemeContext.jsx# Dark / Light mode toggle
│   │   ├── 📁 pages/
│   │   │   ├── 📄 Home.jsx        # Landing page (public)
│   │   │   ├── 📄 Login.jsx       # Login form (public)
│   │   │   ├── 📄 Register.jsx    # Registration form (public)
│   │   │   ├── 📄 Dashboard.jsx   # Saved resumes list (protected)
│   │   │   ├── 📄 Builder.jsx     # Resume form + live preview (protected)
│   │   │   ├── 📄 ATSChecker.jsx  # AI ATS score page (protected)
│   │   │   └── 📄 Help.jsx        # Help center (public)
│   │   ├── 📁 services/
│   │   │   └── 📄 api.js          # Axios instance with base URL & JWT header
│   │   ├── 📄 App.jsx             # Route definitions (PrivateRoute guard)
│   │   └── 📄 index.css           # Tailwind directives & custom layers
│   ├── 📄 vercel.json             # Vercel deployment & SPA rewrite config
│   └── 📄 vite.config.js          # Vite bundler settings
│
└── 📄 README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js v18+** installed
- An **OpenAI API Key** ([get yours here](https://platform.openai.com/api-keys))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/smart-resume-builder.git
cd smart-resume-builder
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder (see [Environment Variables](#-environment-variables)), then:

```bash
node server.js
# ✅ Server starts on http://localhost:5000
# ✅ SQLite Connected
```

### 3. Frontend Setup

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
# ✅ App starts on http://localhost:5173
```

Open your browser at **[http://localhost:5173](http://localhost:5173)** to use the app.

---

## 🔑 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Port
PORT=5000

# Authentication — use a long, random secret string
JWT_SECRET=your_super_secret_jwt_key_here

# OpenAI — required for the ATS Checker feature
OPENAI_API_KEY=sk-your-openai-api-key-here
```

> ⚠️ **Never commit your `.env` file.** Ensure it is listed in `.gitignore`.

---

## 📡 API Reference

All protected routes require the header:
```
Authorization: Bearer <your_jwt_token>
```

### 🔐 Auth — `/api/auth`

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | `{ name, email, password }` | Register a new user |
| `POST` | `/api/auth/login` | ❌ | `{ email, password }` | Login, returns JWT token |

### 📄 Resumes — `/api/resumes`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/resumes` | ✅ | Get all resumes for the logged-in user |
| `POST` | `/api/resumes` | ✅ | Save a new resume |
| `GET` | `/api/resumes/:id` | ✅ | Get a single resume by ID |
| `PUT` | `/api/resumes/:id` | ✅ | Update an existing resume |
| `DELETE` | `/api/resumes/:id` | ✅ | Delete a resume by ID |

### 🤖 AI — `/api/ai`

| Method | Endpoint | Auth | Body | Description |
|--------|----------|------|------|-------------|
| `POST` | `/api/ai/analyze-ats-image` | ✅ | `FormData: { resumeImage: File }` | Analyze resume image, returns ATS score + feedback |

**Example ATS Response:**
```json
{
  "score": 78,
  "summary": "A strong resume with good structure, but missing key technical keywords.",
  "feedback": {
    "strengths": ["Clean layout", "Quantified achievements"],
    "weaknesses": ["Missing technical skills section"],
    "recommendations": ["Add a Skills section with relevant technologies"]
  }
}
```

---

## ☁️ Deployment Guide

### Frontend → Vercel

1. Push your project to a **GitHub Repository**.
2. Ensure `node_modules` is in `.gitignore`.
3. Go to [vercel.com](https://vercel.com) → **Import** your repository.
4. Set **Root Directory** to `frontend`.
5. Vercel will auto-detect Vite and run `npx vite build`.

### Backend → Render / Railway

1. Deploy the `backend/` folder as a **Node.js Web Service**.
2. Set all environment variables (`PORT`, `JWT_SECRET`, `OPENAI_API_KEY`) in the dashboard.
3. Set the **Start Command** to: `node server.js`
4. After deployment, copy your live backend URL and update `frontend/src/services/api.js`:

```js
// Change from:
baseURL: 'http://localhost:5000/api'
// To:
baseURL: 'https://your-backend.onrender.com/api'
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a **Pull Request**

---

> *"Your resume is not just a document — it's the blueprint of your professional journey. Build it with purpose, design it with care, and let it open the doors to your future."*
>
> **Build your future today. 🚀**
