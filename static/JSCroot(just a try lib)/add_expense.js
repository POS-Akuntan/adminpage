// Function to handle the form submission for adding expenses
async function submitExpense(event) {
    event.preventDefault(); // Prevent default form submission

    // Prepare expense data from form inputs
    const expenseData = {
        expense_name: document.getElementById('expense_name').value.trim(),
        amount: parseFloat(document.getElementById('amount').value) || 0,
        category: document.getElementById('category').value.trim(),
        expense_date: new Date(document.getElementById('expense_date').value).toISOString(),
        payment_method: document.getElementById('payment_method') ? document.getElementById('payment_method').value : "",
        notes: document.getElementById('notes') ? document.getElementById('notes').value : ""
    };

    // Basic validation for required fields
    if (!expenseData.expense_name || !expenseData.amount || !expenseData.category || !expenseData.expense_date) {
        alert('Please complete all required fields.');
        return;
    }

    try {
        const response = await fetch('https://asia-southeast2-awangga.cloudfunctions.net/itungin/expense', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(expenseData),
        });

        if (response.ok) {
            alert('Expense added successfully!');
            window.location.href = 'Business.html'; // Redirect to the main page
        } else {
            const errorData = await response.json();
            alert(`Failed to add expense: ${errorData.message}`);
        }
    } catch (error) {
        alert(`An error occurred: ${error.message}`);
        console.error('Error details:', error); // Log error details for debugging
    }
}

// Add event listener to submit button
document.getElementById('submit-expense-btn').addEventListener('click', submitExpense);
