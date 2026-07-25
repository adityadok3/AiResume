# API Documentation — ResQAI

The backend is built with FastAPI (Python) and runs on `http://localhost:8000` by default. All endpoints except Authentication endpoints require a `Bearer <JWT_TOKEN>` header.

---

## Authentication Endpoints

### 1. User Sign Up
- **Route:** `POST /signup`
- **Auth Required:** No
- **Request Body (JSON):**
  ```json
  {
    "email": "candidate@example.com",
    "name": "Jane Doe",
    "password": "securepassword123"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "email": "candidate@example.com",
    "name": "Jane Doe",
    "id": 1,
    "profile_pic": "https://api.dicebear.com/7.x/adventurer/svg?seed=Jane%20Doe",
    "is_admin": false,
    "created_at": "2026-07-25T10:14:21.123456"
  }
  ```

### 2. User Login
- **Route:** `POST /login`
- **Auth Required:** No
- **Request Body (JSON):**
  ```json
  {
    "email": "candidate@example.com",
    "password": "securepassword123"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "user": {
      "email": "candidate@example.com",
      "name": "Jane Doe",
      "id": 1,
      "profile_pic": "https://api.dicebear.com/7.x/adventurer/svg?seed=Jane%20Doe",
      "is_admin": false,
      "created_at": "2026-07-25T10:14:21.123456"
    }
  }
  ```

### 3. User Logout
- **Route:** `POST /logout`
- **Auth Required:** No
- **Response (200 OK):**
  ```json
  {
    "detail": "Successfully logged out."
  }
  ```

---

## Profile Endpoints

### 1. Get Profile
- **Route:** `GET /profile`
- **Auth Required:** Yes (`Bearer <token>`)
- **Response (200 OK):** Returns current user details.

### 2. Update Profile
- **Route:** `PUT /profile`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body (JSON - all fields optional):**
  ```json
  {
    "name": "Jane Smith",
    "email": "janesmith@example.com",
    "password": "newpassword123",
    "profile_pic": "https://api.dicebear.com/7.x/adventurer/svg?seed=Jane%20Smith"
  }
  ```
- **Response (200 OK):** Returns updated user details.

---

## Resume & Analysis Endpoints

### 1. Upload & Analyze Resume
- **Route:** `POST /upload`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Type:** Multipart Form Data (`multipart/form-data`)
- **Fields:**
  - `file`: PDF file binary data (Required)
  - `job_description`: Plain text of the job description (Optional)
  - `company_name`: Target company name (Optional)
- **Response (200 OK):**
  ```json
  {
    "analysis_id": 1,
    "resume_id": 1,
    "ats_score": 85,
    "feedback": {
      "name": "Jane Doe",
      "email": "jane.doe@example.com",
      "phone": "+1-123-456-7890",
      "skills": ["React", "FastAPI", "Python", "SQL"],
      "education": [{"degree": "Bachelor of Tech", "school": "NIT", "year": "2022-2026"}],
      "experience": [{"role": "Intern", "company": "Tech Corp", "duration": "Summer", "details": "..."}],
      "projects": [{"title": "App", "description": "..."}],
      "certifications": ["AWS Practitioner"],
      "ats_score": 85,
      "strength": "Good experience details",
      "weaknesses": ["Lacks metrics"],
      "matching_keywords": ["Python", "React"],
      "missing_keywords": ["Docker"],
      "skill_gap": ["Docker"],
      "formatting_suggestions": ["Use action verbs"],
      "grammar_suggestions": ["Ensure active voice"],
      "suggestions": {
        "summary": "...",
        "experience": "...",
        "skills": "...",
        "projects": "..."
      }
    },
    "cover_letter": "Dear hiring manager...",
    "filename": "Jane_Doe_Resume.pdf",
    "created_at": "2026-07-25T10:14:21.123456"
  }
  ```

### 2. Get Analysis History List
- **Route:** `GET /history` (or alias `GET /analysis`)
- **Auth Required:** Yes (`Bearer <token>`)
- **Response (200 OK):** Array of analysis reports.

### 3. Get Analysis Report Details
- **Route:** `GET /analysis/{analysis_id}`
- **Auth Required:** Yes (`Bearer <token>`)
- **Response (200 OK):** Full analysis details JSON object.

### 4. Delete Analysis Report
- **Route:** `DELETE /history/{analysis_id}`
- **Auth Required:** Yes (`Bearer <token>`)
- **Response (200 OK):**
  ```json
  {
    "detail": "Successfully deleted analysis history item."
  }
  ```

---

## Cover Letter Endpoints

### 1. Generate Cover Letter
- **Route:** `POST /generate-cover-letter`
- **Auth Required:** Yes (`Bearer <token>`)
- **Request Body (JSON):**
  ```json
  {
    "resume_id": 1,
    "job_description": "We are looking for a Software Engineer...",
    "company_name": "Google"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "cover_letter": "Dear Hiring Manager at Google,\n\nI am writing...",
    "analysis_id": 1
  }
  ```

---

## Admin Endpoints

### 1. Get System-wide Users
- **Route:** `GET /admin/users`
- **Auth Required:** Yes (Admin User Only)
- **Response (200 OK):** List of all user objects in database.

### 2. Delete User Account
- **Route:** `DELETE /admin/users/{user_id}`
- **Auth Required:** Yes (Admin User Only)
- **Response (200 OK):** Purges target user and cascading data.

### 3. Get Uploaded Resumes
- **Route:** `GET /admin/resumes`
- **Auth Required:** Yes (Admin User Only)
- **Response (200 OK):** List of all resume metadata.

### 4. Get System Analytics Dashboard
- **Route:** `GET /admin/analytics`
- **Auth Required:** Yes (Admin User Only)
- **Response (200 OK):**
  ```json
  {
    "total_users": 10,
    "total_resumes": 25,
    "total_analyses": 40,
    "average_ats_score": 76.5,
    "recent_uploads": [...],
    "skill_frequency": [{"skill": "Python", "count": 15}, ...]
  }
  ```
