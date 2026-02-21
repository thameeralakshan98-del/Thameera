// 1. Product Data
const products = [
    { id: 1, name: "Organic Apple", price: 1.50, img: "https://via.placeholder.com/150" },
    { id: 2, name: "Fresh Banana", price: 0.80, img: "https://via.placeholder.com/150" },
    { id: 3, name: "Avocado", price: 2.50, img: "https://via.placeholder.com/150" },
    { id: 4, name: "Blueberries", price: 4.00, img: "https://via.placeholder.com/150" },
];

let cart = [];

// 2. Render Products to the UI
const productList = document.getElementById('product-list');

function displayProducts() {
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(card);
    });
}

// 3. Cart Functions
function addToCart(productId) {
    const item = products.find(p => p.id === productId);
    cart.push(item);
    updateUI();
}

function updateUI() {
    // Update count
    document.getElementById('cart-count').innerText = cart.length;

    // Update list
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        const li = document.createElement('li');
        li.innerHTML = `<span>${item.name}</span> <span>$${item.price.toFixed(2)}</span>`;
        cartItems.appendChild(li);
    });

    // Update total
    document.getElementById('cart-total').innerText = total.toFixed(2);
}

// Initialize
displayProducts();