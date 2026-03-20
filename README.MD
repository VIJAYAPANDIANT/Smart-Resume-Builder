# 📄 Smart Resume Builder with AI ATS Checker

A modern, full-stack web application designed to help users quickly and easily build professional, eye-catching resumes. Furthermore, it incorporates an **AI-powered ATS (Applicant Tracking System) Checker** that analyzes user resumes and provides detailed, actionable feedback to guarantee high match rates for their desired jobs.

---

## ✨ Key Features

1. **Interactive Resume Builder** 
   - Clean, intuitive interface for adding personal details, experience, education, and skills.
   - Real-time side-by-side preview pane.
   - Professional templates for quick formatting.
   
2. **AI-Powered ATS Checker** 
   - Upload screenshots or images of a resume to receive an instantaneous ATS compatibility score.
   - Uses OpenAI Vision API to securely analyze the text, layout, and professionalism of the resume.
   - Identifies specific strengths, weaknesses, and suggests actionable improvements.

3. **Multi-Page PDF Export**
   - Resumes seamlessly export to high-quality PDF files for direct download.
   - Intelligent paginated breaks ensure resumes can span multiple pages dynamically without getting cut off.

4. **Modern, Responsive UI**
   - Built with Tailwind CSS for a premium, sleek Aesthetic.
   - Full **Dark Mode / Light Mode** support out-of-the-box.
   - Smooth animations and transitions leveraging Framer Motion.

5. **Secure Authentication & Dashboard**
   - Secure User Authentication pipeline using JWT (JSON Web Tokens).
   - Passwords securely hashed with `bcryptjs`.
   - A dedicated dashboard to manage and delete saved resumes.

6. **Help Center & Direct Support**
   - Comprehensive Help page with information on AI Resume Building and ATS Checking.
   - Direct contact buttons for WhatsApp and Email Support for instant assistance.
   - Modern, responsive layout with smooth entrance animations.

---

## 💻 Tech Stack

### Frontend (User Interface)
- **Framework:** React.js (via Vite)
- **Styling:** Tailwind CSS 
- **Icons:** Lucide-React
- **Animations:** Framer Motion
- **PDF Generation:** html2pdf.js
- **Routing:** React Router DOM
- **Network Requests:** Axios

### Backend (Server & API)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite (Lightweight, embedded SQL database)
- **Image Uploads/Parsing:** Multer 
- **AI Integration:** OpenAI API SDK
- **Authentication:** jsonwebtoken (JWT), bcryptjs
- **Error Handling:** Global handlers for `uncaughtException` and `unhandledRejection` for enhanced server stability.
- **RESTful API:** Standardized JSON error responses for consistent frontend-backend communication.

---

## 🛠️ Local Development Setup

To run this application locally on your computer, you need to start both the `backend` and `frontend` servers.

### 1. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your Environment Variables. Create a `.env` file in the `backend/` folder and add the following keys:
   ```env
   PORT=8000
   JWT_SECRET=your_super_secret_jwt_key
   OPENAI_API_KEY=your_openai_api_key_here
   ```
4. Start the backend server:
   ```bash
   npm run dev
   # Server will start on http://localhost:8000
   ```

### 2. Frontend Setup
1. Open a *new* terminal window and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   # App will start on http://localhost:5173
   ```

---

## 🚀 Deployment Guide (Vercel)

This application is configured for extremely simple deployment to Vercel thanks to the included `vercel.json` file. 

1. Push your entire project to a **GitHub Repository**.
2. Make sure you have **removed `node_modules`** from your repository using `.gitignore` (This prevents Vercel Error 126!).
3. Go to [Vercel](https://vercel.com) and import your Git Repository.
4. Set the **Root Directory** to `frontend`.
5. Vercel will automatically read the `vercel.json` file and successfully execute the `npx vite build` command.
6. Make sure to deploy your Node.js `backend` separately (using Render or Railway) and update the `baseURL` inside `frontend/src/services/api.js` to point to your new live backend server instead of localhost.

---

## 📂 Project Structure

```text
📦 Smart-Resume-Builder/
├── 📁 backend/                # Express.js Server
│   ├── 📁 config/             # SQLite DB Initialization
│   ├── 📁 controllers/        # Business Logic (AI, Auth, Resumes)
│   ├── 📁 middleware/         # Output Validation & JWT Auth
│   ├── 📁 models/             # Database Models (User, Resume)
│   ├── 📁 routes/             # API Endpoint Definitions
│   ├── 📄 database.sqlite     # Local SQLite Database File
│   └── 📄 server.js           # Main Entry Point
│
├── 📁 frontend/               # React.js UI
│   ├── 📁 public/             # Static Assets
│   ├── 📁 src/
│   │   ├── 📁 components/     # Reusable UI (Navbar, Preview pane, Modals)
│   │   ├── 📁 context/        # Global State (AuthContext, ThemeContext)
│   │   ├── 📁 pages/          # Main Views (Dashboard, Builder, ATS Checker, Login)
│   │   ├── 📁 services/       # API Axios Configuration
│   │   ├── 📄 App.jsx         # Main App Routing Configuration
│   │   └── 📄 index.css       # Global Tailwind Directives & Custom Layer Classes
│   ├── 📄 vercel.json         # Vercel Deployment Override Configuration
│   └── 📄 vite.config.js      # Vite Bundler Settings
│
└── 📄 README.md               # Project Documentation
```

---

## 🌟 Final Thought

> *"Your resume is not just a document—it's the blueprint of your professional journey. Build it with purpose, design it with care, and let it open the doors to your future."*

**Build your future today.**
