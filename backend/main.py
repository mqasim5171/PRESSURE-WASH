import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
import smtplib
from email.mime.text import MIMEText
import gspread
from google.oauth2.service_account import Credentials
from dotenv import load_dotenv
from datetime import datetime

load_dotenv()

# -----------------------------
# Environment & Config
# -----------------------------
GOOGLE_SERVICE_ACCOUNT_KEY = json.loads(os.getenv("GOOGLE_SERVICE_ACCOUNT_KEY"))
SHEET_ID = os.getenv("SHEET_ID")

SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.hostinger.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
ALERT_EMAIL = os.getenv("ALERT_EMAIL")
ALERT_EMAIL_PASS = os.getenv("ALERT_EMAIL_PASS")
ALERT_RECIPIENT = os.getenv("ALERT_RECIPIENT")

# -----------------------------
# Google Sheets Setup
# -----------------------------
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
creds = Credentials.from_service_account_info(GOOGLE_SERVICE_ACCOUNT_KEY, scopes=SCOPES)
client = gspread.authorize(creds)
sheet = client.open_by_key(SHEET_ID).sheet1  # first sheet

# -----------------------------
# FastAPI Setup
# -----------------------------
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# Pydantic Model
# -----------------------------
class ContactForm(BaseModel):
    name: str
    email: EmailStr
    phone: str
    suburb: str = ""
    service: str = ""
    propertyType: str = "Residential"
    contactPreference: str = "Call"
    message: str
    consent: bool

# -----------------------------
# Alert Email Function
# -----------------------------
def send_alert_email(error_message):
    msg = MIMEText(f"🚨 Google Sheets Integration Failed!\n\nError:\n{error_message}")
    msg["Subject"] = "⚠️ Alert: Form Submission Failed"
    msg["From"] = ALERT_EMAIL
    msg["To"] = ALERT_RECIPIENT

    try:
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            server.login(ALERT_EMAIL, ALERT_EMAIL_PASS)
            server.send_message(msg)
        print("✅ Alert email sent successfully")
    except Exception as e:
        print("❌ Failed to send alert email:", e)

# -----------------------------
# API Endpoint
# -----------------------------
@app.post("/api/submit-quote")  # match React fetch
async def submit_quote(form: ContactForm):
    if not form.consent:
        raise HTTPException(status_code=400, detail="Consent required.")

    try:
        # Prepare row
        row = [
            form.name,
            form.email,
            form.phone,
            form.suburb,
            form.service,
            form.propertyType,
            form.contactPreference,
            form.message,
            str(form.consent),
            datetime.now().strftime("%Y-%m-%d %H:%M:%S")  # timestamp
        ]

        sheet.append_row(row)
        return {"status": "success", "message": "Form submitted successfully."}

    except Exception as e:
        print("Error writing to Google Sheets:", e)
        send_alert_email(str(e))
        raise HTTPException(status_code=500, detail="Failed to submit form. Admin has been alerted.")

# -----------------------------
# Healthcheck Endpoint
# -----------------------------
@app.get("/health")
async def health_check():
    return {"status": "ok"}
