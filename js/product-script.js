import { initializeCart } from './main-cart.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // ======================================================
    // 1. LOGIC THƯ VIỆN ẢNH
    // ======================================================
    const mainImage = document.getElementById('main-product-image');
    const thumbnails = document.querySelectorAll('.thumbnail');

    if (mainImage && thumbnails.length > 0) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                mainImage.src = this.src.replace('80x120', '400x600');
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    // ======================================================
    // 2. LOGIC BỘ CHỌN SỐ LƯỢNG
    // ======================================================
    const decreaseQty = document.getElementById('decrease-qty');
    const increaseQty = document.getElementById('increase-qty');
    const quantityInput = document.getElementById('quantity-input');

    if (decreaseQty && increaseQty && quantityInput) {
        decreaseQty.addEventListener('click', () => {
            let currentQty = parseInt(quantityInput.value);
            if (currentQty > 1) {
                quantityInput.value = currentQty - 1;
            }
        });

        increaseQty.addEventListener('click', () => {
            quantityInput.value = parseInt(quantityInput.value) + 1;
        });
    }
    
    // ======================================================
    // 3. KHỞI TẠO GIỎ HÀNG CHO TRANG NÀY
    // ======================================================
    initializeCart('.add-to-cart-main');
});