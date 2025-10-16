document.addEventListener('DOMContentLoaded', () => {
    const cartItemContainer = document.getElementById('cart-item-container');
    // THÊM DÒNG NÀY: Lấy nút thanh toán
    const checkoutButton = document.querySelector('.btn-checkout'); 
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function renderCartItems() {
        cartItemContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemContainer.innerHTML = '<p>Không có sản phẩm nào trong giỏ hàng.</p>';
        } else {
            cart.forEach((item, index) => {
                const itemHTML = `
                    <div class="cart-item-card" data-id="${item.id}">
                        <input type="checkbox" class="item-checkbox" checked>
                        <img src="${item.image}" alt="${item.name}" class="item-image">
                        <div class="item-details">
                            <h4>${item.name}</h4>
                            <p class="item-price">${new Intl.NumberFormat('vi-VN').format(item.price)} đ</p>
                        </div>
                        <div class="quantity-control">
                            <button class="quantity-btn decrease-qty" data-index="${index}">-</button>
                            <input type="number" class="item-quantity" value="${item.quantity}" min="1" data-index="${index}">
                            <button class="quantity-btn increase-qty" data-index="${index}">+</button>
                        </div>
                        <span class="item-total-price">${new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)} đ</span>
                        <button class="item-remove" data-index="${index}"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                cartItemContainer.insertAdjacentHTML('beforeend', itemHTML);
            });
        }
        // Luôn gọi updateSummary để cập nhật trạng thái nút
        updateSummary(); 
        addEventListeners();
    }

    function updateSummary() {
        let subtotal = 0;
        let totalItems = 0;

        cart.forEach((item, index) => {
            const itemCard = document.querySelector(`.cart-item-card[data-id="${item.id}"]`);
            if (itemCard) {
                 const checkbox = itemCard.querySelector('.item-checkbox');
                 if (checkbox.checked) {
                    subtotal += item.price * item.quantity;
                 }
            }
            totalItems += item.quantity;
        });

        document.getElementById('summary-subtotal').textContent = `${new Intl.NumberFormat('vi-VN').format(subtotal)} đ`;
        document.getElementById('summary-total').textContent = `${new Intl.NumberFormat('vi-VN').format(subtotal)} đ`;
        document.getElementById('cart-page-count').textContent = cart.length;
        document.getElementById('cart-total-items').textContent = cart.length;
        
        // Cập nhật trạng thái cho checkbox "Chọn tất cả"
        const allItemsCheckbox = document.getElementById('select-all-items');
        if (allItemsCheckbox) {
            const selectedItems = document.querySelectorAll('.item-checkbox:checked');
            allItemsCheckbox.checked = selectedItems.length === cart.length && cart.length > 0;
        }

        // === THÊM LOGIC VÔ HIỆU HÓA NÚT THANH TOÁN TẠI ĐÂY ===
        if (cart.length === 0) {
            checkoutButton.classList.add('disabled'); // Thêm lớp CSS
            checkoutButton.disabled = true; // Vô hiệu hóa nút
        } else {
            checkoutButton.classList.remove('disabled'); // Bỏ lớp CSS
            checkoutButton.disabled = false; // Kích hoạt lại nút
        }
    }

    function addEventListeners() {
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.dataset.index;
                if (e.target.classList.contains('increase-qty')) {
                    cart[index].quantity++;
                } else if (e.target.classList.contains('decrease-qty')) {
                    if (cart[index].quantity > 1) cart[index].quantity--;
                }
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCartItems();
            });
        });
        
        document.querySelectorAll('.item-remove').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.currentTarget.dataset.index;
                cart.splice(index, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                renderCartItems();
            });
        });

        document.querySelectorAll('.item-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', updateSummary);
        });

        const allItemsCheckbox = document.getElementById('select-all-items');
        if (allItemsCheckbox) {
            allItemsCheckbox.addEventListener('change', (e) => {
                document.querySelectorAll('.item-checkbox').forEach(checkbox => checkbox.checked = e.target.checked);
                updateSummary();
            });
        }
    }

    renderCartItems();
});