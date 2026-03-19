# Week 1 - Mission 1: Prodesk Landing Page

## About Me

Hi, I am Charan Nayak, Frontend Developer at Prodesk.

## Mission Overview

This project is my Week 1 Mission 1 task: building a responsive Prodesk landing page using HTML and Tailwind CSS (npm build setup).

## What I Am Using

- HTML5
- Tailwind CSS (installed via npm)
- Node.js and npm

## Project Structure

- `index.html` - Main landing page
- `styles/input.css` - Tailwind source file
- `styles/tailwind.css` - Generated Tailwind output file
- `prompt.md` - Mission prompt and requirements
- `outputs/` - Screenshot outputs

## How To Download

### Option 1: Clone with Git

1. Open terminal.
2. Run:

```bash
git clone https://github.com/charannaik07N/Prodesk.git
cd Prodesk
```

### Option 2: Download ZIP

1. Open the repository in browser.
2. Click `Code` -> `Download ZIP`.
3. Extract the ZIP.
4. Open the extracted folder in VS Code.

## How To Install And Run

1. Install dependencies from project root:

```bash
npm install
```

2. Build Tailwind CSS:

```bash
npm run build:css
```

3. Open `mission 1/index.html` in your browser.

## Optional: Live Preview In VS Code

If you use the Live Server extension:

1. Open `mission 1/index.html`.
2. Right-click and select `Open with Live Server`.

## NPM Script Used

From `package.json`:

```json
"build:css": "tailwindcss -c tailwind.config.js -i \"./mission 1/styles/input.css\" -o \"./mission 1/styles/tailwind.css\" --minify"
```

## Output Previews

### Landing Page Preview

![Live Server Preview](./outputs/image-1.png)

### Performance Report

![Performance Report](./outputs/image-3.png)

## Live Link

https://prodesk-dsag.vercel.app/
