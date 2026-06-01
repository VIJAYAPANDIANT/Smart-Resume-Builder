# 🖥️ Smart Resume Builder Backend API

This directory contains the Express.js REST API server for the **Smart Resume Builder**. The backend interacts with a PostgreSQL database and utilizes Google Gemini 2.5 Flash for ATS scoring, parsing, cover letter generation, and suggestions.

---

## 🛠️ Tech Stack & Key Libraries

- **Express.js (v4.x)**: Node.js web framework for routing and handling requests.
- **PostgreSQL (`pg` pool, v8.x)**: Client pool to connect, verify, and run database schemas.
- **Google GenAI SDK (`@google/genai`, v1.x)**: Harnesses Google Gemini 2.5 Flash for advanced AI actions.
- **jsonwebtoken (v9.x)**: Secures client-to-server interactions with JWT stateless authentication.
- **bcryptjs (v2.x)**: Secure hashing for user passwords.
- **Multer (v2.x)**: Middleware for handling multipart/form-data (used for resume image uploads).
- **Helmet (v7.x) & Morgan (v1.x)**: Standard HTTP security headers and request logger middleware.

---

## 📂 Project Structure

```text
📦 backend/
├── 📁 config/
│   └── 📄 db.js               # pg Pool initialization & table creation check
├── 📁 controllers/
│   ├── 📄 authController.js   # Registration, Login, and User retrieval logic
│   ├── 📄 resumeController.js # Resume CRUD operations using raw PG queries
│   └── 📄 aiController.js     # Google Gemini API handlers (Score, Tailor, Parse)
├── 📁 middleware/
│   └── 📄 auth.js             # JWT verification middleware (checks 'x-auth-token')
├── 📁 models/
│   ├── 📄 User.js             # User database helper queries
│   └── 📄 Resume.js           # Resume database helper queries
├── 📁 routes/
│   ├── 📄 authRoutes.js       # Routes for register, login, and user details
│   ├── 📄 resumeRoutes.js     # RESTful CRUD routes for Resumes
│   └── 📄 aiRoutes.js         # Routes for AI ATS check, tailoring, parsing
├── 📄 database.sqlite         # (Legacy / local backup DB file if applicable)
├── 📄 schema.sql              # PostgreSQL DDL script for database tables
├── 📄 server.js               # Entry point of the Express application
└── 📄 vercel.json             # Vercel configuration for API deployments
```

---

## 🔑 Setup & Environment Variables

### 1. Install Dependencies
Navigate to this directory and install all node packages:
```bash
npm install
```

### 2. Configure Environment Variables
Create a file named `.env` in the `backend/` directory and specify the following keys:
```env
# Server Port
PORT=8001

# JWT Secret Key for token signing (use a long, unique random string)
JWT_SECRET=your_jwt_secret_key_here

# Google Gemini API Key (obtained from Google AI Studio)
GEMINI_API_KEY=your_gemini_api_key_here

# PostgreSQL connection string (supports Neon, Supabase PostgreSQL, or Local)
DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres
```

### 3. Database Initialization
When the server starts, it will automatically connect to the PostgreSQL database specified in `DATABASE_URL` and run the queries inside `schema.sql` if the tables do not already exist.

Alternatively, you can manually run the DDL in `schema.sql` against your PostgreSQL database instance.

---

## 🚀 Running the Server

To start the API server locally:
```bash
npm start
```
By default, the server will start listening on **`http://localhost:8001`**. You should see the following messages:
```text
PostgreSQL Database Connected Successfully
Database tables verified/initialized successfully.
Server started on port 8001
```

---

## 📡 API Reference

All protected endpoints require the custom header:
`x-auth-token: <your_jwt_token>`

### 🔐 Authentication (`/api/auth`)

| Method | Endpoint | Authentication | Request Body / Payload | Response | Description |
|--------|----------|:--------------:|------------------------|----------|-------------|
| `POST` | `/register` | ❌ | `{ "email": "...", "password": "..." }` | `{ "token": "JWT_TOKEN" }` | Registers a new user account |
| `POST` | `/login` | ❌ | `{ "email": "...", "password": "..." }` | `{ "token": "JWT_TOKEN" }` | Authenticates user & returns token |
| `GET` | `/user` | ✅ | *None* | `{ "id": 1, "email": "..." }` | Returns authenticated user details |

### 📄 Resume Management (`/api/resumes`)

| Method | Endpoint | Authentication | Request Body / Payload | Description |
|--------|----------|:--------------:|------------------------|-------------|
| `GET` | `/` | ✅ | *None* | Retrieve all resumes saved by the logged-in user |
| `POST` | `/` | ✅ | `{ "personalInfo": {...}, "education": [...], "experience": [...], "skills": [...], "projects": [...] }` | Save a new resume under the user's account |
| `GET` | `/:id` | ✅ | *None* | Get details of a single resume |
| `PUT` | `/:id` | ✅ | `{ "personalInfo": {...}, "education": [...], "experience": [...], "skills": [...], "projects": [...] }` | Update details of an existing resume |
| `DELETE` | `/:id` | ✅ | *None* | Delete a resume by its ID |

### 🤖 AI Utilities (`/api/ai`)

| Method | Endpoint | Authentication | Request Body / Payload | Description |
|--------|----------|:--------------:|------------------------|-------------|
| `POST` | `/suggestions` | ✅ | `{ "resumeData": { ... } }` | Sends resume JSON to Gemini and returns 5-7 improvement suggestions |
| `POST` | `/ats-score` | ✅ | `{ "resumeData": { ... }, "targetKeywords": ["keyword1", "keyword2"] }` | Computes a matching score (0-100) and gives feedback against keywords |
| `POST` | `/analyze-ats-image` | ✅ | `FormData: { resumeImage: File }` (Multipart) | Analyzes a uploaded screenshot/image of a resume for structure & keywords using Gemini Vision, returning a detailed score and rating |
| `POST` | `/parse` | ✅ | `FormData: { resumeImage: File }` (Multipart) | Extracts text structure from a resume image/PDF screenshot and converts it into structured Resume JSON |
| `POST` | `/tailor` | ✅ | `{ "resumeId": 1, "jobDescription": "...", "jobTitle": "...", "companyName": "..." }` | Evaluates resume against a target job listing and outputs gaps, matching skills, tailored suggestions, and a custom Cover Letter |

---

## ☁️ Deployment

For platforms like Render, Railway, or Heroku:
1. Link your repository.
2. Set the root folder of the deployment service to `backend/`.
3. Provide the environment variables (`PORT`, `JWT_SECRET`, `GEMINI_API_KEY`, `DATABASE_URL`).
4. Set the build command to `npm install` and start command to `node server.js`.
