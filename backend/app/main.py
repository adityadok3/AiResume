import os
import json
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
import shutil

from app.database import engine, get_db, Base
from app import models, schemas, auth, pdf_parser, ai_service
from app.config import settings

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME)

# Enable CORS for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


# --- AUTHENTICATION ENDPOINTS ---

@app.post("/signup", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def signup(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )
    
    # Check if this is the first user (bootstrap admin access)
    is_admin = db.query(models.User).count() == 0
    
    # Create user
    hashed_password = auth.get_password_hash(user_in.password)
    new_user = models.User(
        email=user_in.email,
        name=user_in.name,
        password_hash=hashed_password,
        is_admin=is_admin,
        profile_pic=f"https://api.dicebear.com/7.x/adventurer/svg?seed={user_in.name}"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    

    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()

    

   

    if not user or not auth.verify_password(user_credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = auth.create_access_token(data={"sub": str(user.id)})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@app.post("/logout")
def logout():
    # Since JWT is stateless, logout is handled frontend-side. We return success.
    return {"detail": "Successfully logged out."}


# --- PROFILE ENDPOINTS ---

@app.get("/profile", response_model=schemas.UserOut)
def get_profile(current_user: models.User = Depends(auth.get_current_user)):
    return current_user


@app.put("/profile", response_model=schemas.UserOut)
def update_profile(
    user_update: schemas.UserUpdate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    if user_update.email and user_update.email != current_user.email:
        # Check if email is already taken
        existing = db.query(models.User).filter(models.User.email == user_update.email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email address is already in use."
            )
        current_user.email = user_update.email
        
    if user_update.name:
        current_user.name = user_update.name
        # Keep profile picture seed updated if not explicitly set
        if not user_update.profile_pic:
            current_user.profile_pic = f"https://api.dicebear.com/7.x/adventurer/svg?seed={user_update.name}"
            
    if user_update.password:
        current_user.password_hash = auth.get_password_hash(user_update.password)
        
    if user_update.profile_pic:
        current_user.profile_pic = user_update.profile_pic
        
    db.commit()
    db.refresh(current_user)
    return current_user


# --- RESUME & ANALYSIS ENDPOINTS ---

@app.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    job_description: Optional[str] = Form(None),
    company_name: Optional[str] = Form(None),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Validate PDF file
    if not file.filename.endswith(".pdf") and file.content_type != "application/pdf":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file type. Only PDF documents are supported."
        )
    
    # Save file locally
    file_uuid = os.urandom(8).hex()
    safe_filename = f"{file_uuid}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not save file: {str(e)}"
        )
        
    # Read saved file bytes to parse text
    try:
        with open(file_path, "rb") as f:
            pdf_bytes = f.read()
        parsed_text = pdf_parser.extract_text_from_pdf(pdf_bytes)
    except Exception as e:
        # Cleanup file if parse fails
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Could not parse resume text from PDF: {str(e)}"
        )
        
    # Save Resume record to DB
    new_resume = models.Resume(
        user_id=current_user.id,
        filename=file.filename,
        file_path=file_path,
        parsed_text=parsed_text
    )
    db.add(new_resume)
    db.commit()
    db.refresh(new_resume)
    
    # Perform AI analysis
    ai_result = ai_service.analyze_resume(parsed_text, job_description)
    
    # Generate cover letter if Job description and Company Name are both present
    cover_letter = None
    if job_description and company_name:
        cover_letter = ai_service.generate_cover_letter(parsed_text, job_description, company_name)
        
    # Save Analysis record to DB
    new_analysis = models.Analysis(
        resume_id=new_resume.id,
        user_id=current_user.id,
        job_description=job_description,
        company_name=company_name,
        ats_score=ai_result.get("ats_score", 70),
        feedback=json.dumps(ai_result),
        cover_letter=cover_letter
    )
    db.add(new_analysis)
    db.commit()
    db.refresh(new_analysis)
    
    return {
        "analysis_id": new_analysis.id,
        "resume_id": new_resume.id,
        "ats_score": new_analysis.ats_score,
        "feedback": ai_result,
        "cover_letter": new_analysis.cover_letter,
        "filename": new_resume.filename,
        "created_at": new_analysis.created_at
    }


@app.get("/analysis", response_model=List[schemas.AnalysisOut])
def get_analyses(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    # Returns the history of analyses
    return db.query(models.Analysis).filter(models.Analysis.user_id == current_user.id).order_by(models.Analysis.created_at.desc()).all()


@app.get("/analysis/{analysis_id}")
def get_analysis_details(
    analysis_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    analysis = db.query(models.Analysis).filter(
        models.Analysis.id == analysis_id
    ).first()
    
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis report not found.")
        
    # Check permissions (either the owner or an admin)
    if analysis.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
        
    try:
        feedback_json = json.loads(analysis.feedback)
    except Exception:
        feedback_json = {}
        
    return {
        "id": analysis.id,
        "resume_id": analysis.resume_id,
        "user_id": analysis.user_id,
        "job_description": analysis.job_description,
        "company_name": analysis.company_name,
        "ats_score": analysis.ats_score,
        "feedback": feedback_json,
        "cover_letter": analysis.cover_letter,
        "created_at": analysis.created_at,
        "filename": analysis.resume.filename if analysis.resume else "Unknown File"
    }


@app.get("/history", response_model=List[schemas.AnalysisOut])
def get_history(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(models.Analysis).filter(models.Analysis.user_id == current_user.id).order_by(models.Analysis.created_at.desc()).all()


@app.delete("/history/{analysis_id}")
def delete_history_item(
    analysis_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    analysis = db.query(models.Analysis).filter(models.Analysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis report not found.")
        
    if analysis.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
        
    # Optional: Delete the physical PDF file if no other analysis is referencing it
    resume_id = analysis.resume_id
    db.delete(analysis)
    db.commit()
    
    # Check if resume still has analyses, else delete resume & file
    remaining = db.query(models.Analysis).filter(models.Analysis.resume_id == resume_id).count()
    if remaining == 0:
        resume = db.query(models.Resume).filter(models.Resume.id == resume_id).first()
        if resume:
            if os.path.exists(resume.file_path):
                try:
                    os.remove(resume.file_path)
                except Exception:
                    pass
            db.delete(resume)
            db.commit()
            
    return {"detail": "Successfully deleted analysis history item."}


# --- COVER LETTER ENDPOINTS ---

@app.post("/generate-cover-letter")
def generate_cover_letter_api(
    req: schemas.CoverLetterGenerate,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(models.Resume).filter(models.Resume.id == req.resume_id).first()
    if not resume:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resume not found.")
        
    if resume.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")
        
    # Generate cover letter
    cover_letter = ai_service.generate_cover_letter(resume.parsed_text, req.job_description, req.company_name)
    
    # Find the matching analysis (if any) and save the cover letter to it
    analysis = db.query(models.Analysis).filter(
        models.Analysis.resume_id == req.resume_id,
        models.Analysis.user_id == current_user.id
    ).order_by(models.Analysis.created_at.desc()).first()
    
    if analysis:
        analysis.cover_letter = cover_letter
        analysis.job_description = req.job_description
        analysis.company_name = req.company_name
        db.commit()
        db.refresh(analysis)
        
    return {
        "cover_letter": cover_letter,
        "analysis_id": analysis.id if analysis else None
    }


# --- ADMIN PANEL ENDPOINTS ---

@app.get("/admin/users", response_model=List[schemas.UserOut])
def admin_get_users(
    admin_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(models.User).order_by(models.User.created_at.desc()).all()


@app.delete("/admin/users/{user_id}")
def admin_delete_user(
    user_id: int,
    admin_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    if user_id == admin_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot delete your own administrative account."
        )
        
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
        
    # Delete uploaded resume files for this user
    resumes = db.query(models.Resume).filter(models.Resume.user_id == user_id).all()
    for resume in resumes:
        if os.path.exists(resume.file_path):
            try:
                os.remove(resume.file_path)
            except Exception:
                pass
                
    db.delete(user)
    db.commit()
    return {"detail": f"Successfully deleted user account ID {user_id} and all related records."}


@app.get("/admin/resumes", response_model=List[schemas.ResumeOut])
def admin_get_resumes(
    admin_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    return db.query(models.Resume).order_by(models.Resume.created_at.desc()).all()


@app.get("/admin/analytics", response_model=schemas.AdminAnalytics)
def admin_get_analytics(
    admin_user: models.User = Depends(auth.get_current_admin),
    db: Session = Depends(get_db)
):
    total_users = db.query(models.User).count()
    total_resumes = db.query(models.Resume).count()
    total_analyses = db.query(models.Analysis).count()
    
    avg_ats = db.query(func.avg(models.Analysis.ats_score)).scalar()
    average_ats_score = float(avg_ats) if avg_ats is not None else 0.0
    
    # Get 10 recent uploads with user information
    recent_analyses = db.query(models.Analysis).order_by(models.Analysis.created_at.desc()).limit(10).all()
    recent_uploads = []
    for a in recent_analyses:
        recent_uploads.append({
            "analysis_id": a.id,
            "filename": a.resume.filename if a.resume else "Unknown",
            "username": a.user.name if a.user else "Unknown",
            "email": a.user.email if a.user else "Unknown",
            "ats_score": a.ats_score,
            "created_at": a.created_at.isoformat()
        })
        
    # Calculate skill frequency aggregation
    all_analyses = db.query(models.Analysis.feedback).all()
    skills_map = {}
    for (feedback_str,) in all_analyses:
        try:
            feedback_json = json.loads(feedback_str)
            skills = feedback_json.get("skills", [])
            for skill in skills:
                # Standardize casing
                skill_std = skill.strip().title()
                # Exception for common lowercase/uppercase acronyms
                if skill_std.lower() in ["aws", "gcp", "api", "rest", "sql", "css", "html", "js", "ts"]:
                    skill_std = skill_std.upper()
                skills_map[skill_std] = skills_map.get(skill_std, 0) + 1
        except Exception:
            continue
            
    # Sort and take top 10 skills
    sorted_skills = sorted(skills_map.items(), key=lambda x: x[1], reverse=True)[:10]
    skill_frequency = [{"skill": s, "count": c} for s, c in sorted_skills]
    
    # If no analyses yet, add some dummy metrics
    if not skill_frequency:
        skill_frequency = [
            {"skill": "React", "count": 15},
            {"skill": "Python", "count": 12},
            {"skill": "SQL", "count": 9},
            {"skill": "FastAPI", "count": 8},
            {"skill": "Tailwind CSS", "count": 7}
        ]

    return {
        "total_users": total_users,
        "total_resumes": total_resumes,
        "total_analyses": total_analyses,
        "average_ats_score": average_ats_score,
        "recent_uploads": recent_uploads,
        "skill_frequency": skill_frequency
    }
