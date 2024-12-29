// Import JSCroot from the CDN
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { addCSS } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";

addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

// Function to format numbers as Rupiah
function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(number);
}

// Array to store product data retrieved from backend
let products = [];
let currentPage = 1;
const itemsPerPage = 8; // Number of products per page

// Function to fetch products from the backend
async function fetchProducts() {
  try {
    // Request data produk
    const response = await fetch("https://pos-ochre.vercel.app/api/products");
    if (!response.ok) throw new Error("Failed to fetch products.");

    // Simpan data produk yang diambil dari backend
    products = await response.json();
    console.log("Fetched Products:", products);

    // Render tabel produk dan setup pagination
    renderProductTable(products, currentPage);
    setupPagination(products);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Fungsi untuk menampilkan tabel produk
function renderProductTable(productsArray, page) {
  const productTable = document.getElementById("product-table");

  // Hapus semua baris produk yang sudah ada sebelumnya
  document.querySelectorAll(".row.product").forEach((row) => row.remove());

  // Tentukan indeks awal dan akhir untuk data pada halaman ini
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = page * itemsPerPage;
  const paginatedProducts = productsArray.slice(startIndex, endIndex);

  // Render setiap produk pada halaman ini
  paginatedProducts.forEach((product) => {
    const row = document.createElement("div");
    row.classList.add("row", "product");

    row.innerHTML = `
      <div class="cell" data-title="Picture">
        <img src="${product.picture_url || 'static/img/no-image.png'}" style="width: 50px; height: auto;">
      </div>
      <div class="cell" data-title="Name Product">${product.name}</div>
      <div class="cell" data-title="Unit Price">${formatRupiah(product.price)}</div>
      <div class="cell" data-title="Category">${product.category_name}</div>
      <div class="cell" data-title="Description">${product.description}</div>
      <div class="cell" data-title="Stock">${product.stock}</div>
      <div class="cell">
        <button type="button" class="btn btn-edit" data-id="${product.id_products}">
          <i class="fas fa-pencil-alt"></i>
        </button>
        <button type="button" class="btn btn-delete" data-id="${product.id_products}">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    `;

    productTable.appendChild(row);
  });
}

// Fungsi untuk redirect ke halaman edit produk dan menyimpan data ke localStorage
function editProduct(productId) {
  // Cari data produk berdasarkan ID
  const selectedProduct = products.find((product) => product.id_products === productId);
  if (selectedProduct) {
    // Simpan data produk ke localStorage
    localStorage.setItem("selectedProduct", JSON.stringify(selectedProduct));
    console.log("Saved to LocalStorage:", selectedProduct);

    // Redirect ke halaman edit produk
    window.location.href = `Editproduct.html?id=${productId}`;
  } else {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Product data not found!",
    });
  }
}

// Tambahkan event listener untuk tombol edit dan delete
document.getElementById("product-table").addEventListener("click", function (event) {
  const target = event.target;
  const button = target.closest("button");
  const productId = button?.getAttribute("data-id");

  if (button && button.classList.contains("btn-edit")) {
    editProduct(productId);
  } else if (button && button.classList.contains("btn-delete")) {
    deleteProduct(productId);
  }
});

// Fungsi untuk memulai saat halaman dimuat
window.onload = fetchProducts;

// Fungsi untuk setup pagination
function setupPagination(productsArray) {
  const paginationElement = document.getElementById("pagination");
  paginationElement.innerHTML = ""; // Clear existing pagination links

  const totalPages = Math.ceil(productsArray.length / itemsPerPage); // Calculate total pages

  // Create "Previous" button
  const prevButton = document.createElement("a");
  prevButton.href = "#";
  prevButton.innerHTML = "&laquo;";
  prevButton.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderProductTable(products, currentPage);
      updatePaginationLinks();
    }
  });
  paginationElement.appendChild(prevButton);

  // Create page number links
  for (let i = 1; i <= totalPages; i++) {
    const pageLink = document.createElement("a");
    pageLink.href = "#";
    pageLink.innerText = i;
    if (i === currentPage) {
      pageLink.classList.add("active");
    }
    pageLink.addEventListener("click", (event) => {
      currentPage = i;
      renderProductTable(products, currentPage);
      updatePaginationLinks();
    });
    paginationElement.appendChild(pageLink);
  }

  // Create "Next" button
  const nextButton = document.createElement("a");
  nextButton.href = "#";
  nextButton.innerHTML = "&raquo;";
  nextButton.addEventListener("click", () => {
    if (currentPage < totalPages) {
      currentPage++;
      renderProductTable(products, currentPage);
      updatePaginationLinks();
    }
  });
  paginationElement.appendChild(nextButton);
}

// Fungsi untuk update pagination link aktif
function updatePaginationLinks() {
  const paginationLinks = document.querySelectorAll("#pagination a");
  paginationLinks.forEach((link) => link.classList.remove("active"));

  // Highlight current page
  paginationLinks[currentPage].classList.add("active");
}

// Fungsi untuk menghapus produk
async function deleteProduct(productId) {
  if (!productId) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Invalid product ID.",
    });
    return;
  }

  const result = await Swal.fire({
    icon: "question",
    title: "Are you sure you want to delete this product?",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel",
  });

  if (result.isConfirmed) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authorization token not found. Please log in again.");
      }

      const response = await fetch(`https://pos-ochre.vercel.app/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Product has been deleted.",
        });
        fetchProducts(); // Reload product list after deletion
      } else {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete product.");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error.message,
      });
      console.error(error);
    }
  }
}

// Fungsi pencarian
function searchProducts() {
  const searchQuery = document.getElementById("search-bar").value.toLowerCase();
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery) ||
      product.category_name.toLowerCase().includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery)
  );
  renderProductTable(filteredProducts, currentPage);
  setupPagination(filteredProducts);
}

// Fungsi pengurutan
function sortProducts() {
  const sortOption = document.getElementById("sort-options").value;
  let sortedProducts = [...products];

  if (sortOption === "name") {
    sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOption === "price") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === "category_name") {
    sortedProducts.sort((a, b) => a.category_name.localeCompare(b.category_name));
  } else if (sortOption === "stock") {
    sortedProducts.sort((a, b) => a.stock - b.stock);
  }

  renderProductTable(sortedProducts, currentPage);
  setupPagination(sortedProducts);
}

document.getElementById("addProductBtn").addEventListener("click", () => {
  window.location.href = "AddProduct.html";
});

// Tambahkan event listener untuk pencarian dan pengurutan
document.getElementById("search-bar").addEventListener("input", searchProducts);
document.getElementById("sort-options").addEventListener("change", sortProducts);
