# Fynd AI Intern – Task 2: AI Feedback System

This project implements Task 2 of the Fynd AI Intern take-home assignment.

The goal is to build a small end-to-end system where:

- Users can submit a rating (1–5) and a short review.
- The backend calls an LLM to analyse that feedback.
- The result is stored in a CSV file.
- An admin dashboard shows all collected feedback in a table.

There is no model training involved. The “model” is the Gemini API.

---

## 1. Architecture

- **Frontend (React + Vite)**  
  Single page app with two views:
  - **User Dashboard** – form to submit rating + review and see AI analysis.
  - **Admin Dashboard** – table with all stored feedback.

- **Backend (FastAPI)**  
  Exposes two endpoints:
  - `POST /submit_review` – accepts rating + review, calls Gemini, appends to CSV.
  - `GET /admin_data` – returns all rows from the CSV for the admin dashboard.

- **LLM**  
  - Provider: Google Gemini (Gemini API)
  - Model: `gemini-1.5-flash`
  - Used to generate:
    - `summary`
    - `recommended_action`
    - `ai_response`

- **Storage**  
  - Simple CSV file: `backend/data/reviews.csv`

---

## 2. Project Structure

```text
task2/
  backend/
    main.py          # FastAPI app
    prompts.py       # LLM prompt template
    requirements.txt
    data/
      reviews.csv    # created automatically after first submission
    .env             # contains GEMINI_API_KEY (not committed)
  frontend/
    frontend/        # Vite React app (created by Vite)
      src/
        App.jsx
        main.jsx
      index.html
      package.json
  README.md

3. LLM Prompt

The backend uses a simple template:

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
- Output must be valid JSON.
- Do not include markdown or extra explanation.


The {rating} and {review_text} placeholders are filled in at runtime.


4. Running the Backend (FastAPI)

From the task2/backend folder:

Create and activate a virtual environment:

python -m venv venv
venv\Scripts\activate


Install dependencies:

pip install -r requirements.txt


Create a .env file with your Gemini key:

GEMINI_API_KEY=YOUR_KEY_HERE


Start the server:

uvicorn main:app --reload


Backend will run at:

API root: http://127.0.0.1:8000

Docs: http://127.0.0.1:8000/docs

API Endpoints

POST /submit_review

Request body:

{
  "rating": 5,
  "review": "The food was great but the service was slow."
}


Response example:

{
  "timestamp": "2025-12-06 21:07:18",
  "rating": 5,
  "review": "The food was great but the service was slow.",
  "summary": "The customer enjoyed the food but felt service was slow.",
  "recommended_action": "Improve service speed.",
  "ai_response": "Thanks for sharing your feedback. We'll work on our service speed."
}


GET /admin_data

Returns all rows from backend/data/reviews.csv as JSON.

5. Running the Frontend (React + Vite)

From the task2/frontend/frontend folder:

Install dependencies:

npm install


Start the dev server:

npm run dev


The app will be available at http://localhost:5173.

The frontend uses a constant in App.jsx to talk to the backend:

const API_BASE = "http://127.0.0.1:8000";


For deployment, this can be changed to the deployed backend URL.

6. Dashboards
User Dashboard

Dropdown for rating (1–5).

Textarea for review.

On submit:

Sends rating and review to /submit_review.

Displays returned summary, recommended_action, and ai_response.

Admin Dashboard

Fetches /admin_data.

Shows a table with:

timestamp

rating

review

summary

recommended_action

ai_response

7. Data Storage

All feedback is appended to:

backend/data/reviews.csv


Using CSV keeps the solution simple, easy to inspect, and enough for this assignment.

8. Notes

.env, venv, and node_modules are intentionally not tracked by Git.

The project is designed to be deployable:

Backend on a free FastAPI host (e.g. Render/Railway).

Frontend on Netlify/Vercel, with API_BASE updated to the backend URL.


---

If you want, next we can:

- Tweak a line or two to match **exactly** how you want to describe yourself (e.g. add your name), or  
- Move straight to **deployment steps** (Render for backend, Netlify for frontend).
::contentReference[oaicite:0]{index=0}

