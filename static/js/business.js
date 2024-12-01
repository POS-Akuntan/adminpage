let currentPage = 1;
let totalPages = 1;
const transactionsPerPage = 10; // Jumlah transaksi per halaman

async function fetchTransactions(page = 1) {
    const token = localStorage.getItem("token");
    if (!token) {
        Swal.fire("Error", "Authorization token not found. Please log in.", "error");
        return;
    }

    try {
        const response = await fetch(`https://pos-ochre.vercel.app/api/transactions?page=${page}&limit=${transactionsPerPage}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch transactions");
        }

        const { transactions, total } = await response.json();

        if (!Array.isArray(transactions)) {
            throw new Error("Transactions data is not in expected format");
        }

        // Update jumlah halaman berdasarkan total transaksi
        totalPages = Math.ceil(total / transactionsPerPage);

        // Clear tabel yang ada
        const salesTableBody = document.getElementById("salesTableBody");
        salesTableBody.innerHTML = ""; 

        if (transactions.length === 0) {
            salesTableBody.innerHTML = "<tr><td colspan='4'>No transactions found.</td></tr>";
        } else {
            // Menambahkan data transaksi ke dalam tabel
            transactions.forEach(transaction => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${new Date(transaction.transaction_date).toLocaleString()}</td>
                    <td>${transaction.user_name || "N/A"}</td>
                    <td>${transaction.total_amount}</td>
                    <td>${transaction.payment_method || "N/A"}</td>
                `;
                salesTableBody.appendChild(row);
            });
        }

        // Update tombol pagination
        updatePagination();
    } catch (error) {
        console.error("Error fetching transactions:", error);
        Swal.fire("Error", "Failed to load transactions", "error");
    }
}


// Fungsi untuk mengupdate tombol pagination
function updatePagination() {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = ""; // Clear tombol pagination sebelumnya

    // Tombol Previous
    const prevButton = document.createElement("button");
    prevButton.innerText = "Previous";
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener("click", () => changePage(currentPage - 1));
    paginationContainer.appendChild(prevButton);

    // Tombol nomor halaman
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.innerText = i;
        pageButton.disabled = i === currentPage;
        pageButton.addEventListener("click", () => changePage(i));
        paginationContainer.appendChild(pageButton);
    }

    // Tombol Next
    const nextButton = document.createElement("button");
    nextButton.innerText = "Next";
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener("click", () => changePage(currentPage + 1));
    paginationContainer.appendChild(nextButton);
}

// Fungsi untuk merubah halaman
function changePage(page) {
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    fetchTransactions(currentPage);
}

// Fungsi untuk mengambil data pengguna
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
        console.log("Users data:", data);

        const users = data.users || [];
        const employeeTableBody = document.getElementById("employeesTableBody");
        employeeTableBody.innerHTML = ""; // Clear existing rows

        if (users.length === 0) {
            employeeTableBody.innerHTML = "<tr><td colspan='3'>No users found.</td></tr>";
            return;
        }

        users.forEach(user => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${user.name || "N/A"}</td>
                <td>${user.role || "N/A"}</td>
                <td>${user.email || "N/A"}</td>
                <td>${user.phone_number || "N/A"}</td>
            `;
            employeeTableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        Swal.fire("Error", "Failed to load employee data", "error");
    }
}

// Fungsi untuk mengambil statistik
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

        // 1. Pendapatan Kemarin Hari
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

        // 2. Pendapatan Minggu Kemarin
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const lastWeekIncome = transactions
            .filter(
                (transaction) =>
                    new Date(transaction.transaction_date) >= lastWeek &&
                    new Date(transaction.transaction_date) <= yesterdayEnd
            )
            .reduce((total, transaction) => total + parseFloat(transaction.total_amount || 0), 0);

        // 3. Total Pendapatan Tertinggi
        const highestIncome = transactions.reduce(
            (max, transaction) => Math.max(max, parseFloat(transaction.total_amount || 0)),
            0
        );

        // Update Card dengan Data
        document.querySelector(".stat-card:nth-child(1) p").innerText = `Rp ${yesterdayIncome.toLocaleString("id-ID")}`;
        document.querySelector(".stat-card:nth-child(2) p").innerText = `Rp ${lastWeekIncome.toLocaleString("id-ID")}`;
        document.querySelector(".stat-card:nth-child(3) p").innerText = `Rp ${highestIncome.toLocaleString("id-ID")}`;
    } catch (error) {
        console.error("Error fetching statistics:", error);
        Swal.fire("Error", "Failed to load statistics", "error");
    }
}

// Panggil fungsi fetchStatistics di window.onload
window.onload = () => {
    fetchTransactions(currentPage); // Mem-fetch data transaksi untuk tabel
    fetchUsers(); // Mem-fetch data pengguna untuk tabel Employee
    fetchStatistics(); // Mem-fetch statistik untuk cards
};
