document.addEventListener('DOMContentLoaded', () => {
    
    //======================================================
    // 1. LOGIC THƯ VIỆN ẢNH (Giữ nguyên)
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
    // 2. LOGIC BỘ CHỌN SỐ LƯỢNG (MỚI)
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
    // 3. LOGIC THÊM VÀO GIỎ (MỚI)
    // ======================================================
    const addToCartButton = document.querySelector('.add-to-cart-main');
    
    if (addToCartButton) {
        addToCartButton.addEventListener('click', (e) => {
            e.preventDefault();
            
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;

            const product = {
                id: addToCartButton.dataset.id,
                name: addToCartButton.dataset.name,
                price: parseInt(addToCartButton.dataset.price),
                image: addToCartButton.dataset.image
            };
            
            // Gọi hàm toàn cục từ main.js
            if (window.addProductToCart) {
                window.addProductToCart(product, quantity);
            }
        });
    }
});