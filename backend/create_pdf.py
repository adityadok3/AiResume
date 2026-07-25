import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT

def create_resume_pdf():
    assets_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets")
    os.makedirs(assets_dir, exist_ok=True)
    pdf_path = os.path.join(assets_dir, "sample_resume.pdf")
    
    # Setup document
    doc = SimpleDocTemplate(pdf_path, pagesize=letter, rightMargin=54, leftMargin=54, topMargin=54, bottomMargin=54)
    story = []
    
    # Styles
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'NameHeader',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        alignment=TA_CENTER,
        textColor='#1a202c',
        spaceAfter=4
    )
    
    subtitle_style = ParagraphStyle(
        'ContactSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        alignment=TA_CENTER,
        textColor='#4a5568',
        spaceAfter=15
    )
    
    section_heading = ParagraphStyle(
        'SecHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor='#2b6cb0',
        spaceBefore=10,
        spaceAfter=6,
        borderPadding=2
    )
    
    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor='#2d3748',
        spaceAfter=6
    )
    
    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor='#2d3748',
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )
    
    # Content flow
    story.append(Paragraph("Ria Bhagat", title_style))
    story.append(Paragraph("ria.bhagat@resqai.com  |  (555) 123-4567  |  github.com/riabhagat  |  linkedin.com/in/riabhagat", subtitle_style))
    
    story.append(Paragraph("EDUCATION", section_heading))
    story.append(Paragraph("<strong>National Institute of Technology</strong> — B.Tech in Computer Engineering (GPA: 9.2/10.0) <br/> Expected Graduation: May 2026", body_style))
    story.append(Spacer(1, 4))
    
    story.append(Paragraph("TECHNICAL SKILLS", section_heading))
    story.append(Paragraph("<strong>Languages:</strong> Python, JavaScript, SQL, Java, HTML/CSS, C++", body_style))
    story.append(Paragraph("<strong>Frameworks & Libraries:</strong> React.js, Node.js, FastAPI, Express.js, Tailwind CSS", body_style))
    story.append(Paragraph("<strong>Tools & Databases:</strong> Git, Docker, PostgreSQL, SQLite, AWS (S3, EC2)", body_style))
    story.append(Spacer(1, 4))
    
    story.append(Paragraph("EXPERIENCE", section_heading))
    story.append(Paragraph("<strong>Web Developer Intern</strong> — <em>CodeLabs Technologies</em> (June 2025 – August 2025)", body_style))
    story.append(Paragraph("• Designed and integrated 5 user-facing React components using Tailwind CSS, increasing page load speeds by 20%.", bullet_style))
    story.append(Paragraph("• Built robust FastAPI backend routers, optimizing endpoint data retrieval latency by 15% with SQLite caching.", bullet_style))
    story.append(Paragraph("• Documented and tested 12 REST API endpoints using Swagger UI, reducing integration bug counts by 30%.", bullet_style))
    story.append(Spacer(1, 4))
    
    story.append(Paragraph("PROJECTS", section_heading))
    story.append(Paragraph("<strong>ResQAI — Resume Analyzer & ATS Optimizer</strong> (Personal Project)", body_style))
    story.append(Paragraph("• Engineered a full-stack React and FastAPI web application parsing PDF resumes and matching keywords against job descriptions.", bullet_style))
    story.append(Paragraph("• Integrated Google Gemini API to extract candidate data, calculate ATS scores, and suggest layout formatting tips.", bullet_style))
    story.append(Paragraph("• Implemented responsive charts utilizing Chart.js and protected route management via custom React AuthContext.", bullet_style))
    
    # Build document
    doc.build(story)
    print(f"Sample resume PDF created successfully at: {pdf_path}")

if __name__ == "__main__":
    create_resume_pdf()
