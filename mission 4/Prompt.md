# Prompt: Fix 401/403/429, PDF Upload Errors, and Gemini API Key Issues

I am building a full-stack app (React + Node/Express) that uploads a PDF resume and generates cover letters using Gemini.

I am facing these issues:

1. 401 Unauthorized
2. 403 Forbidden
3. 429 Too Many Requests
4. PDF upload failing on server
5. Gemini API not working (including invalid API key errors)

Please give me a practical, step-by-step debugging and fix plan for this stack.

## Required output format

1. Root causes mapped to each error (401, 403, 429, PDF upload failure).
2. Exact checks for backend environment variables and startup.
3. How to validate API key format, project access, and quota in Google AI Studio.
4. How to verify CORS and client origin settings.
5. How to verify multipart form-data and the resume field name.
6. How to test with curl/Postman (include example request).
7. How to add retry/backoff for 429.
8. A final checklist I can run in 2-3 minutes before deployment.

## My current assumptions

- Gemini key is stored only in backend environment variables.
- Frontend calls backend endpoint, not Gemini directly.
- Backend expects a PDF in form-data field name: resume.
- File type must be application/pdf and size <= 5 MB.

## What I need from you

Provide concise fixes I can apply immediately, including:

- Env file corrections
- Request format corrections
- CORS fixes
- Rate limit mitigation strategy
- Common mistakes that cause invalid API key and forbidden errors

Also include a short section: "If this still fails, collect these logs" with the exact logs to capture from frontend and backend.
