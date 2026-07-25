from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- AUTH SCHEMAS ---
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    profile_pic: Optional[str] = None

class UserOut(UserBase):
    id: int
    profile_pic: Optional[str] = None
    is_admin: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut

class TokenData(BaseModel):
    user_id: Optional[int] = None

# --- RESUME SCHEMAS ---
class ResumeOut(BaseModel):
    id: int
    user_id: int
    filename: str
    file_path: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- ANALYSIS SCHEMAS ---
class AnalysisOut(BaseModel):
    id: int
    resume_id: int
    user_id: int
    job_description: Optional[str] = None
    company_name: Optional[str] = None
    ats_score: int
    feedback: str  # JSON String containing resume data extraction and suggestions
    cover_letter: Optional[str] = None
    created_at: datetime
    resume: Optional[ResumeOut] = None

    class Config:
        from_attributes = True

# --- COVER LETTER SCHEMAS ---
class CoverLetterGenerate(BaseModel):
    resume_id: int
    job_description: str
    company_name: str

# --- ADMIN PANEL SCHEMAS ---
class AdminAnalytics(BaseModel):
    total_users: int
    total_resumes: int
    total_analyses: int
    average_ats_score: float
    recent_uploads: List[Dict[str, Any]]
    skill_frequency: List[Dict[str, Any]]
