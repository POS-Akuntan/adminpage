// Import JSCroot and SweetAlert2
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { addCSS, createEl, on } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";
import { setCSS } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/style.js";

addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

// Function to format numbers as Rupiah
function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(number);
}

let products = [];
let currentPage = 1;
const itemsPerPage = 5;

async function fetchProducts() {
    try {
        const response = await fetch("https://asia-southeast2-awangga.cloudfunctions.net/itungin/products");
        products = await response.json();
        renderProductTable(products, currentPage);
        setupPagination(products);
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

// Render product table using JSCroot's createEl
function renderProductTable(productsArray, page) {
    const productTable = document.getElementById("product-table");
    document.querySelectorAll(".row.product").forEach((row) => row.remove());

    const startIndex = (page - 1) * itemsPerPage;
    const paginatedProducts = productsArray.slice(startIndex, startIndex + itemsPerPage);

    paginatedProducts.forEach(product => {
        const row = createEl("div", { class: "row product" }, `
            <div class="cell" data-title="Product">${product.name}</div>
            <div class="cell" data-title="Unit Price">${formatRupiah(product.price)}</div>
            <div class="cell" data-title="Category">${product.category}</div>
            <div class="cell" data-title="Description">${product.description}</div>
            <div class="cell" data-title="Stock">${product.stock}</div>
            <div class="cell">
                <button type="button" class="btn btn-edit" data-id="${product.id}">
                    <i class="fas fa-pencil-alt"></i>
                </button>
                <button type="button" class="btn btn-delete" data-id="${product.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `);
        productTable.appendChild(row);
    });
}

// Setup event delegation for edit and delete buttons using JSCroot's on
on(document.getElementById("product-table"), "click", (event) => {
    const target = event.target.closest("button");
    const productId = target?.getAttribute("data-id");

    if (target?.classList.contains("btn-edit")) {
        editProduct(productId);
    } else if (target?.classList.contains("btn-delete")) {
        deleteProduct(productId);
    }
});

// Function to set up pagination
function setupPagination(productsArray) {
    const paginationElement = document.getElementById("pagination");
    paginationElement.innerHTML = "";
    const totalPages = Math.ceil(productsArray.length / itemsPerPage);

    const prevButton = createEl("a", { href: "#" }, "&laquo;");
    prevButton.onclick = () => { if (currentPage > 1) changePage(currentPage - 1); };
    paginationElement.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageLink = createEl("a", { href: "#", textContent: i });
        pageLink.onclick = () => changePage(i);
        if (i === currentPage) pageLink.classList.add("active");
        paginationElement.appendChild(pageLink);
    }

    const nextButton = createEl("a", { href: "#" }, "&raquo;");
    nextButton.onclick = () => { if (currentPage < totalPages) changePage(currentPage + 1); };
    paginationElement.appendChild(nextButton);
}

// Helper to change pages
function changePage(page) {
    currentPage = page;
    renderProductTable(products, currentPage);
    updatePaginationLinks();
}

function updatePaginationLinks() {
    document.querySelectorAll("#pagination a").forEach((link, index) => {
        link.classList.toggle("active", index === currentPage);
    });
}

function editProduct(productId) {
    window.location.href = `Editproduct.html?id=${productId}`;
}

// SweetAlert2 for delete confirmation with JSCroot integration
async function deleteProduct(productId) {
    const result = await Swal.fire({
        icon: "warning",
        title: "Are you sure you want to delete this data?",
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel',
    });

    if (result.isConfirmed) {
        try {
            const response = await fetch(
                `https://asia-southeast2-awangga.cloudfunctions.net/itungin/products?id=${productId}`,
                { method: "DELETE" }
            );
            if (response.ok) {
                Swal.fire({ icon: "success", title: "Deleted successfully!" });
                fetchProducts();
            } else {
                Swal.fire({ icon: "error", title: "Failed to delete." });
            }
        } catch (error) {
            Swal.fire({ icon: "error", title: "Error deleting product." });
        }
    }
}

// Search and Sort event listeners
on(document.getElementById("search-bar"), "input", searchProducts);
on(document.getElementById("sort-options"), "change", sortProducts);

function searchProducts() {
    const query = document.getElementById("search-bar").value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.category.toLowerCase().includes(query) || 
        product.description.toLowerCase().includes(query)
    );
    renderProductTable(filteredProducts, currentPage);
    setupPagination(filteredProducts);
}

function sortProducts() {
    const sortOption = document.getElementById("sort-options").value;
    const sortedProducts = [...products].sort((a, b) => {
        if (sortOption === "name") return a.name.localeCompare(b.name);
        if (sortOption === "price") return a.price - b.price;
        if (sortOption === "category") return a.category.localeCompare(b.category);
        if (sortOption === "stock") return a.stock - b.stock;
    });
    renderProductTable(sortedProducts, currentPage);
    setupPagination(sortedProducts);
}

// Event listeners for navigation buttons
on(document.getElementById("exportCsvBtn"), "click", () => {
    window.location.href = "https://asia-southeast2-awangga.cloudfunctions.net/itungin/products-export-csv";
});
on(document.getElementById("addProductBtn"), "click", () => {
    window.location.href = "AddProduct.html";
});

// Initialize fetch on load
window.onload = fetchProducts;
