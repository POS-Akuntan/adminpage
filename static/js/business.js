async function fetchTransactions() {
    const token = localStorage.getItem("token");
    if (!token) {
        Swal.fire("Error", "Authorization token not found. Please log in.", "error");
        return;
    }

    try {
        const response = await fetch("https://pos-ochre.vercel.app/api/transactions", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // Menambahkan token di header
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch transactions");
        }

        const transactions = await response.json();
        applyPagination(transactions, 8); // Terapkan pagination dengan 8 data per halaman
    } catch (error) {
        console.error("Error fetching transactions:", error);
        Swal.fire("Error", "Failed to load transactions", "error");
    }
}

// Fungsi untuk menerapkan pagination
function applyPagination(data, rowsPerPage = 8) {
    const paginationContainer = document.getElementById("paginationContainer");
    const salesTableBody = document.getElementById("salesTableBody");
    paginationContainer.innerHTML = ""; // Clear pagination buttons

    const totalPages = Math.ceil(data.length / rowsPerPage);
    let currentPage = 1;

    // Fungsi untuk menampilkan data per halaman
    function displayPage(page) {
        salesTableBody.innerHTML = ""; // Clear current rows
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedData = data.slice(start, end);

        for (const transaction of paginatedData) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${transaction.id}</td>
                <td>${new Date(transaction.transaction_date).toLocaleString()}</td>
                <td>${transaction.user_name || "N/A"}</td>
                <td>${transaction.total_amount}</td>
                <td>${transaction.payment_method || "N/A"}</td>
                <td>
                    <button class="view-details-btn" onclick="fetchTransactionDetails('${transaction.id}')">
                        <i class="fas fa-search"></i>
                    </button>
                </td>
            `;
            salesTableBody.appendChild(row);
        }
    }

    // Fungsi untuk membuat tombol pagination
    function createPaginationButtons() {
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.className = "pagination-button";
            button.onclick = () => {
                currentPage = i;
                displayPage(currentPage);
            };
            paginationContainer.appendChild(button);
        }
    }

    // Inisialisasi halaman pertama
    displayPage(currentPage);
    createPaginationButtons();
}


// Fungsi untuk memanggil API detail transaksi
async function fetchTransactionDetails(transactionId) {
    console.log("Fetching transaction details for ID:", transactionId);
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire("Error", "Authorization token not found. Please log in.", "error");
            return;
        }

        const response = await fetch(`https://pos-ochre.vercel.app/api/transaction-items/${transactionId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // Sertakan token di header
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch transaction details");
        }

        const transactionDetails = await response.json();
        console.log("Transaction Details:", transactionDetails);

        if (transactionDetails.length > 0) {
            let detailsHtml = '';
            // Loop untuk semua produk dalam transaksi
            transactionDetails.forEach(transaction => {
                detailsHtml += `
                    <p><strong>ID:</strong> ${transaction.id_transactions}</p>
                    <p><strong>Transaction ID:</strong> ${transaction.transaction_id}</p>
                    <p><strong>Product ID:</strong> ${transaction.product_id}</p>
                    <p><strong>Quantity:</strong> ${transaction.quantity}</p>
                    <p><strong>Unit Price:</strong> ${transaction.unit_price}</p>
                    <p><strong>Total Price:</strong> ${transaction.total_price}</p>
                    <p><strong>Product Name:</strong> ${transaction.product_name}</p>
                    <p><strong>Customer:</strong>${transaction.customer_name}</P>
                    <p><strong>Customer:</strong>${transaction.customer_phone}</P>
                    <p><strong>Customer:</strong>${transaction.table_number}</P>
                    <hr>
                `;
            });

            Swal.fire({
                title: "Transaction Details",
                html: detailsHtml,
                icon: "info",
            });
        } else {
            Swal.fire("Error", "No transaction details found.", "error");
        }
        
    } catch (error) {
        console.error("Error fetching transaction details:", error);
        Swal.fire("Error", "Failed to fetch transaction details", "error");
    }
}


// Ekspose fungsi ke global scope
window.fetchTransactionDetails = fetchTransactionDetails;


// Fungsi untuk memuat data pengguna
async function fetchUsers() {
    const token = localStorage.getItem("token");
    if (!token) {
        Swal.fire("Error", "Authorization token not found. Please log in.", "error");
        return;
    }

    try {
        const response = await fetch("https://pos-ochre.vercel.app/api/auth/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        const users = data.users || [];
        const employeeTableBody = document.getElementById("employeesTableBody");
        employeeTableBody.innerHTML = ""; // Clear existing rows

        if (users.length === 0) {
            employeeTableBody.innerHTML = "<tr><td colspan='4'>No users found.</td></tr>";
            return;
        }

        for (const user of users) {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.name || "N/A"}</td>
                <td>${user.role || "N/A"}</td>
                <td>${user.email || "N/A"}</td>
                <td>${user.phone_number || "N/A"}</td>
            `;
            employeeTableBody.appendChild(row);
        }
    } catch (error) {
        console.error("Error fetching users:", error);
        Swal.fire("Error", "Failed to load employee data", "error");
    }
}

// Fungsi untuk statistik transaksi
async function fetchStatistics() {
    const token = localStorage.getItem("token");
    if (!token) {
        Swal.fire("Error", "Authorization token not found. Please log in.", "error");
        return;
    }

    try {
        const response = await fetch("https://pos-ochre.vercel.app/api/transactions", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch transactions");
        }

        const transactions = await response.json();

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStart = new Date(yesterday.setHours(0, 0, 0, 0));
        const yesterdayEnd = new Date(yesterday.setHours(23, 59, 59, 999));

        const yesterdayIncome = transactions
            .filter(
                (transaction) =>
                    new Date(transaction.transaction_date) >= yesterdayStart &&
                    new Date(transaction.transaction_date) <= yesterdayEnd
            )
            .reduce((total, transaction) => total + parseFloat(transaction.total_amount || 0), 0);

        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const lastWeekIncome = transactions
            .filter(
                (transaction) =>
                    new Date(transaction.transaction_date) >= lastWeek &&
                    new Date(transaction.transaction_date) <= yesterdayEnd
            )
            .reduce((total, transaction) => total + parseFloat(transaction.total_amount || 0), 0);

        const highestIncome = transactions.reduce(
            (max, transaction) => Math.max(max, parseFloat(transaction.total_amount || 0)),
            0
        );

        document.querySelector(".stat-card:nth-child(1) p").innerText = `Rp ${yesterdayIncome.toLocaleString("id-ID")}`;
        document.querySelector(".stat-card:nth-child(2) p").innerText = `Rp ${lastWeekIncome.toLocaleString("id-ID")}`;
        document.querySelector(".stat-card:nth-child(3) p").innerText = `Rp ${highestIncome.toLocaleString("id-ID")}`;
    } catch (error) {
        console.error("Error fetching statistics:", error);
        Swal.fire("Error", "Failed to load statistics", "error");
    }
}

window.onload = () => {
    fetchTransactions();
    fetchUsers();
    fetchStatistics();
};
