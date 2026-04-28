// --- 1. Global State ---
let cart = [];
let currentPage = 1;
const totalPages = 15;
const cardsPerPage = 6;
let currentCategory = "all"; // Track category for pagination compatibility

// --- 2. Filter Logic ---
function filterDishes(category) {
    currentCategory = category;
    currentPage = 1; // Reset to page 1 when filtering
    
    // Update active button UI
    const buttons = document.querySelectorAll(".filter-btn");
    buttons.forEach(btn => btn.classList.remove("active"));
    if (event) event.target.classList.add("active");

    updateDisplay(); // Refresh view
}

// --- 3. Integrated Pagination & Display Logic ---
function updateDisplay() {
    const allCards = Array.from(document.querySelectorAll(".card"));
    
    // First, filter by category
    const filteredCards = allCards.filter(card => {
        return currentCategory === "all" || card.dataset.category === currentCategory;
    });

    // Second, handle visibility based on page
    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;

    allCards.forEach(card => card.classList.add("hidden")); // Hide all first
    
    filteredCards.forEach((card, index) => {
        if (index >= start && index < end) {
            card.classList.remove("hidden");
        }
    });

    renderPagination();
}

function renderPagination() {
    const container = document.getElementById('pagination-container');
    if (!container) return;

    let html = '';
    // Previous Arrow
    html += `<button class="btn btn-outline" onclick="changePage(${Math.max(1, currentPage - 1)})">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
    </button>`;

    // Logic for numbers and dots
    if (totalPages <= 5) {
        for (let i = 1; i <= totalPages; i++) html += renderBtn(i);
    } else {
        html += renderBtn(1);
        if (currentPage > 3) html += '<span class="dots">...</span>';
        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) html += renderBtn(i);
        if (currentPage < totalPages - 2) html += '<span class="dots">...</span>';
        html += renderBtn(totalPages);
    }

    // Next Arrow
    html += `<button class="btn btn-next" onclick="changePage(${Math.min(totalPages, currentPage + 1)})">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
    </button>`;

    container.innerHTML = html;
}

function renderBtn(num) {
    return `<button class="btn ${num === currentPage ? 'active' : ''}" onclick="changePage(${num})">${num}</button>`;
}

function changePage(newPage) {
    currentPage = newPage;
    updateDisplay();
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Optional: scroll to top on page change
}

// --- 4. Cart Logic ---
function addToCart(name, price) {
    cart.push({ name, price });
    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateCart() {
    let items = document.getElementById("cartItems");
    let total = document.getElementById("total");
    let count = document.getElementById("cartCount");
    let sum = 0;

    items.innerHTML = "";
    cart.forEach((item, index) => {
        sum += item.price;
        items.innerHTML += `
            <div class="cart-item">
                <span class="cart-item-name">${item.name}</span>
                <span class="cart-item-price">${item.price} Rwf</span>
                <button class="cart-item-remove" onclick="removeFromCart(${index})">×</button>
            </div>`;
    });

    total.innerText = sum;
    count.innerText = cart.length;
}

function toggleCart() {
    document.getElementById("cart").classList.toggle("active");
}

function checkout() {
    if (cart.length === 0) return alert("Your cart is empty!");
    alert(`Proceeding to checkout. Total: ${document.getElementById("total").innerText} Rwf`);
    cart = [];
    updateCart();
    toggleCart();
}

// --- 5. Filter Scroll Logic ---
function scrollFilters(direction) {
    const container = document.getElementById("filterButtonsContainer");
    const scrollAmount = 200;
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    setTimeout(updateScrollButtons, 100);
}

function updateScrollButtons() {
    const container = document.getElementById("filterButtonsContainer");
    const leftBtn = document.getElementById("scrollLeft");
    const rightBtn = document.getElementById("scrollRight");
    if (!container || !leftBtn || !rightBtn) return;

    leftBtn.classList.toggle("hidden", container.scrollLeft <= 0);
    rightBtn.classList.toggle("hidden", container.scrollLeft >= container.scrollWidth - container.clientWidth - 10);
}

// --- 6. Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    updateDisplay(); // Initial load of cards and pagination
    updateScrollButtons();
    const filterContainer = document.getElementById("filterButtonsContainer");
    if (filterContainer) filterContainer.addEventListener('scroll', updateScrollButtons);
});
