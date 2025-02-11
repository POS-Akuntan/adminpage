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
    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(data.length / rowsPerPage);
    let currentPage = 1;
    let paginationGroup = 0; // Tambahkan variabel paginationGroup
    const maxPagesVisible = 8; // Maksimum tombol pagination yang ditampilkan

    function displayPage(page) {
        salesTableBody.innerHTML = "";
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const paginatedData = data.slice(start, end);

        if (paginatedData.length === 0) {
            salesTableBody.innerHTML = "<tr><td colspan='9'>No data available.</td></tr>";
            return;
        }

        paginatedData.forEach((transaction, i) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${start + i + 1}</td>
                <td>${new Date(transaction.transaction_date).toLocaleString()}</td>
                <td>${transaction.user_name || "N/A"}</td>
                <td>Rp ${parseInt(transaction.total_amount).toLocaleString("id-ID")}</td>
                <td>${transaction.payment_method || "N/A"}</td>
                <td>${transaction.customer_name || "N/A"}</td>
                <td>${transaction.customer_phone || "N/A"}</td>
                <td>${transaction.table_number || "N/A"}</td>
                <td>
                    <button class="view-details-btn" onclick="fetchTransactionDetails('${transaction.id_transactions}')">
                        <i class="fas fa-search"></i>
                    </button>
                </td>
            `;
            salesTableBody.appendChild(row);
        });

        updatePaginationButtons(page);
    }

    function updatePaginationButtons(activePage) {
        paginationContainer.innerHTML = "";

        const startPage = paginationGroup * maxPagesVisible + 1;
        const endPage = Math.min(startPage + maxPagesVisible - 1, totalPages);

        // Tombol Previous (<<)
        if (paginationGroup > 0) {
            const prevButton = document.createElement("button");
            prevButton.textContent = "<";
            prevButton.className = "pagination-button";
            prevButton.onclick = () => {
                paginationGroup--;
                updatePaginationButtons(startPage - maxPagesVisible);
                displayPage(startPage - maxPagesVisible);
            };
            paginationContainer.appendChild(prevButton);
        }

        // Tombol Pagination (1, 2, 3, ... maxPagesVisible)
        for (let i = startPage; i <= endPage; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.className = "pagination-button";
            if (i === activePage) button.style.backgroundColor = "#97ced1"; // Highlight page aktif
            button.onclick = () => {
                currentPage = i;
                displayPage(currentPage);
            };
            paginationContainer.appendChild(button);
        }

        // Tombol Next (>>)
        if (endPage < totalPages) {
            const nextButton = document.createElement("button");
            nextButton.textContent = ">";
            nextButton.className = "pagination-button";
            nextButton.onclick = () => {
                paginationGroup++;
                updatePaginationButtons(endPage + 1);
                displayPage(endPage + 1);
            };
            paginationContainer.appendChild(nextButton);
        }
    }

    displayPage(currentPage);
}




// Fungsi untuk memanggil API id_transaction_item by id_transactions
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
            <p><strong>Quantity:</strong> ${transaction.quantity}</p>
            <p>Unit Price:</strong> Rp ${parseInt(transaction.unit_price).toLocaleString("id-ID")}</p>
            <td>Total Price:</strong> Rp ${parseInt(transaction.total_price).toLocaleString("id-ID")}</td>

            <p><strong>Product Name:</strong> ${transaction.product_name}</p>
            <hr>
          `;
        });
        //<p><strong>Unit Price:</strong> Rp ${transaction.unit_price.toLocaleString("id-ID")}</p>
        //<p><strong>Total Price:</strong> Rp ${transaction.total_price.toLocaleString("id-ID")}</p>
        Swal.fire({
          title: "Transaction Details",
          html: detailsHtml,
          icon: "info",
        });
      } else {
        Swal.fire("Info", "No transaction details found.", "info");
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

        const today = new Date();
        const todayStart = new Date(today.setHours(0, 0, 0, 0)); // Hari ini mulai pukul 00:00
        const now = new Date(); // Waktu saat ini

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStart = new Date(yesterday.setHours(0, 0, 0, 0));
        const yesterdayEnd = new Date(yesterday.setHours(23, 59, 59, 999));

        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay()); // Hari Minggu sebagai awal minggu
        weekStart.setHours(0, 0, 0, 0);

        // Hitung pendapatan hari ini
        const todayIncome = transactions
            .filter((transaction) => {
                const transactionDate = new Date(transaction.transaction_date);
                return transactionDate >= todayStart && transactionDate <= now;
            })
            .reduce((total, transaction) => total + parseFloat(transaction.total_amount || 0), 0);

        // Hitung pendapatan kemarin
        const yesterdayIncome = transactions
            .filter((transaction) => {
                const transactionDate = new Date(transaction.transaction_date);
                return transactionDate >= yesterdayStart && transactionDate <= yesterdayEnd;
            })
            .reduce((total, transaction) => total + parseFloat(transaction.total_amount || 0), 0);

        // Hitung pendapatan minggu ini
        const weekIncome = transactions
            .filter((transaction) => {
                const transactionDate = new Date(transaction.transaction_date);
                return transactionDate >= weekStart && transactionDate <= now;
            })
            .reduce((total, transaction) => total + parseFloat(transaction.total_amount || 0), 0);

        // Tampilkan hasil di card
        document.querySelector(".stat-card:nth-child(1) p").innerText = `Rp ${todayIncome.toLocaleString("id-ID")}`;
        document.querySelector(".stat-card:nth-child(2) p").innerText = `Rp ${yesterdayIncome.toLocaleString("id-ID")}`;
        document.querySelector(".stat-card:nth-child(3) p").innerText = `Rp ${weekIncome.toLocaleString("id-ID")}`;
    } catch (error) {
        console.error("Error fetching statistics:", error);

        // Default nilai jika gagal
        document.querySelector(".stat-card:nth-child(1) p").innerText = "Rp 0";
        document.querySelector(".stat-card:nth-child(2) p").innerText = "Rp 0";
        document.querySelector(".stat-card:nth-child(3) p").innerText = "Rp 0";

        Swal.fire("Error", "Failed to load statistics", "error");
    }
}



window.onload = () => {
    fetchTransactions();
    fetchUsers();
    fetchStatistics();
};
