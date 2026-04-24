# Prodesk Internship Missions

## Intern Profile

- Name: Charan Nayak
- Role: Frontend Developer Intern
- Organization: Prodesk IT

## Repository Overview

This repository contains internship missions completed at Prodesk IT. Each mission focuses on a different frontend or full-stack capability, from responsive UI and API integration to authentication-style flows and protected routes.

## Missions Summary

### Mission 1 - Prodesk Landing Page

- Focus: responsive landing page using Tailwind build pipeline.
- Stack: HTML5, Tailwind CSS, Node.js.
- Demo: https://prodesk-dsag.vercel.app/

### Mission 2 - Cash Flow Dashboard

- Focus: personal finance tracking with analytics and export.
- Stack: HTML5, JavaScript, Tailwind CSS, Chart.js, jsPDF.
- Demo: https://prodesk-mission2.vercel.app/

### Mission 3 - Dev-Detective (GitHub User Search)

- Focus: GitHub profile lookup and comparison mode.
- Stack: HTML5, JavaScript, CSS3, GitHub REST API.
- Demo: https://prodesk-fyr8.vercel.app/

### Mission 4 - AI Cover Letter Generator

- Focus: full-stack AI app with resume parsing and letter generation.
- Stack: React + Vite frontend, Express backend, Gemini API, optional MongoDB.

### Mission 5 - Task Management Board

- Focus: drag-and-drop style board with task status columns and reusable UI components.
- Stack: React + Vite.

### Mission 6 - ShopZone (E-Commerce Frontend)

- Focus: product listing, details, cart, login flow, and protected checkout.
- Stack: React 19, React Router, Context API, Vite, Tailwind CSS, Lucide Icons.
- Live Demo: https://shopzone-kappa.vercel.app/

## Mission 6 Complete Project Explanation

### Goal

Mission 6 builds a modern e-commerce frontend called ShopZone where users can:

- Browse products fetched from DummyJSON API.
- Filter products by category.
- View complete product details with multiple images.
- Add items to cart and update quantities.
- Sign in (or continue as guest).
- Access checkout through a protected route.

### Core Architecture

- Routing layer in App.jsx using React Router.
- Global state layer in context/AppContext.jsx.
- UI split into reusable components under src/components.
- Browser persistence via localStorage for user and cart data.

### Data and State Flow

1. Product list page fetches from https://dummyjson.com/products.
2. Product details page fetches from https://dummyjson.com/products/:id.
3. Cart actions are handled centrally through AppContext methods.
4. Cart and user are persisted with localStorage keys:
   - shopzone_user
   - shopzone_cart
5. Checkout route is guarded by ProtectedRoute and redirects unauthenticated users to login.

### Main Routes

- / -> Products page
- /product/:id -> Product details page
- /login -> Login/guest access page
- /checkout -> Protected checkout page

### Mission 6 Feature Highlights

- Product grid with category filter and rating visualization.
- Dedicated product detail screen with gallery and stock metadata.
- Cart drawer in navbar with quantity controls.
- Login simulation flow with guest mode.
- Checkout form with summary, tax, shipping logic, and order confirmation state.
- Responsive layout and animated interactions across pages.

### Mission 6 Folder Structure

```text
mission-6/
   ShopZone/
      public/
      src/
         components/
            Checkout.jsx
            Loginpage.jsx
            Navbar.jsx
            ProductDetails.jsx
            Products.jsx
            ProtectedRoute.jsx
         context/
            AppContext.jsx
         App.jsx
         App.css
         index.css
         main.jsx
      index.html
      package.json
      vite.config.js
      vercel.json
```

## Complete Setup Guide

### Prerequisites

- Node.js 18+ (recommended latest LTS)
- npm 9+

### 1) Clone and open project

```bash
git clone https://github.com/charannaik07N/Prodesk.git
cd prodesk
```

### 2) Root setup (Mission 1 CSS build tooling)

```bash
npm install
npm run build:css
```

### 3) Mission-wise local run

Mission 1

```bash
# from repository root
npm run build:css
# then open mission 1/index.html in browser
```

Mission 2

```bash
# open mission 2/index.html directly in browser
```

Mission 3

```bash
# open mission 3/index.html directly in browser
```

Mission 4

```bash
cd "mission 4/backend"
npm install
# create .env and add Gemini variables
npm run dev
```

```bash
cd "mission 4/frontend"
npm install
npm run dev
```

Mission 5

```bash
cd Mission-5
npm install
npm run dev
```

Mission 6 (ShopZone)

```bash
cd mission-6/ShopZone
npm install
npm run dev
```

Open: http://localhost:5173

### 4) Mission 6 production build and preview

```bash
cd mission-6/ShopZone
npm run build
npm run preview
```

### 5) Mission 6 lint

```bash
cd mission-6/ShopZone
npm run lint
```

## Mission 6 Deployment Notes

ShopZone is configured as a SPA for Vercel using rewrites in vercel.json so refreshing deep routes (for example /product/1 or /checkout) does not return 404.

## Top-Level Repository Structure

- mission 1 -> Landing page
- mission 2 -> Cash flow dashboard
- mission 3 -> GitHub user search
- mission 4 -> AI cover letter generator (frontend + backend)
- Mission-5 -> Task board app
- mission-6/ShopZone -> E-commerce frontend app
- scripts -> Utility scripts
