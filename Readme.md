Task 2: AI Feedback System (Fynd AI Assessment)
Overview

This project implements Task 2 of the Fynd AI Intern Take-Home Assessment.
The goal is to build an AI-powered feedback system consisting of:

A User Dashboard for submitting ratings and reviews

An Admin Dashboard for viewing processed feedback

A FastAPI backend

A React (Vite) frontend

CSV-based data storage

For every review submitted, an LLM (Gemini) generates a summary, a recommended action, and a short AI response.

Project Structure
task2/
  backend/
    main.py
    prompts.py
    requirements.txt
    data/
      reviews.csv
    .env
  frontend/
    src/
      App.jsx
      main.jsx
    index.html
    package.json
readme.md


LLM Model Used

Model: gemini-2.0-flash
API Endpoint:
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent

The model is not used for prediction.
It is used to generate:

A summary

A recommended action

A friendly AI reply

Prompt Used
You are an AI assistant helping a business understand customer feedback.

Given:

Rating: {rating}
Review: "{review_text}"

Return a JSON object with:

{
  "summary": "summarize the review",
  "recommended_action": "suggest an action the business can take",
  "ai_response": "reply politely to the user"
}

Rules:
- The output must be valid JSON
- No markdown or extra explanation

Backend Setup (FastAPI)

Navigate to backend:

cd task2/backend


Create and activate a virtual environment:

python -m venv venv
venv\Scripts\activate


Install dependencies:

pip install -r requirements.txt


Create a .env file containing:

GEMINI_API_KEY=YOUR_KEY_HERE


Run the backend:

uvicorn main:app --reload


Backend URL:
http://127.0.0.1:8000

API documentation:
http://127.0.0.1:8000/docs

API Endpoints
POST /submit_review

Input:

{
  "rating": 5,
  "review": "The food was great but the service was slow."
}


Output example:

{
  "timestamp": "2025-12-06 21:07:18",
  "rating": 5,
  "review": "The food was great but the service was slow.",
  "summary": "The customer enjoyed the food but felt the service could improve.",
  "recommended_action": "Improve service speed.",
  "ai_response": "Thanks for sharing! We appreciate your feedback."
}

GET /admin_data

Returns all stored entries from reviews.csv in JSON format.

Frontend Setup (React + Vite)

Navigate to the frontend folder:

cd task2/frontend


Install dependencies:

npm install


Start the development server:

npm run dev


Runs at:
http://localhost:5173

Update API URL

Before deployment, update API_BASE inside App.jsx:

const API_BASE = "YOUR_DEPLOYED_BACKEND_URL";

Dashboards
User Dashboard

Select rating

Submit review

Receives:

Summary

Recommended action

AI response

Admin Dashboard

Shows all stored entries including:

Timestamp

Rating

Review

Summary

Recommended action

AI response

Data Storage

All feedback is stored in:

backend/data/reviews.csv


A CSV file was chosen for simplicity and transparency.

Deployment

Backend will be deployed using Render or Railway.
Frontend will be deployed using Netlify or Vercel.

Completion

This project completes all requirements of Task 2, including:

Fully working User Dashboard

Fully working Admin Dashboard

AI integration

Persistent data storage

Clear API design

Frontend and backend separation

End of README