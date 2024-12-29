// Replace with your actual API endpoint
const endpoint = 'https://pos-ochre.vercel.app/api/report';

async function fetchSalesData() {
    try {
        // Fetch data from the endpoint
        const response = await fetch(endpoint);
        const data = await response.json();

        // Check if the response is successful
        if (data.success) {
            const categories = [];
            const totalSales = [];
            const totalQuantitySold = [];
            const tableData = [];

            // Aggregate sales and quantity by category and prepare table data
            data.data.forEach(item => {
                if (!categories.includes(item.category)) {
                    categories.push(item.category);
                    totalSales.push(parseInt(item.total_sales)); // Convert total_sales to integer
                    totalQuantitySold.push(parseInt(item.total_quantity_sold)); // Convert total_quantity_sold to integer
                } else {
                    const index = categories.indexOf(item.category);
                    totalSales[index] += parseInt(item.total_sales); // Sum sales for the same category
                    totalQuantitySold[index] += parseInt(item.total_quantity_sold); // Sum quantity for the same category
                }

                // Prepare table data
                tableData.push({
                    category: item.category,
                    product: item.product,
                    totalQuantitySold: item.total_quantity_sold,
                    totalSales: item.total_sales
                });
            });

            // Create both bar charts after data is processed
            createSalesChart(categories, totalSales);
            createQuantityChart(categories, totalQuantitySold);

            // Populate the table with the data
            populateSalesTable(tableData);
        } else {
            console.error('Error: Unable to retrieve sales data');
        }
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

function createSalesChart(categories, totalSales) {
    const ctx = document.getElementById('salesChart').getContext('2d');
    const salesChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Total Sales by Category',
                data: totalSales,
                backgroundColor: '#007bff',
                borderColor: '#0056b3',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) { return 'Rp ' + value.toLocaleString(); }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function createQuantityChart(categories, totalQuantitySold) {
    const ctx = document.getElementById('quantityChart').getContext('2d');
    const quantityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Total Quantity Sold by Category',
                data: totalQuantitySold,
                backgroundColor: '#28a745',
                borderColor: '#218838',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) { return value.toLocaleString(); }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Populate the sales data table
function populateSalesTable(tableData) {
    const tableBody = document.getElementById('salesTableBody');
    tableData.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.category}</td>
            <td>${item.product}</td>
            <td>${item.totalQuantitySold.toLocaleString()}</td>
            <td>Rp ${parseInt(item.totalSales).toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Call the function to fetch and visualize the data
fetchSalesData();
