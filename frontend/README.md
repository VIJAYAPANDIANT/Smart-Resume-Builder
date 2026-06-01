# 🎨 Smart Resume Builder Frontend UI

This directory contains the user interface for the **Smart Resume Builder** web application. It is a single-page application (SPA) built using **React 18** and **Vite**, styled with **Tailwind CSS**, and animated with **Framer Motion**.

---

## 🛠️ Tech Stack & Key Libraries

- **React (v18.x)**: Core library for building standard reactive UI components.
- **Vite (v5.x)**: Fast frontend build tool and development server.
- **Tailwind CSS (v3.x)**: Utility-first CSS framework for responsive layout design.
- **Framer Motion**: Library for micro-animations and page transitions.
- **html2pdf.js**: Client-side library to convert HTML templates to PDF format.
- **docx**: Library used for client-side Word document (DOCX) compilation.
- **React Router DOM (v6.x)**: Handle protected paths and client-side routing.
- **Axios**: HTTP client configured to automatically append headers (like the authentication token `x-auth-token`).

---

## 📂 Project Structure

```text
📦 frontend/
├── 📁 public/                 # Static assets (images, icons, etc.)
├── 📁 src/
│   ├── 📁 components/
│   │   ├── 📄 Navbar.jsx      # Sticky top navbar with theme toggles, links, and profile options
│   │   └── 📄 ResumePreview.jsx # High-fidelity multi-page preview of the builder's resume
│   ├── 📁 context/
│   │   ├── 📄 AuthContext.jsx # Handles user login state, token persistence, and JWT auth flow
│   │   └── 📄 ThemeContext.jsx# Dark and Light mode state wrapper
│   ├── 📁 pages/
│   │   ├── 📄 Home.jsx        # Landing page featuring cards, hero animations, and links
│   │   ├── 📄 Login.jsx       # Login view with validation and redirect
│   │   ├── 📄 Register.jsx    # User registration view
│   │   ├── 📄 Dashboard.jsx   # List of user's resumes with actions to edit, delete, or run checker
│   │   ├── 📄 Builder.jsx     # Side-by-side forms and real-time interactive preview
│   │   ├── 📄 ATSChecker.jsx  # AI-Powered ATS Score scanner & feedback card
│   │   ├── 📄 JobTailor.jsx   # View to compare resume, insert job listing details, and get custom letter
│   │   └── 📄 Help.jsx        # FAQ, troubleshooting, and contact/support details
│   ├── 📁 services/
│   │   └── 📄 api.js          # Axios wrapper configured with a baseURL and JWT request interceptor
│   ├── 📄 App.jsx             # Main router containing guards (e.g. PrivateRoute check)
│   ├── 📄 index.css           # Tailwind configurations, custom components, and color variables
│   └── 📄 main.jsx            # Entry script to mount the React application
├── 📄 postcss.config.js       # CSS processing configs
├── 📄 tailwind.config.js      # Custom theme palettes and breakpoints for Tailwind CSS
├── 📄 vercel.json             # Vercel configuration for client routing (redirects to index.html)
└── 📄 vite.config.js          # Vite config wrapper
```

---

## 🔑 Setup & Local Development

### 1. Install Dependencies
Navigate to this directory and install all node packages:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.development` file in the `frontend/` directory to configure the local backend API server endpoint:
```env
VITE_API_BASE_URL=http://localhost:8001/api
```

Create a `.env` file for the production endpoint configuration:
```env
VITE_API_BASE_URL=https://your-backend-api.onrender.com/api
```

### 3. Run Development Server
To launch Vite's hot-reload server locally:
```bash
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 🎨 UI & Routing Details

### Contexts
- **`AuthContext`**: Manages auth states and stores tokens inside `localStorage`. Adds route protection.
- **`ThemeContext`**: Stores state for dark/light preference inside `localStorage` and toggles a `.dark` class on the root HTML document.

### Pages & Sub-Views
1. **Resume Builder (`/builder/:id` or `/builder/new`)**:
   - Left Pane: Interactive tab-based forms (Personal Info, Education, Experience, Skills, Projects).
   - Right Pane: Live rendering layout matching standard resume style rules.
2. **ATS Checker (`/ats`)**:
   - Upload any image/screenshot of your resume and see an automated audit report.
   - Shows Score dial, Strengths, Weaknesses, and recommendations.
3. **Job Tailor (`/tailor`)**:
   - Allows users to compare their resume against an input Job Description.
   - Displays a match percent score and outputs a customized Cover Letter using Gemini.
4. **Dashboard (`/dashboard`)**:
   - Central interface showing a card for each saved resume. Provides Quick Edit, Analyze, Tailor, and Delete actions.

---

## ☁️ Deployment

### Vercel (Recommended)
1. Import your project into Vercel.
2. Set **Root Directory** to `frontend`.
3. Add the environment variable `VITE_API_BASE_URL` with your production API URL.
4. Build settings are auto-detected (`npm run build`, outputting to `dist/`).
