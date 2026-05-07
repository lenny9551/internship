// --- OfficeEats Pro JavaScript ---
// This file manages the interactive behavior for the app:
// - card filtering by category
// - automatic dish naming based on data-category
// - pagination of the dish grid
// - shopping cart and checkout behavior
// - filter button scrolling support

// --- 1. Global State ---
// keep track of current page, pagination settings, and active filter
// let cart = [];
let currentPage = 1;
let totalPages = 1;
const cardsPerPage = 10;
let currentCategory = "all"; // Track category for pagination compatibility

// --- 2. Filter Logic ---
// Handles category button clicks and updates the UI state.
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
    // Make sure every card has the correct name before we show/hide cards.
    nameDishesByCategory();
    const allCards = Array.from(document.querySelectorAll(".card"));
    
    // First, filter by category
    const filteredCards = allCards.filter(card => {
        return currentCategory === "all" || card.dataset.category === currentCategory;
    });

    // Second, handle visibility based on page
    totalPages = Math.max(1, Math.ceil(filteredCards.length / cardsPerPage));
    if (currentPage > totalPages) currentPage = totalPages;

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

function nameDishesByCategory() {
    // This function reads each card's data-category and writes a unique
    // dish name into the card title. It makes new local dish cards work
    // automatically without manual heading changes.
    const categoryNames = {
        coffee: ['Cappuccino', 'Arabic Coffee', 'Local Coffee', 'Espresso', 'Flat White', 'Americano', 'Latte', 'Mocha', 'Macchiato', 'Iced Coffee', 'Caramel Latte', 'Irish Coffee', 'Cortado', 'French Press', 'Vienna Coffee'],
        burger: ['Classic Burger', 'Cheese Burger', 'Bacon Burger', 'Spicy Burger', 'Double Burger', 'Mushroom Burger', 'Chicken Burger', 'Veggie Burger', 'BBQ Burger', 'Swiss Burger', 'Deluxe Burger', 'Smoky Burger', 'Chili Burger', 'Mediterranean Burger', 'Signature Burger'],
        meat: ['Red Meat', 'Beef Steak', 'Grilled Meat', 'Lamb Chops', 'Pork Ribs', 'Barbecue Meat', 'Mixed Meat', 'Spicy Beef', 'Beef Tenderloin'],
        vegetarian: ['Veggie Salad', 'Green Delight', 'Garden Bowl', 'Vegan Wrap', 'Bean Salad', 'Tofu Bowl', 'Herb Salad', 'Veggie Platter', 'Spinach Wrap'],
        appetizer: ['Spring Rolls', 'Bruschetta', 'Garlic Bread', 'Chicken Wings', 'Stuffed Mushrooms', 'Onion Rings', 'Fried Calamari', 'Cheese Sticks', 'Nachos', 'Spicy Bites'],
        seafood: ['Shrimp Platter', 'Grilled Fish', 'Fried Fish', 'Crab Salad', 'Seafood Pasta', 'Fish Tacos', 'Lobster Roll', 'Calamari', 'Seafood Curry', 'Ocean Delight'],
        drink: ['Coca Cola', 'Fruit Juice', 'Mango Drink', 'Sparkling Water', 'Lemonade', 'Iced Tea', 'Smoothie', 'Milkshake', 'Ginger Beer', 'Mineral Water']
    };

    const categoryCount = {};
    document.querySelectorAll('.card[data-category]').forEach(card => {
        const category = card.dataset.category || 'item';
        const title = card.querySelector('.card-content h4');
        if (!title) return;

        const index = categoryCount[category] || 0;
        const names = categoryNames[category] || [];
        title.textContent = names[index] || `${category.charAt(0).toUpperCase() + category.slice(1)} ${index + 1}`;
        categoryCount[category] = index + 1;
    });
}

function renderPagination() {
    // Build the page number buttons and next/previous arrows.
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
// The cart is stored in memory while the page is open, and the UI is
// rebuilt every time the cart changes.
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
 // Handles the horizontal scroll buttons for the category filter bar.
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
    nameDishesByCategory();
    updateDisplay(); // Initial load of cards and pagination
    updateScrollButtons();
    const filterContainer = document.getElementById("filterButtonsContainer");
    if (filterContainer) filterContainer.addEventListener('scroll', updateScrollButtons);
});
