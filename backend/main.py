from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from datetime import datetime
from dotenv import load_dotenv
import os
import csv
import json
import re
import requests
from datetime import datetime

from fastapi.middleware.cors import CORSMiddleware
from prompts import FEEDBACK_PROMPT

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
# GEMINI_API_KEY =""
if not GEMINI_API_KEY:
    raise ValueError("Missing GEMINI_API_KEY in .env")

# Use whichever worked for you in Task 1: "gemini-1.5-flash" or "gemini-2.0-flash"
MODEL_NAME = "gemini-2.0-flash"
BASE_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL_NAME}:generateContent"

DATA_DIR = "data"
DATA_FILE = os.path.join(DATA_DIR, "reviews.csv")


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],            #faced mutiple time cors error soo finally choose this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ReviewRequest(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    review: str

def ensure_csv_exists():
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(DATA_FILE):
        with open(DATA_FILE, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["timestamp", "rating", "review", "summary", "recommended_action", "ai_response"])

def call_gemini(rating: int, review_text: str) -> dict:
    prompt = (
        FEEDBACK_PROMPT
        .replace("{rating}", str(rating))
        .replace("{review_text}", review_text)
    )


    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }

    headers = {
        "Content-Type": "application/json",
        "x-goog-api-key": GEMINI_API_KEY,
    }

    response = requests.post(BASE_URL, headers=headers, json=payload)
    response.raise_for_status()
    data = response.json()

    # Extract plain text
    try:
        text = data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception:
        return {"error": "LLM output format unexpected", "raw": data}

    # Extract JSON from text
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        return {"error": "No JSON found in LLM output", "raw_text": text}

    try:
        parsed = json.loads(match.group(0))
        return parsed
    except Exception:
        return {"error": "Failed to parse JSON", "raw_text": text}

@app.post("/submit_review")
def submit_review(req: ReviewRequest):
    ensure_csv_exists()

    ai_result = call_gemini(req.rating, req.review)

    # Basic error handling: if LLM failed, still store user data
    summary = ai_result.get("summary", "")
    recommended_action = ai_result.get("recommended_action", "")
    ai_response = ai_result.get("ai_response", "")

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    row = {
        "timestamp": timestamp,
        "rating": req.rating,
        "review": req.review,
        "summary": summary,
        "recommended_action": recommended_action,
        "ai_response": ai_response,
    }

    with open(DATA_FILE, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(row.values())

    return row

@app.get("/admin_data")
def admin_data():
    ensure_csv_exists()

    entries = []
    with open(DATA_FILE, "r", newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            entries.append(row)

    return {"entries": entries}
