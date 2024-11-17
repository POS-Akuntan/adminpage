async function submitExpense(event) {
    event.preventDefault();

    const expenseData = {
        expense_name: document.getElementById('expense_name').value,
        amount: parseFloat(document.getElementById('amount').value),
        category: document.getElementById('category').value,
        expense_date: new Date(document.getElementById('expense_date').value).toISOString(), // Format tanggal ke ISO 8601
        payment_method: document.getElementById('payment_method') ? document.getElementById('payment_method').value : "",
        notes: document.getElementById('notes') ? document.getElementById('notes').value : ""
    };

    try {
        const response = await fetch('https://asia-southeast2-awangga.cloudfunctions.net/itungin/expense', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(expenseData),
        });

        if (response.ok) {
            alert('Pengeluaran berhasil ditambahkan!');
            window.location.href = 'Business.html'; // Kembali ke halaman utama
        } else {
            const errorData = await response.json();
            alert(`Gagal menambahkan pengeluaran: ${errorData.message}`);
        }
    } catch (error) {
        alert(`Terjadi kesalahan: ${error.message}`);
    }
}
