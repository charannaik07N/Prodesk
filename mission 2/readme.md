# Mission 2: Cash Flow Dashboard

A lightweight personal finance dashboard to track salary, add expenses, monitor remaining balance, view a pie chart, convert INR to USD, and export a PDF report.

## Features

- Set and update total salary.
- Add named expenses with amount.
- Delete individual expenses.
- Automatically calculate remaining balance.
- Budget warning when remaining balance drops below 10% of salary.
- Currency view switch: INR and USD.
- Live INR to USD exchange rate fetch with fallback rate.
- Expense distribution pie chart using Chart.js.
- PDF report export using jsPDF.
- Data persistence using localStorage (survives page refresh).

## Tech Stack

- HTML5
- Vanilla JavaScript (ES6)
- Tailwind CSS (CDN)
- Chart.js
- jsPDF

## Project Structure

```text
mission 2/
|-- index.html
|-- index.js
|-- prompt.md
|-- readme.md
```

## How To Run

1. Open the project folder in VS Code.
2. Open `index.html` in a browser.
3. Start using the dashboard.

Note: A local server is recommended for best browser compatibility.

## How It Works

- Salary and expenses are stored in INR as the base currency.
- UI values are formatted using the selected display currency.
- On USD selection, the app fetches INR to USD rate from:
  `https://api.frankfurter.app/latest?from=INR&to=USD`
- If API fetch fails, a fallback rate is used:
  `0.011`

## Data Persistence

The app saves data in browser localStorage under key:

`cashFlowDashboardState`

Stored state includes:

- salary
- expenses
- selected currency

On page load, data is restored and UI is re-rendered.

## PDF Export

Click **Download Report (PDF)** to generate:

- Salary summary
- Total expenses
- Final balance
- Expenses table
- Timestamp

Output filename:

`cash-flow-report.pdf`

## Troubleshooting

- Data exists in localStorage but not visible:
  - Ensure `loadStateFromLocalStorage()` runs on page load.
  - Ensure `updateSalaryDisplay()`, `renderExpenseList()`, and `updateBalance()` are called after loading state.
- USD values not updating:
  - Check internet access for exchange rate API.
  - Fallback rate is used when API is unavailable.
- PDF not downloading:
  - Confirm jsPDF CDN script is loaded.

## output images

 <img width="1851" height="655" alt="image" src="https://github.com/user-attachments/assets/fc04bf22-bfde-47f5-ae9f-ff310c92ea4e" />

  
## Author

Mission 2 project implementation.
