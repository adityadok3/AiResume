# ResQAI — AI Resume Analyzer & ATS Optimizer

> Optimize your resume with generative AI, identify missing keywords, and draft tailored cover letters.

ResQAI is a modern, responsive, full-stack web application designed for engineering candidates. It parses PDF resumes, aggregates tech skills, matches them against target job descriptions, computes dynamic ATS suitability scores, and generates professional cover letters. 

---

## Tech Stack

### Frontend
- **React.js** (Vite SPA template)
- **Tailwind CSS** (v4 CSS-driven style system)
- **Framer Motion** (Page transitions & card interactions)
- **Lucide Icons** (UI vector indicators)
- **React Router Dom** (Workspace protected route guards)
- **Chart.js** (Analytics dashboard widgets)

### Backend & Database
- **FastAPI** (Python REST API routing framework)
- **SQLAlchemy** (ORM database mapping)
- **PyJWT** (Stateless authentication security tokens)
- **pypdf** (Binary PDF text extractor)
- **SQLite** (Default local storage file) / **PostgreSQL** (Neon production endpoint)
- **Google Gemini API** (Generative AI parsing, scoring, and text draft recommendations)

---

## Project Structure

```bash
AiResume/
├── assets/                  # Testing files and graphics
│   └── sample_resume.pdf    # Generated PDF resume for testing
├── backend/                 # Python FastAPI backend
│   ├── app/
│   │   ├── api/             # API sub-module configuration
│   │   ├── config.py        # Environment settings
│   │   ├── database.py      # SQLAlchemy connection builder
│   │   ├── models.py        # Users, Resumes, Analyses schemas
│   │   ├── schemas.py       # Pydantic request models
│   │   ├── auth.py          # Hashing and JWT tokens
│   │   ├── pdf_parser.py    # Text parsing
│   │   ├── ai_service.py    # Google Gemini service fallback
│   │   └── main.py          # Routing endpoints
│   ├── uploads/             # Saved candidate PDF uploads
│   ├── requirements.txt     # Python packages
│   ├── seed.py              # Mock data database generator
│   └── create_pdf.py        # PDF builder script
├── database/                # Database configurations
│   └── schema.sql           # Direct SQL schema definitions
├── docs/                    # Technical reference files
│   ├── api_documentation.md
│   └── deployment_guide.md
├── frontend/                # React Vite SPA frontend
│   ├── src/
│   │   ├── components/      # Common navigation, footer and guards
│   │   ├── context/         # Auth session manager
│   │   ├── pages/           # Landing, Login, Dashboard, Upload, Admin, Details
│   │   ├── services/        # Fetch API clients
│   │   ├── App.jsx          # Routing connectors
│   │   ├── index.css        # Tailwind theme imports
│   │   └── main.jsx         # Web runtime bootloader
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Local Installation & Setup

Ensure you have **Node.js (v18+)** and **Python (3.10+)** installed on your system.

### 1. Setup the Backend
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Set your Google Gemini API Key in the environment or copy a `.env` file. (If no key is provided, the application will gracefully fall back to our local high-fidelity regex analyzer so you can still test it!).
4. Run the database seed script to initialize mock users and reports:
   ```bash
   python seed.py
   ```
5. Launch the FastAPI development server:
   ```bash
   python -m uvicorn app.main:app --reload
   ```
   The backend API will be available at `http://localhost:8000`.

### 2. Setup the Frontend
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install node dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   Access the web application at `http://localhost:5173`.

---

## Default Accounts (Seeded)

The seeding script generates these credentials for immediate testing:

### Admin Account
- **Email:** `admin@resqai.com`
- **Password:** `admin123`
- *Accesses User purges and global database upload history.*

### Candidate Account
- **Email:** `ria.bhagat@resqai.com`
- **Password:** `user123`
- *Accesses personalized resume scanning, ATS analytics, and cover letter downloads.*

---
Deployment update

## Documentation

- Detailed API description: [API Documentation](file:///docs/api_documentation.md)
- Deployment instructions: [Deployment Guide](file:///docs/deployment_guide.md)
- SQL database structure: [Database Schema](file:///database/schema.sql)
