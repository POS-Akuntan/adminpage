import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import {addCSS} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";

addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

// Ambil data transaksi dari API dan tampilkan dalam tabel
async function fetchTransactions() {
    const token = localStorage.getItem("token"); // Ambil token dari localStorage
    if (!token) {
        Swal.fire("Error", "Authorization token not found. Please log in.", "error");
        return;
    }

    try {
        const response = await fetch("https://pos-ochre.vercel.app/api/transactions", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            const transactions = await response.json();
            const salesTableBody = document.getElementById("salesTableBody");
            salesTableBody.innerHTML = ""; // Kosongkan tabel sebelum menambah data baru

            transactions.forEach((transaction) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${new Date(transaction.transaction_date).toLocaleDateString()}</td>
                    <td>${transaction.user_id}</td> <!-- Bisa diganti dengan nama customer jika ada -->
                    <td>${transaction.product_name || "N/A"}</td>
                    <td>$${transaction.total_amount}</td>
                    <td>${transaction.payment_method || "N/A"}</td>
                `;
                salesTableBody.appendChild(row);
            });
        } else {
            throw new Error("Failed to fetch transactions.");
        }
    } catch (error) {
        Swal.fire("Error", error.message, "error");
    }
}

// Panggil fungsi fetchTransactions saat halaman dimuat
window.onload = fetchTransactions;
