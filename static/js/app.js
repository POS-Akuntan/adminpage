// Inisialisasi data dummy untuk faktur dan pengeluaran
const invoices = [
    { id: 1, description: 'Faktur 001', amount: 5000000 },
    { id: 2, description: 'Faktur 002', amount: 3000000 },
];

const expenses = [
    { id: 1, description: 'Pembelian Barang', amount: 1000000 },
    { id: 2, description: 'Pembayaran Gaji', amount: 2000000 },
];

// Fungsi untuk menampilkan faktur
function displayInvoices() {
    const invoiceList = document.getElementById('invoice-list');
    invoiceList.innerHTML = ''; // Kosongkan daftar faktur

    invoices.forEach((invoice) => {
        const li = document.createElement('li');
        li.textContent = `${invoice.description} - Rp ${invoice.amount}`;
        invoiceList.appendChild(li);
    });
}

// Fungsi untuk menampilkan pengeluaran
function displayExpenses() {
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = ''; // Kosongkan daftar pengeluaran

    expenses.forEach((expense) => {
        const li = document.createElement('li');
        li.textContent = `${expense.description} - Rp ${expense.amount}`;
        expenseList.appendChild(li);
    });
}

// Panggil fungsi untuk menampilkan data saat halaman dimuat
window.onload = function () {
    displayInvoices();
    displayExpenses();
};
