-- AI Resume Analyzer Database Schema (PostgreSQL & SQLite Compatible)
-- Automatically initialized via SQLAlchemy ORM on app startup.

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_pic VARCHAR(500) DEFAULT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CREATE INDEX ON EMAIL FOR FASTER LOGIN
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. RESUMES TABLE
CREATE TABLE IF NOT EXISTS resumes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    parsed_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CREATE INDEX ON USER_ID FOR QUICK QUERY BY OWNER
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);

-- 3. ANALYSES TABLE
CREATE TABLE IF NOT EXISTS analyses (
    id SERIAL PRIMARY KEY,
    resume_id INTEGER NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_description TEXT DEFAULT NULL,
    company_name VARCHAR(255) DEFAULT NULL,
    ats_score INTEGER NOT NULL,
    feedback TEXT NOT NULL, -- JSON-serialized text containing parsing and suggestions
    cover_letter TEXT DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- CREATE INDEXES ON USER_ID AND RESUME_ID
CREATE INDEX IF NOT EXISTS idx_analyses_user_id ON analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_analyses_resume_id ON analyses(resume_id);
