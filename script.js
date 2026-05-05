// --- 1. Global State ---
// let cart = [];
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

    // Calculate if we are at the very start or very end
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage === totalPages;

    let html = '';

    // 1. Previous Arrow - Added 'disabled' check
    html += `
    <button class="btn btn-outline" 
            onclick="changePage(${currentPage - 1}, event)" 
            ${isFirstPage ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
    </button>`;

    // ... (Keep your existing Logical Number Rendering code here) ...
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

    // 2. Next Arrow - Added 'disabled' check
    html += `
    <button class="btn btn-next" 
            onclick="changePage(${currentPage + 1}, event)" 
            ${isLastPage ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
    </button>`;

    container.innerHTML = html;
}

function renderBtn(num) {
    return `<button class="btn ${num === currentPage ? 'active' : ''}" onclick="changePage(${num})">${num}</button>`;
}

function changePage(newPage, event) {
    // Stop the page from reloading or jumping to the top automatically
    if (event) {
        event.preventDefault();
    }

    currentPage = newPage;
    updateDisplay();
    
    // If you want it to scroll smoothly to the cards (not a refresh)
    document.getElementById('cards-container').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// Update this helper to pass the 'event'
function renderBtn(num) {
    return `<button class="btn ${num === currentPage ? 'active' : ''}" 
            onclick="changePage(${num}, event)">${num}</button>`;
}


// --- 4. Cart Logic ---
let cart = [];

// 1. Toggle Sidebar & Overlay
function toggleCart() {
    const sidebar = document.getElementById("cartSidebar");
    const overlay = document.getElementById("cartOverlay");
    
    if (sidebar) sidebar.classList.toggle("active");
    if (overlay) overlay.classList.toggle("active");
}

// 2. Add Item & Auto-Open Sidebar
function addToCart(name, price) {
    const existing = cart.find(item => item.name === name);
    if (existing) {
        existing.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    
    updateCart();
    
    // Smoothly auto-open the cart when an item is added
    const sidebar = document.getElementById("cartSidebar");
    const overlay = document.getElementById("cartOverlay");
    if (sidebar) sidebar.classList.add("active");
    if (overlay) overlay.classList.add("active");
}

// 3. Change Quantity (Removes item if quantity hits 0)
function changeQty(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCart();
}

// 4. Update UI (HTML Injection)
function updateCart() {
    const container = document.getElementById("cartItems");
    let total = 0;
    let count = 0;

    container.innerHTML = "";

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        count += item.quantity;

        container.innerHTML += `
            <div class="cart-card">
                <div class="item-img-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:24px; color:#cbd5e0;">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                    </svg>
                </div>
                <div class="item-details">
                    <div class="item-title-row">
                        <span class="item-name">${item.name}</span>
                    </div>
                    <div class="price-qty-row">
                        <span class="item-price">${item.price.toLocaleString()} Rwf</span>
                        <div class="qty-wrapper">
                            <button onclick="changeQty(${index}, -1)">−</button>
                            <span style="font-weight:600; font-size:14px;">${item.quantity}</span>
                            <button onclick="changeQty(${index}, 1)">+</button>
                        </div>
                    </div>
                </div>
            </div>`;
    });

    // Update Totals and Count
    document.getElementById("cartCount").innerText = count;
    document.getElementById("subtotal").innerText = total.toLocaleString() + " Rwf";
    document.getElementById("total").innerText = total.toLocaleString() + " Rwf";
    document.getElementById("checkoutBtn").innerText = `Proceed to Checkout (${count} items)`;
}

// 5. Checkout Logic
function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const finalTotal = document.getElementById("total").innerText;
    alert(`Proceeding to checkout.\nTotal Order: ${finalTotal}`);
    
    // Clear cart after checkout
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
