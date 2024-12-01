import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import {addCSS} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";

addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

// Ambil data transaksi dari API dan tampilkan dalam tabel
async function fetchTransactions() {
    try {
        const response = await fetch("https://pos-ochre.vercel.app/api/transactions");
        if (!response.ok) {
            throw new Error("Failed to fetch transactions");
        }
        const transactions = await response.json();

        const salesTableBody = document.getElementById("salesTableBody");
        salesTableBody.innerHTML = ""; // Clear existing rows

        transactions.forEach(transaction => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${new Date(transaction.transaction_date).toLocaleString()}</td>
                <td>${transaction.user_id}</td>
                <td>${transaction.total_amount}</td>
                <td>${transaction.payment_method || "N/A"}</td>
            `;
            salesTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        Swal.fire("Error", "Failed to load transactions", "error");
    }
}

// Call the function when the page loads
window.onload = fetchTransactions;


// Panggil fungsi fetchTransactions saat halaman dimuat
window.onload = fetchTransactions;
