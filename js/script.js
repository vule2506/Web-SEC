document.addEventListener('DOMContentLoaded', () => {

    // ======================================================
    // 2. LOGIC CỦA SLIDER TỰ VIẾT
    // ======================================================
    let slideIndex = 0;
    let slideInterval;
    const slidesContainer = document.querySelector('.slides');
    const slides = document.querySelectorAll('.slides .slide');
    const dots = document.querySelectorAll('.dots-container .dot');

    function showSlides(n) {
        if (!slidesContainer || !dots || slides.length === 0) return;

        if (n >= slides.length) { slideIndex = 0; }
        else if (n < 0) { slideIndex = slides.length - 1; }
        else { slideIndex = n; }

        slidesContainer.style.transform = `translateX(-${slideIndex * 100}%)`;

        dots.forEach(dot => dot.classList.remove('active'));
        if (dots[slideIndex]) {
            dots[slideIndex].classList.add('active');
        }
    }

    window.changeSlide = function(n) {
        clearInterval(slideInterval);
        showSlides(slideIndex + n);
        startAutoSlide();
    }

    window.currentSlide = function(n) {
        clearInterval(slideInterval);
        showSlides(n);
        startAutoSlide();
    }
    
    function startAutoSlide() {
        if (slideInterval) { clearInterval(slideInterval); }
        slideInterval = setInterval(() => {
            showSlides(slideIndex + 1);
        }, 5000);
    }

    // Khởi tạo slider
    if (slides.length > 0) {
        showSlides(slideIndex); 
        startAutoSlide(); 
    }

    // ======================================================
    // 3. LOGIC CỦA GIỎ HÀNG
    // ======================================================
    const cartDropdown = document.getElementById('cart-dropdown');
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    const toastMessage = document.getElementById('add-to-cart-toast');
    let toastTimeout;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cartDropdown && addToCartButtons.length > 0 && toastMessage) {
        const cartBody = cartDropdown.querySelector('.cart-body');
        const cartHeader = cartDropdown.querySelector('.cart-header h3');
        const cartCountBadge = document.querySelector('.cart-count');
        const cartTotalPrice = document.getElementById('cart-total-price');

        const renderCart = () => {
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
        };
        
        const updateCartInfo = () => {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartCountBadge.textContent = totalItems;
            cartHeader.textContent = `Giỏ hàng (${totalItems})`;
            cartTotalPrice.textContent = `${new Intl.NumberFormat('vi-VN').format(totalPrice)}đ`;
            localStorage.setItem('cart', JSON.stringify(cart));
        };

        const showToast = () => {
            clearTimeout(toastTimeout);
            toastMessage.classList.add('active');
            toastTimeout = setTimeout(() => {
                toastMessage.classList.remove('active');
            }, 2000);
        };

        const addToCart = (product) => {
            const existingItem = cart.find(item => item.id === product.id);
            if (existingItem) { existingItem.quantity++; }
            else { cart.push({ ...product, quantity: 1 }); }
            renderCart();
            showToast();
        };

        addToCartButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const product = {
                    id: button.dataset.id,
                    name: button.dataset.name,
                    price: parseInt(button.dataset.price),
                    image: button.dataset.image
                };
                addToCart(product);
            });
        });
        
        renderCart();
    }
});