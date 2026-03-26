const salaryInput = document.getElementById("salaryInput");
const setSalaryBtn = document.getElementById("setSalaryBtn");
const salaryDisplay = document.getElementById("salaryDisplay");
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const addExpenseBtn = document.getElementById("addExpenseBtn");
const expenseList = document.getElementById("expenseList");
const balance = document.getElementById("balance");
const currencySelector = document.getElementById("currencySelector");
const expenseChartCanvas = document.getElementById("expenseChart");
const downloadPDFBtn = document.getElementById("downloadPDF");
const alertMessage = document.getElementById("alertMessage");

let salary = 0;
let expenses = [];
let inrToUsdRate = null;
let expenseChart = null;
const FALLBACK_INR_TO_USD_RATE = 0.011;
const STORAGE_KEY = "cashFlowDashboardState";

function saveStateToLocalStorage() {
  const state = {
    salary,
    expenses,
    currency: currencySelector.value,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
// restore state from local storage on page load, ensuring data is displayed in the UI after refresh
function loadStateFromLocalStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    salary = Number(parsed?.salary) || 0;

    if (Array.isArray(parsed?.expenses)) {
      expenses = parsed.expenses
        .map((expense) => ({
          id: expense?.id ?? Date.now() + Math.random(),
          name: String(expense?.name || "").trim(),
          amount: Number(expense?.amount) || 0,
        }))
        .filter((expense) => expense.name && expense.amount > 0);
    }

    if (parsed?.currency === "INR" || parsed?.currency === "USD") {
      currencySelector.value = parsed.currency;
    }
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function getTotalExpenses() {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

function getRemainingBalanceInr() {
  return salary - getTotalExpenses();
}

async function fetchInrToUsdRate() {
  const response = await fetch(
    "https://api.frankfurter.app/latest?from=INR&to=USD",
  );
  if (!response.ok) {
    throw new Error("Failed to fetch exchange rate");
  }

  const data = await response.json();
  const rate = Number(data?.rates?.USD);
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error("Invalid exchange rate");
  }

  return rate;
}

async function ensureInrToUsdRate() {
  if (inrToUsdRate) {
    return inrToUsdRate;
  }

  try {
    inrToUsdRate = await fetchInrToUsdRate();
  } catch {
    inrToUsdRate = FALLBACK_INR_TO_USD_RATE;
  }

  return inrToUsdRate;
}

function convertFromInr(amountInr, currencyCode) {
  if (currencyCode === "USD") {
    return amountInr * (inrToUsdRate || FALLBACK_INR_TO_USD_RATE);
  }

  return amountInr;
}

function formatAmountBySelectedCurrency(amountInr) {
  const selectedCurrency = currencySelector.value;
  const convertedAmount = convertFromInr(amountInr, selectedCurrency);
  return formatCurrency(convertedAmount, selectedCurrency);
}

function formatCurrency(amount, currencyCode) {
  const locale = currencyCode === "INR" ? "en-IN" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: 2,
  }).format(amount);
}
// renders all expenses with the selected currency
function renderExpenseList() {
  expenseList.innerHTML = "";

  expenses.forEach((expense) => {
    const li = document.createElement("li");
    li.className = "flex items-center justify-between py-2";
    li.dataset.expenseId = String(expense.id);

    const label = document.createElement("span");
    label.textContent = `${expense.name}: ${formatAmountBySelectedCurrency(Number(expense.amount))}`;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.textContent = "🗑";
    deleteBtn.setAttribute("aria-label", `Delete ${expense.name}`);
    deleteBtn.className =
      "rounded px-2 py-1 text-base leading-none text-red-600 hover:bg-red-50";
    deleteBtn.addEventListener("click", function () {
      expenses = expenses.filter((item) => item.id !== expense.id);
      saveStateToLocalStorage();
      renderExpenseList();
      updateBalance();
    });

    li.appendChild(label);
    li.appendChild(deleteBtn);
    expenseList.appendChild(li);
  });
}

function updateSalaryDisplay() {
  salaryDisplay.textContent = formatAmountBySelectedCurrency(salary);
}
// handles the salary input and updates the display and balance
setSalaryBtn.addEventListener("click", function () {
  salary = parseFloat(salaryInput.value) || 0;
  saveStateToLocalStorage();
  updateSalaryDisplay();
  updateBalance();
});
// handles adding a new expense, updates the list and balance
addExpenseBtn.addEventListener("click", function () {
  const name = expenseName.value.trim();
  const amount = parseFloat(expenseAmount.value) || 0;

  if (name && amount > 0) {
    const expense = {
      id: Date.now() + Math.random(),
      name,
      amount,
    };

    expenses.push(expense);
    saveStateToLocalStorage();
    renderExpenseList();
    updateBalance();

    expenseName.value = "";
    expenseAmount.value = "";
  }
});
// handles currency change and updates the balance display accordingly
currencySelector.addEventListener("change", async function () {
  if (currencySelector.value === "USD") {
    await ensureInrToUsdRate();
  }

  saveStateToLocalStorage();
  updateSalaryDisplay();
  renderExpenseList();
  updateBalance();
});

