// Import JSCroot from the CDN
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import {addCSS} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.9/element.js";

addCSS("https://cdn.jsdelivr.net/npm/sweetalert2@11/dist/sweetalert2.css");

document.getElementById("Backproductbtn").addEventListener("click", function () {
    window.location.href = "Product.html";
});

async function fetchProductById(productId) {
    try {
        Swal.fire({ title: "Loading product data...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });

        const response = await fetch(`https://asia-southeast2-awangga.cloudfunctions.net/itungin/product-id?id=${productId}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        const product = await response.json();
        Swal.close();

        document.getElementById('product-name').value = product.data.name;
        document.getElementById('product-price').value = product.data.price;
        document.getElementById('product-category').value = product.data.category;
        document.getElementById('product-description').value = product.data.description;
        document.getElementById('product-stock').value = product.data.stock;

    } catch (error) {
        console.error('Error fetching product:', error);
        Swal.fire({ icon: "error", title: "Failed to load product data", text: error.message });
    }
}

document.getElementById("edit-product-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const productId = new URLSearchParams(window.location.search).get("id");

    const updatedProduct = {
        name: document.getElementById("product-name").value,
        price: parseFloat(document.getElementById("product-price").value),
        category: document.getElementById("product-category").value,
        description: document.getElementById("product-description").value,
        stock: parseInt(document.getElementById("product-stock").value, 10)
    };

    const result = await Swal.fire({
        icon: "warning",
        title: "Confirm Product Update",
        showCancelButton: true,
        confirmButtonText: "Yes, update it!",
        cancelButtonText: "No, keep editing"
    });

    if (result.isConfirmed) {
        try {
            Swal.fire({ title: "Updating product...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });

            const response = await fetch(`https://asia-southeast2-awangga.cloudfunctions.net/itungin/products?id=${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedProduct)
            });

            if (response.ok) {
                Swal.fire({
                    icon: "success",
                    title: "Product Updated",
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
                text: "An error occurred while updating the product. Please try again."
            });
        }
    }
});

// Initial loading function
window.onload = function() {
    const productId = new URLSearchParams(window.location.search).get("id");
    if (productId) {
        fetchProductById(productId);
    } else {
        Swal.fire({ icon: "error", title: "Product ID Missing", text: "Product ID not found in URL" });
    }
};
