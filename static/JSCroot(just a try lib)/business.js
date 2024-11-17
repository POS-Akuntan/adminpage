// Import the JSCroot library
import * as JSCroot from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.1/api.js';

let currentTable = 'salesTable'; // Default to sales table

function showSales() {
    document.getElementById('salesTable').classList.remove('hidden');
    document.getElementById('expensesTable').classList.add('hidden');
    currentTable = 'salesTable';
    fetchSalesData();
}

function showExpenses() {
    document.getElementById('expensesTable').classList.remove('hidden');
    document.getElementById('salesTable').classList.add('hidden');
    currentTable = 'expensesTable';
    fetchExpensesData();
}

async function fetchSalesData() {
    try {
        const response = await JSCroot.get('https://asia-southeast2-awangga.cloudfunctions.net/itungin/sales');
        const salesData = await response.json();
        const salesTableBody = document.getElementById('salesTableBody');
        salesTableBody.innerHTML = '';

        salesData.forEach(sale => {
            const productNames = sale.products.map(product => product.name).join(', ');
            const row = `<tr>
                <td>${new Date(sale.transactionDate).toLocaleDateString()}</td>
                <td>${sale.customer_name}</td>
                <td>${productNames}</td>
                <td>${sale.total_amount}</td>
                <td>${sale.payment_method}</td>
            </tr>`;
            salesTableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error fetching sales data:", error);
    }
}

async function fetchExpensesData() {
    try {
        const response = await JSCroot.get('https://asia-southeast2-awangga.cloudfunctions.net/itungin/expenses');
        const expensesData = await response.json();
        const expensesTableBody = document.getElementById('expensesTableBody');
        expensesTableBody.innerHTML = '';

        expensesData.forEach(expense => {
            const row = `<tr>
                <td>${new Date(expense.expense_date).toLocaleDateString()}</td>
                <td>${expense.expense_name}</td>
                <td>${expense.amount}</td>
                <td>${expense.category}</td>
            </tr>`;
            expensesTableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error fetching expenses data:", error);
    }
}

async function fetchCustomers() {
    try {
        const response = await JSCroot.get('https://asia-southeast2-awangga.cloudfunctions.net/itungin/customers');
        const customersData = await response.json();
        const customersTableBody = document.getElementById('customersTableBody');
        customersTableBody.innerHTML = '';

        customersData.forEach(customer => {
            const row = `<tr>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>${customer.address}</td>
            </tr>`;
            customersTableBody.innerHTML += row;
        });
    } catch (error) {
        console.error("Error fetching customers data:", error);
    }
}

function exportCurrentTableToCSV() {
    const tableBodyId = currentTable === 'salesTable' ? 'salesTableBody' : 'expensesTableBody';
    const filename = currentTable === 'salesTable' ? 'sales_transactions.csv' : 'expense_transactions.csv';
    exportToCSV(tableBodyId, filename);
}

function exportToCSV(tableId, filename) {
    const rows = document.querySelectorAll(`#${tableId} tr`);
    const csvContent = Array.from(rows).map(row => {
        const columns = row.querySelectorAll('th, td');
        return Array.from(columns).map(column => column.textContent).join(',');
    }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Fetch initial data and display tables
showSales();
showExpenses();
fetchCustomers();
