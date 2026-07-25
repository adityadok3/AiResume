import os
import sys
import json
from datetime import datetime, timedelta

# Add parent directory to sys.path so we can import from app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, Base, engine
from app import models, auth

def seed_db():
    print("Re-creating all database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("Seeding database...")
        
        # 1. Create Admin User
        admin_pass = auth.get_password_hash("admin123")
        admin = models.User(
            email="admin@resqai.com",
            name="Alexander Wright",
            password_hash=admin_pass,
            profile_pic="https://api.dicebear.com/7.x/adventurer/svg?seed=Alexander",
            is_admin=True,
            created_at=datetime.utcnow() - timedelta(days=30)
        )
        db.add(admin)
        
        # 2. Create Candidate Users
        user1_pass = auth.get_password_hash("user123")
        candidate1 = models.User(
            email="ria.bhagat@resqai.com",
            name="Ria Bhagat",
            password_hash=user1_pass,
            profile_pic="https://api.dicebear.com/7.x/adventurer/svg?seed=Ria",
            is_admin=False,
            created_at=datetime.utcnow() - timedelta(days=15)
        )
        
        candidate2 = models.User(
            email="dev.kumar@resqai.com",
            name="Dev Kumar",
            password_hash=user1_pass,
            profile_pic="https://api.dicebear.com/7.x/adventurer/svg?seed=Dev",
            is_admin=False,
            created_at=datetime.utcnow() - timedelta(days=10)
        )
        
        db.add(candidate1)
        db.add(candidate2)
        db.commit()
        db.refresh(admin)
        db.refresh(candidate1)
        db.refresh(candidate2)
        
        # 3. Create Resumes
        resume1 = models.Resume(
            user_id=candidate1.id,
            filename="Ria_Bhagat_Software_Engineer.pdf",
            file_path="uploads/seed_ria_resume.pdf",
            parsed_text="Ria Bhagat\nEmail: ria.bhagat@resqai.com\nPhone: (555) 123-4567\nSkills: React, Node.js, Python, JavaScript, CSS, HTML, REST APIs, Git\nEducation: B.Tech Computer Engineering at NIT (GPA 9.2)\nExperience: Web Developer Intern at CodeLabs (Summer 2025). Designed interfaces, integrated APIs.",
            created_at=datetime.utcnow() - timedelta(days=5)
        )
        
        resume2 = models.Resume(
            user_id=candidate2.id,
            filename="Dev_Kumar_Data_Analyst.pdf",
            file_path="uploads/seed_dev_resume.pdf",
            parsed_text="Dev Kumar\nEmail: dev.kumar@resqai.com\nPhone: (555) 765-4321\nSkills: Python, SQL, Tableau, Pandas, NumPy, Machine Learning, Data Analytics\nEducation: B.Tech Computer Engineering at NIT\nExperience: Data Science Intern at MatrixAnalytics (6 months). Built dashboards, optimized SQL queries.",
            created_at=datetime.utcnow() - timedelta(days=4)
        )
        
        # Another resume for user1 (older version)
        resume3 = models.Resume(
            user_id=candidate1.id,
            filename="Ria_Bhagat_Resume_v1.pdf",
            file_path="uploads/seed_ria_resume_v1.pdf",
            parsed_text="Ria Bhagat\nEmail: ria.bhagat@resqai.com\nSkills: Java, HTML, CSS, JavaScript\nEducation: B.Tech NIT",
            created_at=datetime.utcnow() - timedelta(days=12)
        )
        
        db.add(resume1)
        db.add(resume2)
        db.add(resume3)
        db.commit()
        db.refresh(resume1)
        db.refresh(resume2)
        db.refresh(resume3)
        
        # 4. Create Analyses
        analysis1_feedback = {
            "name": "Ria Bhagat",
            "email": "ria.bhagat@resqai.com",
            "phone": "(555) 123-4567",
            "skills": ["React", "Node.js", "Python", "JavaScript", "CSS", "HTML", "REST APIs", "Git"],
            "education": [{"degree": "B.Tech Computer Engineering", "school": "NIT", "year": "2022-2026"}],
            "experience": [{"role": "Web Developer Intern", "company": "CodeLabs", "duration": "Summer 2025", "details": "Designed interfaces, integrated APIs."}],
            "projects": [{"title": "Portfolio Web Application", "description": "Designed a personal portfolio using React and CSS."}],
            "certifications": ["AWS Cloud Practitioner"],
            "ats_score": 88,
            "strength": "Solid base in modern web development technologies and highly structured project details.",
            "weaknesses": [
                "Lacks quantitative metrics to validate internship outcomes.",
                "Missing keywords like CI/CD, TypeScript, and Docker, which are standard for junior engineering roles."
            ],
            "matching_keywords": ["React", "JavaScript", "HTML", "CSS", "Git", "REST APIs"],
            "missing_keywords": ["TypeScript", "Docker", "CI/CD", "PostgreSQL"],
            "skill_gap": ["TypeScript", "Docker", "PostgreSQL"],
            "formatting_suggestions": [
                "Utilize active action verbs for bullet points instead of descriptive lists.",
                "Ensure spacing around headers is uniform."
            ],
            "grammar_suggestions": [
                "No grammatical errors detected, overall clarity is high."
            ],
            "suggestions": {
                "summary": "Motivated Computer Engineering student with internship experience building responsive interfaces and API integrations with React and Node.js. Eager to solve real-world scalability issues.",
                "experience": "In internship details, replace with: 'Developed 5 user-facing React components that reduced client load times by 20% and integrated 4 critical REST endpoints.'",
                "skills": "Group skills: Frontend (React, HTML/CSS, JS), Backend (Node.js, Python), Dev Tools (Git, GitHub)",
                "projects": "Highlight state management: 'Engineered portfolio app with React Context API, lowering global state rendering latency.'"
            }
        }
        
        analysis1 = models.Analysis(
            resume_id=resume1.id,
            user_id=candidate1.id,
            job_description="We are looking for a Software Engineer with React, TypeScript, Node.js, and Docker experience. Must be familiar with SQL databases and CI/CD pipelines.",
            company_name="CloudScale Technologies",
            ats_score=88,
            feedback=json.dumps(analysis1_feedback),
            cover_letter="""Dear Hiring Manager,

I am writing to express my enthusiastic interest in the Software Engineer position at CloudScale Technologies. As a Computer Engineering student at NIT with hands-on experience building web interfaces with React and backend services in Node.js, I believe I am well-positioned to contribute to your engineering team.

During my Web Developer Internship at CodeLabs, I gained valuable practical experience designing interactive components and integrating backend APIs. I am eager to expand my skillset to include TypeScript, Docker, and CI/CD pipelines, which align closely with your job requirements.

I am highly motivated, love writing clean code, and look forward to the opportunity of discussing my fit for CloudScale Technologies.

Sincerely,
Ria Bhagat""",
            created_at=datetime.utcnow() - timedelta(days=5)
        )
        
        analysis2_feedback = {
            "name": "Dev Kumar",
            "email": "dev.kumar@resqai.com",
            "phone": "(555) 765-4321",
            "skills": ["Python", "SQL", "Tableau", "Pandas", "NumPy", "Machine Learning", "Data Analytics"],
            "education": [{"degree": "B.Tech Computer Engineering", "school": "NIT", "year": "2022-2026"}],
            "experience": [{"role": "Data Science Intern", "company": "MatrixAnalytics", "duration": "6 months", "details": "Built dashboards, optimized SQL queries."}],
            "projects": [{"title": "Housing Price Predictor", "description": "Developed linear regression models in Python."}],
            "certifications": ["Google Data Analytics Specialization"],
            "ats_score": 82,
            "strength": "Strong analytical toolkit with Python, Pandas, and SQL. Hands-on experience building interactive Tableau dashboards.",
            "weaknesses": [
                "Lacks software development skills like Git, Docker, and API construction.",
                "Could benefit from displaying larger dataset sizes analyzed."
            ],
            "matching_keywords": ["Python", "SQL", "Machine Learning", "Tableau", "Pandas"],
            "missing_keywords": ["Git", "GitLab", "BigQuery", "Snowflake"],
            "skill_gap": ["Git", "BigQuery", "Snowflake"],
            "formatting_suggestions": [
                "Keep bullet points concise and restricted to three per role.",
                "Separate technical skills from soft skills."
            ],
            "grammar_suggestions": [
                "Ensure consistency in capitalize names and skills."
            ],
            "suggestions": {
                "summary": "Analytical Computer Engineering student specializing in Data Analytics and Machine Learning. Experienced in ETL pipelining, query optimizations, and dashboard design.",
                "experience": "For Data Science Intern: 'Optimized PostgreSQL data warehouse queries, improving report generation speeds by 35%.'",
                "skills": "Categorize as: Programming (Python, SQL), Frameworks (Pandas, NumPy, Scikit-Learn), Visualization (Tableau, PowerBI)",
                "projects": "Specify dataset scale: 'Built price predictive model trained on 50,000+ housing transaction rows using Scikit-Learn.'"
            }
        }
        
        analysis2 = models.Analysis(
            resume_id=resume2.id,
            user_id=candidate2.id,
            job_description="Looking for a Data Analyst with expert SQL query writing, Python scripting, Tableau analytics, and Git version control experience.",
            company_name="Alpha Retail Group",
            ats_score=82,
            feedback=json.dumps(analysis2_feedback),
            cover_letter="""Dear Hiring Manager at Alpha Retail Group,

I am writing to apply for the Data Analyst role. I have extensive experience writing complex SQL queries and building automated data scripts in Python, having worked as a Data Science Intern at MatrixAnalytics.

My qualifications align well with your search for a candidate who is comfortable manipulating database records, creating visual Tableau reports, and translating raw numbers into business insights.

I appreciate your consideration and welcome the opportunity to discuss my qualifications further.

Sincerely,
Dev Kumar""",
            created_at=datetime.utcnow() - timedelta(days=4)
        )
        
        # User 1 old analysis (low score, default analysis without job description)
        analysis3_feedback = {
            "name": "Ria Bhagat",
            "email": "ria.bhagat@resqai.com",
            "phone": "Unknown",
            "skills": ["Java", "HTML", "CSS", "JavaScript"],
            "education": [{"degree": "B.Tech", "school": "NIT", "year": "2022-2026"}],
            "experience": [],
            "projects": [],
            "certifications": [],
            "ats_score": 52,
            "strength": "Basic layout structure present.",
            "weaknesses": [
                "Resume lacks professional experience sections entirely.",
                "Resume lacks engineering projects details.",
                "Skills list is very short, missing modern web development stacks like React, Node.js, or cloud environments."
            ],
            "matching_keywords": ["HTML", "CSS", "JavaScript"],
            "missing_keywords": ["React", "Python", "SQL", "Git", "REST APIs"],
            "skill_gap": ["React", "Python", "SQL"],
            "formatting_suggestions": [
                "Create a projects section to demonstrate practical knowledge.",
                "Create an experience section even if it lists academic/freelance work."
            ],
            "grammar_suggestions": [
                "Lacks descriptive text."
            ],
            "suggestions": {
                "summary": "Computer Science student looking for introductory software development opportunities.",
                "experience": "Add course project contributions or student group leadership details.",
                "skills": "Expand technical list to include libraries, tools, and testing configurations.",
                "projects": "Design and build 2-3 full projects (e.g. chat room, blog engine) to list in this section."
            }
        }
        
        analysis3 = models.Analysis(
            resume_id=resume3.id,
            user_id=candidate1.id,
            job_description=None,
            company_name=None,
            ats_score=52,
            feedback=json.dumps(analysis3_feedback),
            cover_letter=None,
            created_at=datetime.utcnow() - timedelta(days=12)
        )
        
        db.add(analysis1)
        db.add(analysis2)
        db.add(analysis3)
        db.commit()
        
        print("Database seeded successfully with:")
        print(f"- 1 Admin user ({admin.email})")
        print(f"- 2 Candidates ({candidate1.email}, {candidate2.email})")
        print(f"- 3 Resumes uploaded")
        print(f"- 3 Analysis reports generated")
        
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {str(e)}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
