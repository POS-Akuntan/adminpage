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




window.onload = () => {
    fetchTransactions(); // Mem-fetch transaksi saat halaman dimuat
    fetchUsers(); // Mem-fetch data pengguna saat halaman dimuat
};


