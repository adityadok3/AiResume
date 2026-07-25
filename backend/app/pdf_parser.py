from pypdf import PdfReader
import io

def extract_text_from_pdf(pdf_bytes: bytes) -> str:
    """
    Extract text content from uploaded PDF bytes using pypdf.
    Returns the combined text of all pages in the PDF.
    """
    try:
        pdf_file = io.BytesIO(pdf_bytes)
        reader = PdfReader(pdf_file)
        text_content = []
        
        for i, page in enumerate(reader.pages):
            page_text = page.extract_text()
            if page_text:
                text_content.append(page_text)
                
        full_text = "\n\n".join(text_content).strip()
        if not full_text:
            raise ValueError("No text content could be extracted from this PDF. It might contain only images.")
            
        return full_text
    except Exception as e:
        raise ValueError(f"Failed to parse PDF document: {str(e)}")
