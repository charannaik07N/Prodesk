# ShopZone

ShopZone is a React + Vite e-commerce frontend with product browsing, product details, authentication flow, and protected checkout.

## Tech Stack

- React 19
- React Router
- Vite
- Tailwind CSS (configured)
- ESLint

## Features

- Product listing page
- Product details page
- Login page
- Protected checkout route
- Shared app state via context
- Reusable layout with top navigation

## Routes

- `/` - Products
- `/product/:id` - Product details
- `/login` - Login
- `/checkout` - Checkout (protected)

## Project Structure

```
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
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

## Scripts

- `npm run dev` - Start local dev server
- `npm run build` - Create production build
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Notes

- Checkout access is guarded by `ProtectedRoute`.
- Global app state is managed through `AppContext`.

## Deploying to Vercel

To deploy this React + Vite SPA on Vercel without route 404 issues:

1. Set the Vercel project root directory to `ShopZone`.
2. Keep the default build command as `npm run build`.
3. Keep the output directory as `dist`.
4. Ensure `vercel.json` exists with SPA rewrite rules.

This project includes `vercel.json` so client routes like `/product/:id` and `/checkout` work on refresh and direct URL access.
