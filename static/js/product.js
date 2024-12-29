// Import JSCroot from the CDN
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import {addCSS} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";

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
  // Function to fetch products from the backend
  async function fetchProducts() {
    try {
      const response = await fetch(
        "https://pos-ochre.vercel.app/api/products"
      ); // Updated URL
      products = await response.json(); // Parse the response as JSON
  
      // Render the product table with initial page
      renderProductTable(products, currentPage);
      setupPagination(products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }
  
  // Function to render product table
  function renderProductTable(productsArray, page) {
    const productTable = document.getElementById("product-table");
  
    // Clear existing rows
    document.querySelectorAll(".row.product").forEach((row) => row.remove());
  
    // Calculate start and end index for the current page
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    const paginatedProducts = productsArray.slice(startIndex, endIndex);
  
    // Loop through the paginated products and create new rows
    paginatedProducts.forEach((product) => {
      const row = document.createElement("div");
      row.classList.add("row", "product");
  
      row.innerHTML = `
              <div class="cell" data-title="Product">${product.name}</div>
              <div class="cell" data-title="Unit Price">${formatRupiah(
                product.price
              )}</div>
              <div class="cell" data-title="Category">${product.category_name}</div>
              <div class="cell" data-title="Description">${
                product.description
              }</div>
              <div class="cell" data-title="Stock">${product.stock}</div>
              <div class="cell">
                  <button type="button" class="btn btn-edit" data-id="${
                    product.id
                  }">
                      <i class="fas fa-pencil-alt"></i> <!-- Edit icon -->
                  </button>
                  <button type="button" class="btn btn-delete" data-id="${
                    product.id
                  }">
                      <i class="fas fa-trash-alt"></i> <!-- Delete icon -->
                  </button>
              </div>
          `;
  
      productTable.appendChild(row);
    });
  }
  
  // Event delegation for edit and delete buttons
  document
    .getElementById("product-table")
    .addEventListener("click", function (event) {
      const target = event.target;
      const productId = target.closest("button")?.getAttribute("data-id"); // Get product ID from closest button
  
      if (target.closest(".btn-edit")) {
        editProduct(productId); // Call edit function if edit button is clicked
      } else if (target.closest(".btn-delete")) {
        deleteProduct(productId); // Call delete function if delete button is clicked
      }
    });
  
  // Function to setup pagination
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
  
  // Function to update the active page link in the pagination
  function updatePaginationLinks() {
    const paginationLinks = document.querySelectorAll("#pagination a");
    paginationLinks.forEach((link) => link.classList.remove("active"));
  
    // Highlight the current page link
    paginationLinks[currentPage].classList.add("active");
  }
  
  // Function to edit a product
  function editProduct(productId) {
    // Redirect to edit page, passing the product ID as a query parameter
    window.location.href = `Editproduct.html?id=${productId}`;
  }
  
  // Function to delete a product
// Function to delete a product
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
    title: "Are you sure you want to delete this data?",
    text: "DELETE",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "No, cancel",
  });

  if (result.isConfirmed) {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        Swal.fire({
          icon: "error",
          title: "Unauthorized",
          text: "Token not found. Please log in again.",
        });
        return;
      }

      const response = await fetch(
        `https://pos-ochre.vercel.app/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Product has been deleted.",
        });
        fetchProducts(); // Reload daftar produk setelah penghapusan
      } else {
        const errorText = await response.text();
        console.error("Failed to delete product:", errorText);
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: errorText || "Failed to delete the product.",
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while deleting the product.",
      });
    }
  }
}

  
  
  
  // Search Functionality
  function searchProducts() {
    const searchQuery = document.getElementById("search-bar").value.toLowerCase();
    const filteredProducts = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchQuery) ||
        product.category_name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery)
    );
    renderProductTable(filteredProducts, currentPage);
    setupPagination(filteredProducts); // Update pagination based on filtered products
  }
  
  // Sort Functionality
  function sortProducts() {
    const sortOption = document.getElementById("sort-options").value;
    let sortedProducts = [...products];
  
    if (sortOption === "name") {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "price") {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === "category_name") {
      sortedProducts.sort((a, b) => a.category.localeCompare(b.category));
    } else if (sortOption === "stock") {
      sortedProducts.sort((a, b) => a.stock - b.stock);
    }
  
    renderProductTable(sortedProducts, currentPage);
    setupPagination(sortedProducts); // Update pagination based on sorted products
  }
  
  // Add event listeners for search and sort
  document.getElementById("search-bar").addEventListener("input", searchProducts);
  document
    .getElementById("sort-options")
    .addEventListener("change", sortProducts);
  
  // Call the function to fetch and display products when the page loads
  window.onload = fetchProducts;
  
  // Event listeners for adding new product and exporting to CSV
  // document.getElementById("exportCsvBtn").addEventListener("click", function () {
  //   window.location.href =
  //     "https://pos-ochre.vercel.app/api/products-export-csv"; // Updated URL
  
  
  document.getElementById("addProductBtn").addEventListener("click", function () {
    window.location.href = "AddProduct.html";
  });
  