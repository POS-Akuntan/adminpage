let currentTable = 'salesTable'; // Default ke tabel sales

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
    const response = await fetch('https://asia-southeast2-awangga.cloudfunctions.net/itungin/sales');
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
}

async function fetchExpensesData() {
    const response = await fetch('https://asia-southeast2-awangga.cloudfunctions.net/itungin/expenses');
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
}

async function fetchCustomers() {
    const response = await fetch('https://asia-southeast2-awangga.cloudfunctions.net/itungin/customers');
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

const salesTable = document.getElementById('salesTable');
const expensesTable = document.getElementById('expensesTable');
const salesTableBody = document.getElementById('salesTableBody');
const expensesTableBody = document.getElementById('expensesTableBody');
const customersTableBody = document.getElementById('customersTableBody');

// Fetch initial data
showSales();
showExpenses();
fetchCustomers();
