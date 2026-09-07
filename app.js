import {
    fetchProducts,
    fetchCategories
} from "./api.js";

// DOM ELEMENTS
const productContainer =
    document.getElementById("productContainer");

const searchInput =
    document.getElementById("searchInput");

const sortSelect =
    document.getElementById("sortSelect");

const categoryButtons =
    document.getElementById("categoryButtons");

const loading =
    document.getElementById("loading");

const error =
    document.getElementById("error");

// APPLICATION DATA
let products = [];
let selectedCategory = "all";

// Show loading
function showLoading() {
    loading.classList.remove("hidden");
    error.classList.add("hidden");
}

// Hide loading
function hideLoading() {
    loading.classList.add("hidden");
}

// Show error
function showError(message) {
    error.textContent = message;
    error.classList.remove("hidden");
}

// Render products
function renderProducts() {
    const searchText = searchInput.value.toLowerCase();

    let filteredProducts = products.filter(product => {

        const matchesSearch =
            product.title.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    // Sorting
    const sortValue = sortSelect.value;

    if (sortValue === "price-low") {
        filteredProducts.sort((a, b) => a.price - b.price);
    }

    if (sortValue === "price-high") {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    if (sortValue === "name") {
        filteredProducts.sort((a, b) =>
            a.title.localeCompare(b.title)
        );
    }

    productContainer.innerHTML = "";

    if (filteredProducts.length === 0) {
        productContainer.innerHTML =
            "<p>No products found.</p>";
        return;
    }

    filteredProducts.forEach(product => {

        const card = document.createElement("article");

        card.className = "product-card";

        card.innerHTML = `
            <img
                src="${product.image}"
                alt="${product.title}"
            >

            <h3>${product.title}</h3>

            <p class="category">
                ${product.category}
            </p>

            <p class="price">
                $${product.price.toFixed(2)}
            </p>
        `;

        productContainer.appendChild(card);
    });
}

// Render category buttons
function renderCategories(categories) {

    categoryButtons.innerHTML = "";

    const allButton = document.createElement("button");

    allButton.textContent = "All";

    allButton.addEventListener("click", () => {
        selectedCategory = "all";
        renderProducts();
    });

    categoryButtons.appendChild(allButton);

    categories.forEach(category => {

        const button = document.createElement("button");

        button.textContent = category;

        button.addEventListener("click", () => {
            selectedCategory = category;
            renderProducts();
        });

        categoryButtons.appendChild(button);
    });
}

// Load data
async function loadData() {

    showLoading();

    try {

        const cachedProducts =
            localStorage.getItem("products");

        const cachedCategories =
            localStorage.getItem("categories");

        if (cachedProducts && cachedCategories) {

            products = JSON.parse(cachedProducts);

            const categories =
                JSON.parse(cachedCategories);

            renderCategories(categories);
            renderProducts();

        } else {

            const [productData, categoryData] =
                await Promise.all([
                    fetchProducts(),
                    fetchCategories()
                ]);

            products = productData;

            localStorage.setItem(
                "products",
                JSON.stringify(productData)
            );

            localStorage.setItem(
                "categories",
                JSON.stringify(categoryData)
            );

            renderCategories(categoryData);
            renderProducts();
        }

    } catch (err) {

        console.error(err);

        showError(
            "Unable to load products. Please try again."
        );

    } finally {

        hideLoading();
    }
}

// Search
searchInput.addEventListener("input", renderProducts);

// Sorting
sortSelect.addEventListener("change", renderProducts);

// Start application
loadData();