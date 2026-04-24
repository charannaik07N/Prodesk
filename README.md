# Prodesk Internship Missions

Professional repository documentation for all internship missions completed at Prodesk IT.

## Intern Profile

- Name: Charan Nayak
- Role: Frontend Developer Intern
- Organization: Prodesk IT

## Repository Overview

This repository contains six mission-based projects. The work spans static responsive pages, dashboard-style JavaScript applications, API-driven UI, full-stack AI workflows, drag-and-drop state management, and a modern React e-commerce frontend.

## Mission Index

| Mission   | Project                   | Core Focus                                           | Stack                                                         | Live Link                            |
| --------- | ------------------------- | ---------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------ |
| Mission 1 | Prodesk Landing Page      | Responsive marketing landing page                    | HTML5, Tailwind CSS, Node.js                                  | https://prodesk-dsag.vercel.app/     |
| Mission 2 | Cash Flow Dashboard       | Personal finance tracking and reporting              | HTML5, JavaScript, Tailwind CSS, Chart.js, jsPDF              | https://prodesk-mission2.vercel.app/ |
| Mission 3 | Dev-Detective             | GitHub profile search and comparison logic           | HTML5, JavaScript, CSS3, GitHub REST API                      | https://prodesk-fyr8.vercel.app/     |
| Mission 4 | AI Cover Letter Generator | Resume-aware AI cover letter generation              | React, Vite, Node.js, Express, Gemini API, MongoDB (optional) | Not deployed in this repository      |
| Mission 5 | Task Board                | Kanban-style task workflow with drag-and-drop        | React, Vite, Tailwind CSS, dnd-kit                            | https://mission5.vercel.app/         |
| Mission 6 | ShopZone                  | E-commerce browsing, cart, login, protected checkout | React 19, React Router, Context API, Vite, Tailwind CSS       | https://shopzone-kappa.vercel.app/   |

## Detailed Project Documentation

### Mission 1 - Prodesk Landing Page

Mission 1 delivers a responsive landing page implementation using Tailwind CSS through an npm build workflow.

Key features:

- Responsive hero and section layout.
- Tailwind utility-driven styling.
- Build pipeline for generated CSS output.

Directory: mission 1

Live: https://prodesk-dsag.vercel.app/

### Mission 2 - Cash Flow Dashboard

Mission 2 is a browser-based finance dashboard for salary and expense management.

Key features:

- Salary and expense tracking.
- Remaining balance computation.
- INR/USD currency toggle.
- Live exchange-rate fetch with fallback.
- Expense pie chart visualization.
- PDF report generation.
- localStorage persistence.

Directory: mission 2

Live: https://prodesk-mission2.vercel.app/

### Mission 3 - Dev-Detective

Mission 3 is a GitHub user search utility focused on API integration and robust loading/error behavior.

Key features:

- GitHub user profile search.
- API-driven profile rendering.
- Loading state and not-found handling.
- Battle mode support for user comparison flow.

Directory: mission 3

Live: https://prodesk-fyr8.vercel.app/

### Mission 4 - AI Cover Letter Generator

Mission 4 is a full-stack application that generates personalized cover letters from user inputs and an uploaded resume PDF.

Key features:

- React frontend with structured form UX.
- Express backend with file upload validation.
- Resume PDF text extraction using server-side parsing.
- Gemini-powered content generation.
- Tone controls and ATS optimization mode.
- Optional generation history with MongoDB.

Directory: mission 4

Live: Not deployed in this repository.

### Mission 5 - Task Board

Mission 5 is a task management board with stateful column workflows and drag-and-drop interactions.

Key features:

- To Do, In Progress, and Done workflow columns.
- Create, edit, and delete task actions.
- Drag-and-drop card movement.
- Search/filter capability.
- localStorage persistence.

Directory: Mission-5

Live: https://mission5.vercel.app/

### Mission 6 - ShopZone

Mission 6 is a production-style e-commerce frontend demonstrating route-level architecture and centralized state.

Key features:

- Product listing from DummyJSON API.
- Category filtering and product detail pages.
- Cart management with quantity controls.
- Login/guest authentication flow.
- Protected checkout route.
- localStorage persistence for user and cart.

Directory: mission-6/ShopZone

Live: https://shopzone-kappa.vercel.app/

## Repository Structure

```text
prodesk/
  mission 1/
  mission 2/
  mission 3/
  mission 4/
    backend/
    frontend/
  Mission-5/
  mission-6/
    ShopZone/
  scripts/
```

## Complete Setup Instructions

### Prerequisites

- Node.js 18+
- npm 9+
- Git

### 1. Clone Repository

```bash
git clone https://github.com/charannaik07N/Prodesk.git
cd prodesk
```

### 2. Install Root Dependencies

```bash
npm install
```

Root scripts currently support Tailwind CSS build for Mission 1.

### 3. Run Mission 1

```bash
npm run build:css
```

Open mission 1/index.html in your browser.

### 4. Run Mission 2

Open mission 2/index.html in your browser.

### 5. Run Mission 3

Open mission 3/index.html in your browser.

### 6. Run Mission 4 (Full Stack)

Backend:

```bash
cd "mission 4/backend"
npm install
npm run dev
```

Frontend (new terminal):

```bash
cd "mission 4/frontend"
npm install
npm run dev
```

Create mission 4/backend/.env with required variables before generating cover letters:

- GEMINI_API_KEY
- GEMINI_MODEL (optional, defaults recommended)
- GEMINI_FALLBACK_MODEL (optional)
- CLIENT_ORIGIN (optional)
- MONGODB_URI (optional)

### 7. Run Mission 5

```bash
cd Mission-5
npm install
npm run dev
```

### 8. Run Mission 6

```bash
cd mission-6/ShopZone
npm install
npm run dev
```

Optional production checks for Mission 6:

```bash
npm run lint
npm run build
npm run preview
```

## Deployment Notes

- Mission 1, 2, 3, 5, and 6 have active Vercel deployments.
- Mission 6 includes SPA rewrites via mission-6/ShopZone/vercel.json to support direct route refreshes.
- Mission 4 deployment link is not currently listed in this repository.

## Author

Charan Nayak