// initializes the pie chart showing remaining balance vs total expenses
function initializeChart() {
  if (expenseChart) {
    expenseChart.destroy();
  }

  const totalExpenses = getTotalExpenses();
  const remainingBalanceInr = getRemainingBalanceInr();

  const ctx = expenseChartCanvas.getContext("2d");
  expenseChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Remaining Balance", "Total Expenses"],
      datasets: [
        {
          data: [Math.max(0, remainingBalanceInr), totalExpenses],
          backgroundColor: ["#00d084", "#ff6b6b"],
          borderColor: ["#00d084", "#ff6b6b"],
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            font: {
              size: 14,
              family: "Sora",
            },
            padding: 15,
          },
        },
      },
    },
  });
}
// updates the balance alert message and styling based on remaining balance compared to salary
function updateBudgetAlert(remainingBalanceInr) {
  if (salary <= 0) {
    balance.classList.remove("text-red-600");
    balance.classList.add("text-teal-700");
    alertMessage.textContent = "";
    return;
  }

  const threshold = salary * 0.1;
  if (remainingBalanceInr < threshold) {
    balance.classList.remove("text-teal-700");
    balance.classList.add("text-red-600");
    alertMessage.textContent =
      "Warning: Remaining Balance is below 10% of your salary.";
  } else {
    balance.classList.remove("text-red-600");
    balance.classList.add("text-teal-700");
    alertMessage.textContent = "";
  }
}
// formats currency values for the PDF report, ensuring consistent display based on selected currency
function formatPdfCurrency(amount, currencyCode) {
  const numeric = Number(amount || 0);
  const locale = currencyCode === "INR" ? "en-IN" : "en-US";
  const value = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);

  return `${currencyCode} ${value}`;
}
// generates and downloads a PDF report of the cash flow, including salary, expenses, and remaining balance, formatted according to the selected currency
function downloadReportAsPdf() {
  const jsPDFConstructor = window.jspdf?.jsPDF;
  if (!jsPDFConstructor) {
    alert("PDF library failed to load. Please try again.");
    return;
  }

  const doc = new jsPDFConstructor();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const left = 14;
  const right = pageWidth - 14;
  const totalExpenses = getTotalExpenses();
  const remainingBalanceInr = getRemainingBalanceInr();
  const selectedCurrency = currencySelector.value;

  const salaryValue = convertFromInr(salary, selectedCurrency);
  const totalExpensesValue = convertFromInr(totalExpenses, selectedCurrency);
  const remainingValue = convertFromInr(remainingBalanceInr, selectedCurrency);
  const rows = expenses.map((expense, index) => ({
    no: index + 1,
    name: expense.name,
    amount: formatPdfCurrency(
      convertFromInr(expense.amount, selectedCurrency),
      selectedCurrency,
    ),
  }));

  let y = 18;

  doc.setFillColor(24, 39, 75);
  doc.rect(0, 0, pageWidth, 30, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text("Cash Flow Report", left, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, left, y + 8);

  doc.setTextColor(30, 30, 30);
  y = 42;

  doc.setDrawColor(225, 225, 225);
  doc.setFillColor(247, 249, 252);
  doc.roundedRect(left, y - 6, right - left, 28, 2, 2, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(
    `Salary: ${formatPdfCurrency(salaryValue, selectedCurrency)}`,
    left + 4,
    y + 2,
  );
  doc.text(
    `Total Expenses: ${formatPdfCurrency(totalExpensesValue, selectedCurrency)}`,
    left + 4,
    y + 10,
  );
  doc.text(
    `Final Balance: ${formatPdfCurrency(remainingValue, selectedCurrency)}`,
    left + 4,
    y + 18,
  );

  y += 34;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Expenses Table", left, y);
  y += 6;

  const tableTop = y;
  const rowHeight = 8;
  const colNo = 14;
  const colName = 100;
  const colAmount = right - left - colNo - colName;

  const drawTableHeader = (topY) => {
    doc.setFillColor(230, 236, 245);
    doc.rect(left, topY, right - left, rowHeight, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("#", left + 2, topY + 5.3);
    doc.text("Expense Name", left + colNo + 2, topY + 5.3);
    doc.text("Amount", left + colNo + colName + 2, topY + 5.3);
  };

  drawTableHeader(tableTop);
  y = tableTop + rowHeight;

  if (rows.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.rect(left, y, right - left, rowHeight);
    doc.text("No expenses added", left + 2, y + 5.3);
    y += rowHeight;
  } else {
    rows.forEach((row, index) => {
      if (y + rowHeight + 20 > pageHeight) {
        doc.addPage();
        y = 16;
        drawTableHeader(y);
        y += rowHeight;
      }

      if (index % 2 === 0) {
        doc.setFillColor(249, 251, 253);
        doc.rect(left, y, right - left, rowHeight, "F");
      }

      doc.setDrawColor(220, 220, 220);
      doc.rect(left, y, right - left, rowHeight);
      doc.line(left + colNo, y, left + colNo, y + rowHeight);
      doc.line(
        left + colNo + colName,
        y,
        left + colNo + colName,
        y + rowHeight,
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(String(row.no), left + 2, y + 5.3);
      doc.text(row.name, left + colNo + 2, y + 5.3, {
        maxWidth: colName - 4,
      });
      doc.text(row.amount, left + colNo + colName + 2, y + 5.3, {
        maxWidth: colAmount - 4,
      });

      y += rowHeight;
    });
  }

  const footerY = Math.min(pageHeight - 12, y + 10);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);
  doc.text("Generated by Cash Flow Dashboard", left, footerY);

  doc.save("cash-flow-report.pdf");
}

// calculates the remaining balance and updates the display based on the selected currency
async function updateBalance() {
  const remainingBalanceInr = getRemainingBalanceInr();
  const selectedCurrency = currencySelector.value;

  if (selectedCurrency === "USD") {
    await ensureInrToUsdRate();
    const remainingBalanceUsd = convertFromInr(remainingBalanceInr, "USD");
    balance.textContent = formatCurrency(remainingBalanceUsd, "USD");
  } else {
    balance.textContent = formatCurrency(remainingBalanceInr, "INR");
  }

  updateBudgetAlert(remainingBalanceInr);
  initializeChart();
}

downloadPDFBtn.addEventListener("click", downloadReportAsPdf);

loadStateFromLocalStorage();
updateSalaryDisplay();
renderExpenseList();
updateBalance();
