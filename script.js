// Sample products data
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 79.99,
        description: "High-quality sound with noise cancellation",
        emoji: "🎧"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        description: "Track your fitness and stay connected",
        emoji: "⌚"
    },
    {
        id: 3,
        name: "USB-C Cable",
        price: 12.99,
        description: "Fast charging and data transfer",
        emoji: "🔌"
    },
    {
        id: 4,
        name: "Portable Charger",
        price: 34.99,
        description: "20000mAh capacity, charges fast",
        emoji: "🔋"
    },
    {
        id: 5,
        name: "Phone Case",
        price: 19.99,
        description: "Durable protection with style",
        emoji: "📱"
    },
    {
        id: 6,
        name: "Screen Protector",
        price: 9.99,
        description: "Tempered glass, crystal clear",
        emoji: "🛡️"
    },
    {
        id: 7,
        name: "Laptop Stand",
        price: 29.99,
        description: "Ergonomic design, adjustable height",
        emoji: "💻"
    },
    {
        id: 8,
        name: "Mouse Pad",
        price: 14.99,
        description: "Non-slip base, smooth surface",
        emoji: "🖱️"
    }
];

// Shopping cart array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const productsGrid = document.getElementById('products-grid');
const cartItemsContainer = document.getElementById('cart-items');
const checkoutBtn = document.getElementById('checkout-btn');
const clearCartBtn = document.getElementById('clear-cart-btn');
const checkoutModal = document.getElementById('checkout-modal');
const checkoutForm = document.getElementById('checkout-form');
const closeModal = document.querySelector('.close');
const cartCount = document.getElementById('cart-count');

// Initialize the shop
function init() {
    displayProducts();
    displayCart();
    updateCartCount();
}

// Display products on the page
function displayProducts() {
    productsGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <h3 class="product-name">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <p class="product-price">$${product.price}</p>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            emoji: product.emoji
        });
    }

    saveCart();
    displayCart();
    updateCartCount();
    
    // Visual feedback
    const button = event.target;
    button.textContent = 'Added!';
    button.classList.add('added');
    setTimeout(() => {
        button.textContent = 'Add to Cart';
        button.classList.remove('added');
    }, 1500);
}

// Display cart items
function displayCart() {
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
        updateCartSummary();
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <div class="cart-item-name">${item.emoji} ${item.name}</div>
                <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    updateCartSummary();
}

// Update item quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            displayCart();
            updateCartCount();
        }
    }
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    displayCart();
    updateCartCount();
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('tax').textContent = tax.toFixed(2);
    document.getElementById('total').textContent = total.toFixed(2);
}

// Update cart count in header
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
}

// Clear entire cart
clearCartBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear the cart?')) {
        cart = [];
        saveCart();
        displayCart();
        updateCartCount();
    }
});

// Open checkout modal
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    checkoutModal.classList.add('active');
});

// Close checkout modal
closeModal.addEventListener('click', () => {
    checkoutModal.classList.remove('active');
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    if (event.target === checkoutModal) {
        checkoutModal.classList.remove('active');
    }
});

// Handle checkout form submission
checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const total = document.getElementById('total').textContent;
    const formData = new FormData(checkoutForm);
    
    // Simulate order processing
    alert(`Order placed successfully!\nTotal: $${total}\n\nThank you for your purchase!`);
    
    // Clear cart and close modal
    cart = [];
    saveCart();
    displayCart();
    updateCartCount();
    checkoutModal.classList.remove('active');
    checkoutForm.reset();
});

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);