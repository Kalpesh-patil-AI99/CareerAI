from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import re
from werkzeug.utils import secure_filename

# =================================================
# CAREERAI - FLASK BACKEND
# =================================================

app = Flask(__name__)
CORS(app)

# =================================================
# UPLOAD SETTINGS
# =================================================

UPLOAD_FOLDER = "uploads"

ALLOWED_EXTENSIONS = {"pdf", "docx"}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024  # 10 MB


# =================================================
# HOME
# =================================================

@app.route("/")
def home():
    return jsonify({
        "status": "success",
        "message": "CareerAI Backend is running 🚀"
    })


# =================================================
# HEALTH CHECK
# =================================================

@app.route("/api/health")
def health():
    return jsonify({
        "status": "healthy",
        "service": "CareerAI API"
    })


# =================================================
# FILE VALIDATION
# =================================================

def allowed_file(filename):

    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower()
        in ALLOWED_EXTENSIONS
    )


# =================================================
# PDF TEXT EXTRACTION
# =================================================

def extract_pdf_text(filepath):

    try:

        from PyPDF2 import PdfReader

        reader = PdfReader(filepath)

        text = ""

        for page in reader.pages:

            page_text = page.extract_text()

            if page_text:
                text += page_text + "\n"

        return text

    except Exception as e:

        print("PDF extraction error:", e)

        return ""


# =================================================
# DOCX TEXT EXTRACTION
# =================================================

def extract_docx_text(filepath):

    try:

        from docx import Document

        document = Document(filepath)

        text = ""

        for paragraph in document.paragraphs:

            text += paragraph.text + "\n"

        return text

    except Exception as e:

        print("DOCX extraction error:", e)

        return ""


# =================================================
# SKILL DATABASE
# =================================================

SKILLS = [

    "python",
    "java",
    "javascript",
    "react",
    "html",
    "css",

    "sql",
    "mysql",
    "mongodb",

    "c",
    "c++",
    "c#",

    "flask",
    "django",

    "node.js",
    "node",

    "power bi",
    "excel",

    "machine learning",
    "deep learning",
    "artificial intelligence",
    "ai",

    "data analysis",
    "data analytics",

    "git",
    "github",

    "rest api",
    "api",

    "communication",
    "leadership"

]


# =================================================
# SKILL ANALYZER
# =================================================

def analyze_skills(text):

    text_lower = text.lower()

    found_skills = []
    missing_skills = []

    for skill in SKILLS:

        pattern = re.escape(skill)

        if re.search(pattern, text_lower):

            found_skills.append(skill.title())

        else:

            missing_skills.append(skill.title())

    return found_skills, missing_skills


# =================================================
# RESUME ANALYZER API
# =================================================

@app.route("/api/analyze", methods=["POST"])
def analyze_resume():

    try:

        # -----------------------------------------
        # CHECK FILE
        # -----------------------------------------

        if "resume" not in request.files:

            return jsonify({
                "status": "error",
                "message": "No resume file received."
            }), 400


        file = request.files["resume"]


        # -----------------------------------------
        # CHECK EMPTY FILE
        # -----------------------------------------

        if file.filename == "":

            return jsonify({
                "status": "error",
                "message": "Please select a resume."
            }), 400


        # -----------------------------------------
        # CHECK EXTENSION
        # -----------------------------------------

        if not allowed_file(file.filename):

            return jsonify({
                "status": "error",
                "message": "Only PDF and DOCX files are allowed."
            }), 400


        # -----------------------------------------
        # SECURE FILE NAME
        # -----------------------------------------

        filename = secure_filename(file.filename)


        if not filename:

            return jsonify({
                "status": "error",
                "message": "Invalid file name."
            }), 400


        # -----------------------------------------
        # SAVE FILE
        # -----------------------------------------

        filepath = os.path.join(
            app.config["UPLOAD_FOLDER"],
            filename
        )

        file.save(filepath)


        # -----------------------------------------
        # GET EXTENSION
        # -----------------------------------------

        extension = filename.rsplit(
            ".",
            1
        )[1].lower()


        # -----------------------------------------
        # EXTRACT RESUME TEXT
        # -----------------------------------------

        if extension == "pdf":

            resume_text = extract_pdf_text(filepath)

        elif extension == "docx":

            resume_text = extract_docx_text(filepath)

        else:

            resume_text = ""


        # -----------------------------------------
        # CHECK TEXT
        # -----------------------------------------

        if not resume_text.strip():

            return jsonify({
                "status": "error",
                "message": "Could not extract text from this resume."
            }), 400


        # -----------------------------------------
        # ANALYZE SKILLS
        # -----------------------------------------

        found_skills, missing_skills = analyze_skills(
            resume_text
        )


        # -----------------------------------------
        # CALCULATE SCORE
        # -----------------------------------------

        total_skills = len(SKILLS)

        if total_skills > 0:

            score = int(
                (len(found_skills) / total_skills) * 100
            )

        else:

            score = 0


        score = min(score, 100)


        # -----------------------------------------
        # FINAL RESPONSE
        # -----------------------------------------

        return jsonify({

            "status": "success",

            "message":
                "Resume analyzed successfully 🚀",

            "filename":
                filename,

            "resume_length":
                len(resume_text),

            "skills_found":
                found_skills,

            "skills_missing":
                missing_skills[:10],

            "skill_count":
                len(found_skills),

            "match_score":
                score,

            "summary":
                (
                    f"Your resume contains "
                    f"{len(found_skills)} "
                    f"of the tracked career skills."
                )

        })


    # =================================================
    # ERROR HANDLING
    # =================================================

    except Exception as e:

        print("Analyzer error:", e)

        return jsonify({

            "status": "error",

            "message": str(e)

        }), 500


# =================================================
# RUN SERVER
# =================================================

if __name__ == "__main__":

    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )