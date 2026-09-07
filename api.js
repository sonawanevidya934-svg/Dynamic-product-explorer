const API_URL = "https://fakestoreapi.com";

// Fetch all products
export async function fetchProducts() {
    const response = await fetch(`${API_URL}/products`);

    if (!response.ok) {
        throw new Error("Failed to fetch products");
    }

    const products = await response.json();
    return products;
}

// Fetch all categories
export async function fetchCategories() {
    const response = await fetch(`${API_URL}/products/categories`);

    if (!response.ok) {
        throw new Error("Failed to fetch categories");
    }

    const categories = await response.json();
    return categories;
}