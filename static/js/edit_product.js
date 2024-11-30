// Import JSCroot dan SweetAlert dari CDN
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { addCSS } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";

addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

// Fungsi kembali ke halaman product
document.getElementById("Backproductbtn").addEventListener("click", function () {
    window.location.href = "Product.html";
});

// Fungsi untuk mengambil data produk berdasarkan ID
const fetchProduct = async (productId) => {
    try {
        Swal.fire({
            title: "Loading...",
            text: "Fetching product data...",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // Ambil token dari localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("Authorization token not found. Please log in again.");
        }

        // Debug: log token untuk memastikan terbaca
        console.log("Token:", token);

        const response = await fetch(`https://pos-ochre.vercel.app/api/products/${productId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Format Bearer <token>
            }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${await response.text()}`);
        }

        const product = await response.json();
        Swal.close();

        console.log(product);

        // Isi data di form
        document.getElementById("name").value = product.name;
        document.getElementById("price").value = product.price;
        document.getElementById("category").value = product.category_name;
        document.getElementById("description").value = product.description || "";
        document.getElementById("stock").value = product.stock;
    } catch (error) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.message || "Failed to fetch product data. Please try again."
        });
        console.error(error);
    }
};



// Fungsi untuk memperbarui data produk
// Fungsi untuk memperbarui data produk
document.getElementById("edit-product-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const productId = new URLSearchParams(window.location.search).get("id");
    const updatedProduct = {
        name: document.getElementById("name").value,
        price: parseFloat(document.getElementById("price").value),
        category_name: document.getElementById("category").value,
        description: document.getElementById("description").value,
        stock: parseInt(document.getElementById("stock").value, 10)
    };

    const result = await Swal.fire({
        icon: "warning",
        title: "Are you sure?",
        text: "Do you want to update this product?",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "No, cancel"
    });

    if (result.isConfirmed) {
        try {
            // Ambil token dari localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error("Authorization token not found. Please log in again.");
            }

            // Debug: log token untuk memastikan terbaca
            console.log("Token:", token);

            Swal.fire({
                title: "Updating...",
                text: "Please wait...",
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const response = await fetch(`https://pos-ochre.vercel.app/api/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Format Bearer <token>
                },
                body: JSON.stringify(updatedProduct)
            });

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Product updated successfully!"
                }).then(() => {
                    window.location.href = "Product.html";
                });
            } else {
                throw new Error(`Error ${response.status}: ${await response.text()}`);
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text: error.message || "Failed to update product. Please try again."
            });
            console.error(error);
        }
    }
});


// Muat data produk saat halaman diload
window.onload = function() {
    const productId = new URLSearchParams(window.location.search).get("id");
    if (productId) {
        fetchProduct(productId);
    } else {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "Product ID not found in URL."
        });
    }
};
