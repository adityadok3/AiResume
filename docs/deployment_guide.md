# Deployment Guide — ResQAI

This guide details steps to deploy the frontend to **Vercel**, the backend to **Render**, and the database to **Neon**.

---

## 1. Database Setup (Neon)

Neon provides serverless PostgreSQL.
1. Sign up at [Neon.tech](https://neon.tech/) and create a new project.
2. Choose your preferred region and copy the **Connection String** from your Neon dashboard:
   `postgresql://[user]:[password]@[neon-host]/[dbname]?sslmode=require`
3. Save this value to use as the `DATABASE_URL` environment variable for your backend.

---

## 2. Backend Deployment (Render)

Render hosts Python web applications.
1. Sign up at [Render.com](https://render.com/).
2. Create a new **Web Service** and link your GitHub repository.
3. Configure the following service settings:
   - **Environment:** `Python`
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. In the **Environment Variables** section, add the following parameters:
   - `DATABASE_URL`: *Your Neon connection string copied in step 1*
   - `SECRET_KEY`: *A long secure random string for JWT hashing*
   - `GEMINI_API_KEY`: *Your Google Gemini API Key*
5. Click **Deploy Web Service**. Render will build and expose a public URL: `https://your-backend.onrender.com`.

---

## 3. Frontend Deployment (Vercel)

Vercel is optimized for building and serving Vite applications.
1. Install the Vercel CLI or import the project directly via the [Vercel Dashboard](https://vercel.com/).
2. If importing through the dashboard:
   - Select your project repository.
   - Set **Framework Preset** to `Vite`.
   - Set **Root Directory** to `frontend`.
   - Set **Build Command** to `npm run build`.
   - Set **Output Directory** to `dist`.
3. In the **Environment Variables** section, add:
   - `VITE_API_URL`: `https://your-backend.onrender.com` (your deployed Render backend URL, without a trailing slash).
4. Click **Deploy**. Vercel will build your static files and assign a live production URL (e.g. `https://resqai.vercel.app`).

---

## Environment Variables Reference

### Backend (`backend/.env`)
```bash
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
SECRET_KEY=generate-a-secure-random-key-here
GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere
```

### Frontend (`frontend/.env`)
```bash
VITE_API_URL=https://your-backend.onrender.com
```
