# Prodesk Internship Missions

## Intern Profile

- Name: Charan Nayak
- Role: Frontend Developer Intern
- Organization: Prodesk IT

## Repository Overview

This repository contains internship assignments completed as part of frontend development tasks at Prodesk IT.

## Mission 1 - Prodesk Landing Page

Mission 1 focuses on building a responsive and performance-friendly landing page using HTML and Tailwind CSS.

### Highlights

- Responsive landing page layout
- Tailwind CSS setup through npm build workflow
- Dark mode fixes and UI refinements
- Navigation behavior improvements

### Tech Stack

- HTML5
- Tailwind CSS (npm build)
- Node.js and npm

### Mission 1 Live Demo

- https://prodesk-dsag.vercel.app/

## Mission 2 - Cash Flow Dashboard

Mission 2 is a finance dashboard to manage salary and expenses, convert currency between INR and USD, visualize spending, and export reports.

### Highlights

- Salary and expense tracking
- Remaining balance calculation
- INR and USD currency switching
- Live exchange-rate handling with fallback support
- Expense pie chart visualization
- PDF report generation
- localStorage data persistence

### Tech Stack

- HTML5
- Vanilla JavaScript (ES6)
- Tailwind CSS
- Chart.js
- jsPDF

### Mission 2 Live Demo

- https://prodesk-mission2.vercel.app/

## Mission 3 - Dev-Detective: GitHub User Search

Mission 3 is a GitHub user search project that lets you hunt and inspect GitHub profiles, display detailed user information, and includes a battle mode for comparing developers.

### Highlights

- Fetches GitHub user data from the public API
- Displays profile details: name, bio, followers, repository count, and links
- Loading spinner during API requests
- Error state handling for user not found
- Battle mode logic for comparing users
- Clean dashboard-style layout

### Tech Stack

- HTML5
- Vanilla JavaScript (ES6)
- CSS3
- GitHub REST API

### Mission 3 Live Demo

- https://prodesk-fyr8.vercel.app/

## Mission 4 - AI Cover Letter Generator

Mission 4 is a full-stack AI application that generates personalized cover letters from candidate/job inputs and an uploaded resume PDF.

### Highlights

- React + Vite frontend with a clean multi-section UI
- Express backend with secure Gemini API integration
- PDF resume upload and text extraction on server side
- Tone controls: formal, balanced, or creative
- ATS mode toggle for keyword-optimized output
- Generated letter actions: copy to clipboard and PDF export
- Generation history endpoint with optional MongoDB persistence
- Strong validation and error handling for API key, quota, model, and upload failures

### How Mission 4 Works

1. User fills candidate/job/company details and uploads a PDF resume.
2. Frontend sends a `multipart/form-data` request to the backend.
3. Backend validates fields, file type/size, and parses resume text.
4. Backend builds a structured prompt and calls Gemini.
5. Generated letter is normalized and returned to frontend.
6. If MongoDB is connected, generation metadata is saved in history.

### API Endpoints (Mission 4 Backend)

- `GET /api/health`
  Returns server health status.
- `GET /api/history`
  Returns latest generation history (empty if MongoDB is not connected).
- `POST /api/cover-letter`
  Accepts `multipart/form-data` with:
  `candidateName`, `jobRole`, `companyName`, `keySkills`, `jobDescription`, `tone`, `atsMode`, and `resume` (PDF, max 5 MB).

### Environment Variables (Mission 4 Backend)

- `GEMINI_API_KEY` (required)
- `GEMINI_MODEL` (default: `gemini-2.0-flash`)
- `GEMINI_FALLBACK_MODEL` (default: `gemini-2.0-flash`)
- `PORT` (default: `5000`)
- `CLIENT_ORIGIN` (default: `http://localhost:5173`, comma-separated for multiple origins)
- `MONGODB_URI` (optional, enables history persistence)

### Tech Stack

- Frontend: React, Vite, Tailwind CSS
- Backend: Node.js, Express, Multer, pdf-parse
- AI: Google Gemini (`@google/generative-ai`)
- Database (optional): MongoDB + Mongoose

### Local Run (Mission 4)

1. Start backend:

   ```bash
   cd "mission 4/backend"
   npm install
   # create backend/.env and add required variables
   npm run dev
   ```

2. Start frontend in a new terminal:

   ```bash
   cd "mission 4/frontend"
   npm install
   npm run dev
   ```

3. Open app:

   `http://localhost:5173`

## Project Structure

- mission 1: Landing page project files
- mission 2: Cash Flow Dashboard files
- mission 3: GitHub user search app files
- mission 4: AI cover letter generator (frontend + backend)
- scripts: utility/build scripts

## Run Locally

1. Install dependencies:

   npm install

2. Build CSS for Mission 1:

   npm run build:css

3. Open mission 1/index.html or mission 2/index.html in your browser.

4. For Mission 4, follow the run steps under "Local Run (Mission 4)".
