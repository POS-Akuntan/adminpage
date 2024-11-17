// Import JSCroot library for API handling
import * as JSCroot from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.1/api.js';

// Fetch data for invoices and expenses from backend (replace dummy data)
async function fetchInvoices() {
    try {
        const response = await JSCroot.get('https://your-backend-api-url.com/invoices'); // Update with actual endpoint
        return await response.json();
    } catch (error) {
        console.error('Error fetching invoices:', error);
        return []; // Return an empty array on error
    }
}

async function fetchExpenses() {
    try {
        const response = await JSCroot.get('https://your-backend-api-url.com/expenses'); // Update with actual endpoint
        return await response.json();
    } catch (error) {
        console.error('Error fetching expenses:', error);
        return []; // Return an empty array on error
    }
}

// Function to display invoices on the page
async function displayInvoices() {
    const invoiceList = document.getElementById('invoice-list');
    invoiceList.innerHTML = ''; // Clear existing invoices

    const invoices = await fetchInvoices(); // Get invoices from backend

    invoices.forEach((invoice) => {
        const li = document.createElement('li');
        li.textContent = `${invoice.description} - Rp ${invoice.amount}`;
        invoiceList.appendChild(li);
    });
}

// Function to display expenses on the page
async function displayExpenses() {
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = ''; // Clear existing expenses

    const expenses = await fetchExpenses(); // Get expenses from backend

    expenses.forEach((expense) => {
        const li = document.createElement('li');
        li.textContent = `${expense.description} - Rp ${expense.amount}`;
        expenseList.appendChild(li);
    });
}

// Call functions to display data when the page loads
window.onload = function () {
    displayInvoices();
    displayExpenses();
};
