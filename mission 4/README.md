# Mission 4 - AI Cover Letter Generator

A full-stack web app that generates personalized cover letters using Gemini.

Tech stack:

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express + Multer + pdf-parse
- AI: Google Gemini API
- Optional persistence: MongoDB (history of generated letters)

## Features

- Upload resume PDF and extract text server-side
- Input job details and key skills
- Choose tone: formal, balanced, or creative
- ATS-friendly mode toggle
- Generate polished cover letters with Gemini
- Copy output and export to PDF
- View and reuse generation history (when MongoDB is enabled)

## Project Structure

```
mission 4/
	backend/
		src/
			index.js
			utils/parseResume.js
			models/CoverLetterHistory.js
	frontend/
		src/
			App.jsx
			components/
```

## Prerequisites

- Node.js 18 or later
- npm
- Gemini API key from Google AI Studio
- Optional MongoDB connection string for history

## Quick Start

### 1. Backend setup

```bash
cd backend
npm install
```

Create either `.env` (recommended) or `env` inside `backend/`:

```env
GEMINI_API_KEY=your_real_key_here
GEMINI_MODEL=gemini-2.0-flash
GEMINI_FALLBACK_MODEL=gemini-2.0-flash
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
# Optional
# MONGODB_URI=mongodb://127.0.0.1:27017/mission4
```

Run backend:

```bash
npm run dev
```

Backend URL: `http://localhost:5000`

### 2. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

Notes:

- Vite proxy forwards `/api` to `http://localhost:5000` in development.
- You can also set `VITE_API_BASE_URL` if needed.

## API Reference

### Health Check

- `GET /api/health`
- Returns server status.

### Generate Cover Letter

- `POST /api/cover-letter`
- Content-Type: `multipart/form-data`

Required form fields:

- `candidateName` (string)
- `jobRole` (string)
- `companyName` (string)
- `keySkills` (string, comma-separated)
- `jobDescription` (string)
- `tone` (`formal` | `balanced` | `creative`)
- `atsMode` (`true` | `false`)
- `resume` (file, PDF only, max 5 MB)

Success response:

```json
{
  "coverLetter": "...",
  "metadata": {
    "tone": "formal",
    "atsMode": false,
    "historyEnabled": true
  }
}
```

### History

- `GET /api/history`
- Returns latest 20 records when MongoDB is configured.
- Returns empty array when MongoDB is not connected.

## Troubleshooting

### 401 Unauthorized (Invalid Gemini API key)

Possible causes:

- `GEMINI_API_KEY` is missing, wrong, expired, or copied with extra spaces/quotes.
- Backend was not restarted after changing env values.

Fix:

1. Verify `backend/.env` has a valid key.
2. Restart backend after edits.
3. Ensure frontend does not call Gemini directly.

### 403 Forbidden

Possible causes:

- API key restrictions do not allow Gemini Generative Language API.
- Project/account does not have required access.
- Request origin is blocked by CORS (`CLIENT_ORIGIN`).

Fix:

1. Check key restrictions and project permissions in Google AI Studio / Google Cloud.
2. Confirm `CLIENT_ORIGIN` includes your frontend URL.
3. Ensure requests are sent to your backend URL, not directly to Gemini.

### 429 Too Many Requests

Possible causes:

- Quota or rate limit exceeded.

Fix:

1. Retry after a short wait.
2. Add exponential backoff in client or backend retries.
3. Reduce rapid repeated requests.
4. Check quota and billing in Google AI Studio.

### PDF Upload Fails

Possible causes:

- Wrong field name (must be `resume`).
- Non-PDF file type.
- File larger than 5 MB.

Fix:

1. Confirm multipart field key is `resume`.
2. Confirm file MIME is `application/pdf`.
3. Upload a smaller PDF.

### Model Not Found / Unsupported Model

Possible causes:

- `GEMINI_MODEL` points to an unsupported model for your API version.

Fix:

1. Use a supported model such as `gemini-2.0-flash`.
2. Keep fallback model configured.

## Quick API Test (curl)

Run from project root (adjust file path):

```bash
curl -X POST http://localhost:5000/api/cover-letter \
	-F "candidateName=Alex Johnson" \
	-F "jobRole=Frontend Developer" \
	-F "companyName=Prodesk" \
	-F "keySkills=React, JavaScript, Tailwind CSS" \
	-F "jobDescription=Build responsive UIs and collaborate with product teams." \
	-F "tone=formal" \
	-F "atsMode=true" \
	-F "resume=@./sample-resume.pdf;type=application/pdf"
```

PowerShell (single line):

```powershell
curl.exe -X POST http://localhost:5000/api/cover-letter -F "candidateName=Alex Johnson" -F "jobRole=Frontend Developer" -F "companyName=Prodesk" -F "keySkills=React, JavaScript, Tailwind CSS" -F "jobDescription=Build responsive UIs and collaborate with product teams." -F "tone=formal" -F "atsMode=true" -F "resume=@sample-resume.pdf;type=application/pdf"
```

## If This Still Fails, Collect These Logs

Frontend:

- Browser Console errors
- Network tab for `/api/cover-letter`: status code, response body, request payload keys

Backend:

- Full server error message and stack trace from terminal
- Startup logs showing loaded port and Mongo connection state
- The exact response error text returned by backend

Gemini/Config:

- Current values (masked) for `GEMINI_MODEL`, `CLIENT_ORIGIN`, `PORT`
- Confirmation that backend is reading the expected env file (`.env` or `env`)

## Security Notes

- Never commit `.env` or `env` files.
- Store Gemini API key only on backend.
- Do not expose secrets in frontend code or logs.

## Deployment Checklist (2-3 minutes)

1. Backend starts with no env errors.
2. Frontend origin matches backend CORS allowlist.
3. `GET /api/health` and `POST /api/cover-letter` work.
4. PDF upload works with a valid file under 5 MB.
5. Gemini key and model are valid.
6. No secrets are committed.
