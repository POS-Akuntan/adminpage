// Import JSCroot from the CDN
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import { addCSS } from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";

addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

document.getElementById("Backproductbtn").addEventListener("click", function () {
    window.location.href = "Product.html";
});

async function fetchProductById(productId) {
    try {
        console.log(`Fetching product with ID: ${productId}`);

        // URL menggunakan ID sebagai bagian dari path
        const response = await fetch(`https://pos-ochre.vercel.app/api/products-id/${productId}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const product = await response.json();
        console.log("Product data fetched:", product);
        
        // Populate the form fields with the product data
        document.getElementById('product-name').value = product.data.name;
        document.getElementById('product-price').value = product.data.price;
        document.getElementById('product-category').value = product.data.category;
        document.getElementById('product-description').value = product.data.description;
        document.getElementById('product-stock').value = product.data.stock;

    } catch (error) {
        console.error('Error fetching product:', error);
    }
}

document.getElementById("edit-product-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const productId = new URLSearchParams(window.location.search).get("id");
    console.log("Updating product with ID:", productId);

    const updatedProduct = {
        name: document.getElementById("product-name").value,
        price: parseFloat(document.getElementById("product-price").value),
        category: document.getElementById("product-category").value,
        description: document.getElementById("product-description").value,
        stock: parseInt(document.getElementById("product-stock").value, 10)
    };

    // Show confirmation dialog before updating
    const result = await Swal.fire({
        icon: "warning",
        title: "Are you sure you want to update this product?",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "No, keep editing"
    });

    if (result.isConfirmed) {
        try {
            // URL menggunakan ID sebagai bagian dari path
            const response = await fetch(`https://pos-ochre.vercel.app/api/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct)
            });

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Updated",
                    text: "Product updated successfully!"
                }).then(() => {
                    window.location.href = "Product.html";
                });
            } else {
                const errorText = await response.text();
                Swal.fire({
                    icon: "error",
                    title: "Update Failed",
                    text: `Failed to update product: ${errorText}`
                });
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "An error occurred. Please try again."
            });
        }
    }
});

// Initial loading function
window.onload = function() {
    const productId = new URLSearchParams(window.location.search).get("id");
    console.log("Product ID from URL:", productId);
    if (productId) {
        fetchProductById(productId);
    } else {
        console.error('Product ID not found in URL');
    }
};
