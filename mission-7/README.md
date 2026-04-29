# Mission-7 — Employee Registration Form

A compact, production-oriented React form for employee account creation. This project demonstrates a modern front-end pattern using React, React Hook Form, and Zod for schema validation, combined with Tailwind CSS for styling and Vite for fast development.

## Key Goals

- Provide a calm, efficient, and trustworthy registration experience.
- Use industry-standard form handling (React Hook Form) together with a Zod validation schema (via `@hookform/resolvers`).
- Offer strong, explicit password rules with live feedback.
- Keep the UI minimal, accessible, and responsive.

## Tech Stack

- React ^19.2.5
- Vite ^8.0.10 (dev server + build)
- Tailwind CSS ^4.2.4
- React Hook Form ^7.74.0
- Zod ^4.3.6
- @hookform/resolvers ^5.2.2

All dependencies are listed in `package.json`.

## Features

- Enterprise-grade validation: Zod schema enforces field rules and cross-field checks (password confirmation).
- Live password checklist: shows whether the password meets the 4 checks (length, capital, special char, 4+ digits).
- Show / hide toggles for password fields.
- Success state with temporary confirmation when an account is created.
- Accessible labels and clear error messages.
- Responsive layout with illustration and a compact sidebar.

## Getting Started

Prerequisites: Node.js (LTS recommended) and npm.

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Open http://localhost:5173 (Vite default) in a browser.

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Linting:

```bash
npm run lint
```

## Project Structure (important files)

- `index.html` — root HTML file (loads fonts and root div)
- `src/main.jsx` — React entry
- `src/App.jsx` — top-level app wrapper
- `src/components/Input.jsx` — main registration form component (validation & UI)
- `src/assets/undraw_referral_ihsd.svg` — form illustration (public or assets)
- `tailwind.config.js` / `postcss` — Tailwind configuration (if present)

If you rename or move `Input.jsx`, update its import usage in `App.jsx` accordingly.

## Notes & Next Steps

- The form currently resets on successful submission and displays a temporary success banner. For a real integration, replace the `onSubmit` handler with an API call to your backend.
- Consider adding server-side validation (mirror Zod schema) to harden security.
- Add tests (unit + integration) to verify validation and UX flows.


Last updated: April 29, 2026

