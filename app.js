// පිටු මාරු කිරීමේ function එක
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(pageId).style.display = 'block';
    if(pageId === 'home') displayProducts();
    if(pageId === 'cart') displayCart();
}

// භාණ්ඩයක් Save කිරීම
document.getElementById('product-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const product = {
        id: Date.now(),
        name: document.getElementById('p-name').value,
        desc: document.getElementById('p-desc').value,
        img: document.getElementById('p-img').value,
        whatsapp: document.getElementById('p-whatsapp').value
    };

    let products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));

    alert('භාණ්ඩය සාර්ථකව ඇතුළත් කරා!');
    this.reset();
    showPage('home');
});

// Home Page එකේ display කිරීම
function displayProducts() {
    const list = document.getElementById('product-list');
    list.innerHTML = '';
    let products = JSON.parse(localStorage.getItem('products')) || [];

    products.forEach(p => {
        list.innerHTML += `
            <div class="card">
                <img src="${p.img}" alt="${p.name}">
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
                <button onclick="addToCart(${p.id})">Add to Cart</button>
                <br>
                <a href="https://wa.me/${p.whatsapp}" target="_blank">WhatsApp හරහා විමසන්න</a>
            </div>
        `;
    });
}

// Cart එකට එකතු කිරීම
function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let products = JSON.parse(localStorage.getItem('products')) || [];
    let item = products.find(p => p.id === productId);

    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('භාණ්ඩය Cart එකට එකතු කළා!');
}

// Cart එක display කිරීම
function displayCart() {
    const list = document.getElementById('cart-list');
    list.innerHTML = '';
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    cart.forEach(p => {
        list.innerHTML += `
            <div class="card">
                <img src="${p.img}" alt="${p.name}">
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
            </div>
        `;
    });
}

// මුලින්ම Home Page එක පෙන්වන්න
displayProducts();