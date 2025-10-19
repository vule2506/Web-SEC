// js/main-cart.js

let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderCart() {
    const cartDropdown = document.getElementById('cart-dropdown');
    if (!cartDropdown) return;
    const cartBody = cartDropdown.querySelector('.cart-body');
    cartBody.innerHTML = '';
    
    if (cart.length === 0) {
        cartBody.innerHTML = '<p class="cart-empty-message">Giỏ hàng của bạn đang trống.</p>';
    } else {
        cart.forEach(item => {
            const cartItemHTML = `
                <div class="cart-item" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p class="cart-item-price">${new Intl.NumberFormat('vi-VN').format(item.price)}đ</p>
                        <p class="cart-item-quantity">x${item.quantity}</p>
                    </div>
                </div>`;
            cartBody.insertAdjacentHTML('beforeend', cartItemHTML);
        });
    }
    updateCartInfo();
}

function updateCartInfo() {
    const cartDropdown = document.getElementById('cart-dropdown');
    if (!cartDropdown) return;
    const cartHeader = cartDropdown.querySelector('.cart-header h3');
    const cartCountBadge = document.querySelector('.cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if(cartCountBadge) cartCountBadge.textContent = totalItems;
    if(cartHeader) cartHeader.textContent = `Giỏ hàng (${totalItems})`;
    if(cartTotalPrice) cartTotalPrice.textContent = `${new Intl.NumberFormat('vi-VN').format(totalPrice)}đ`;
    
    localStorage.setItem('cart', JSON.stringify(cart));
}

function showToast() {
    const toastMessage = document.getElementById('add-to-cart-toast');
    if (!toastMessage) return;
    
    clearTimeout(toastMessage.timeoutId);
    toastMessage.classList.add('active');
    toastMessage.timeoutId = setTimeout(() => {
        toastMessage.classList.remove('active');
    }, 2000);
}

function addToCart(product, quantity) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ ...product, quantity: quantity });
    }
    
    renderCart();
    showToast();
}

export function initializeCart(buttonSelector) {
    const addToCartButtons = document.querySelectorAll(buttonSelector);

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const quantityInput = document.getElementById('quantity-input');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

            const product = {
                id: button.dataset.id,
                name: button.dataset.name,
                price: parseInt(button.dataset.price),
                image: button.dataset.image
            };
            addToCart(product, quantity);
        });
    });
    renderCart();
}

// Render giỏ hàng ngay khi script được tải
document.addEventListener('DOMContentLoaded', renderCart);