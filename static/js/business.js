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
                <td>${new Date(transaction.transaction_date).toLocaleString()}</td>
                <td>${transaction.user_name || "N/A"}</td>
                <td>${transaction.total_amount}</td>
                <td>${transaction.payment_method || "N/A"}</td>
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

// Update fungsi fetchTransactions untuk menggunakan pagination
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
                "Authorization": `Bearer ${token}`,
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

        const salesTableBody = document.getElementById("salesTableBody");
        salesTableBody.innerHTML = ""; // Clear existing rows

        for (const transaction of transactions) {
            // Menampilkan data transaksi termasuk user_name
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${new Date(transaction.transaction_date).toLocaleString()}</td>
                <td>${transaction.user_name || "N/A"}</td> <!-- Mengambil user_name langsung dari transaksi -->
                <td>${transaction.total_amount}</td>
                <td>${transaction.payment_method || "N/A"}</td>
            `;
            salesTableBody.appendChild(row);
        }
    } catch (error) {
        console.error("Error fetching transactions:", error);
        Swal.fire("Error", "Failed to load transactions", "error");
    }
}

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
                "Authorization": `Bearer ${token}`, // Menambahkan token di header
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        console.log("Users data:", data);  // Menampilkan hasil response di console

        // Ambil data users dari respons
        const users = data.users || [];  // Akses data users yang ada di dalam response

        // Mendapatkan body dari tabel employee
        const employeeTableBody = document.getElementById("employeesTableBody");
        employeeTableBody.innerHTML = ""; // Clear existing rows

        if (users.length === 0) {
            employeeTableBody.innerHTML = "<tr><td colspan='3'>No users found.</td></tr>";
            return;
        }

        // Menampilkan data pengguna (employee) dengan role, name, dan email
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
        console.log("Transactions data:", transactions);

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

        // 4. Update Card dengan Data
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
    fetchTransactions(); // Mem-fetch data transaksi untuk tabel
    fetchUsers(); // Mem-fetch data pengguna untuk tabel Employee
    fetchStatistics(); // Mem-fetch statistik untuk cards
};

// 4
