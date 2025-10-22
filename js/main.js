document.addEventListener('DOMContentLoaded', () => {
    // ======================================================
    // 1. LOGIC ĐĂNG NHẬP (Không thay đổi)
    // ======================================================
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    const accountLink = document.getElementById('account-link');

    if (loggedInUser && accountLink) {
        // ... (Mã logic đăng nhập của bạn y như cũ) ...
        const userAccountDiv = document.createElement('div');
        userAccountDiv.className = 'action-item user-account';
        userAccountDiv.innerHTML = `
            <i class="far fa-user-circle"></i>
            <span class="welcome-text">${loggedInUser.username}</span>
            <div class="user-dropdown-menu">
                <div class="dropdown-header">
                     <div class="user-avatar-dropdown"><i class="fas fa-crown"></i></div>
                     <div class="user-info-dropdown">
                        <span class="dropdown-username">${loggedInUser.username}</span>
                        <span class="user-level">Thành viên</span>
                    </div>
                </div>
                <a href="#" class="dropdown-item"><i class="fas fa-box"></i><span>Đơn hàng của tôi</span></a>
                <a href="#" id="logout-btn" class="dropdown-item logout-item">
                    <i class="fas fa-sign-out-alt"></i><span>Thoát tài khoản</span>
                </a>
            </div>
        `;
        accountLink.parentNode.replaceChild(userAccountDiv, accountLink);

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.removeItem('loggedInUser');
                alert('Bạn đã đăng xuất.');
                window.location.reload();
            });
        }
    }

    // ======================================================
    // 2. LOGIC GIỎ HÀNG VÀ MODAL (ĐÃ CẬP NHẬT)
    // ======================================================
    
    // --- Chọn các phần tử DOM ---
    const sideCart = document.getElementById('side-cart-container');
    const overlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const openTriggers = document.querySelectorAll('.open-cart-trigger');
    
    // MODAL MỚI
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutModalBtn = document.getElementById('close-checkout-modal-btn');
    
    // Phần thân giỏ hàng
    const sideCartBody = document.getElementById('side-cart-body');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const cartCountBadge = document.querySelector('.cart-count');
    const goToCheckoutBtn = document.getElementById('go-to-checkout-btn');
    
    // Form thanh toán
    const checkoutForm = document.getElementById('checkout-form');
    
    // Toast
    const toastMessage = document.getElementById('add-to-cart-toast');

    // Lấy giỏ hàng từ localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // --- Hàm Mở/Đóng Side Cart ---
    const openCartPanel = () => {
        renderCartPanel(); 
        if (sideCart) sideCart.classList.add('is-open');
        if (overlay) overlay.classList.add('is-open');
    };

    const closeCartPanel = () => {
        if (sideCart) sideCart.classList.remove('is-open');
        // Chỉ đóng overlay nếu modal thanh toán cũng đang đóng
        if (!checkoutModal || !checkoutModal.classList.contains('is-open')) {
            if (overlay) overlay.classList.remove('is-open');
        }
    };

    // --- HÀM MỞ/ĐÓNG MODAL THANH TOÁN MỚI ---
    const openCheckoutModal = () => {
        if (checkoutModal) checkoutModal.classList.add('is-open');
        if (overlay) overlay.classList.add('is-open'); // Đảm bảo overlay hiện
    };

    const closeCheckoutModal = () => {
        if (checkoutModal) checkoutModal.classList.remove('is-open');
        // Chỉ đóng overlay nếu side cart cũng đang đóng
        if (!sideCart || !sideCart.classList.contains('is-open')) {
            if (overlay) overlay.classList.remove('is-open');
        }
    };

    // --- Hàm Logic Giỏ Hàng (Không đổi) ---
    const renderCartPanel = () => {
        // ... (Mã renderCartPanel y như cũ) ...
         if (!sideCartBody) return; 
        
        sideCartBody.innerHTML = ''; 
        if (cart.length === 0) {
            sideCartBody.innerHTML = '<p class="cart-empty-message">Giỏ hàng của bạn đang trống.</p>';
        } else {
            cart.forEach((item, index) => {
                const cartItemHTML = `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-info">
                            <div>
                                <h4>${item.name}</h4>
                                <p class="cart-item-price">${new Intl.NumberFormat('vi-VN').format(item.price)}đ</p>
                                <p class="cart-item-quantity">x ${item.quantity}</p>
                            </div>
                            <button class="cart-item-remove" data-index="${index}"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>`;
                sideCartBody.insertAdjacentHTML('beforeend', cartItemHTML);
            });
        }
        updateCartInfo();
    };

    const updateCartInfo = () => {
        // ... (Mã updateCartInfo y như cũ) ...
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        if (cartCountBadge) cartCountBadge.textContent = totalItems;
        if (cartTotalPriceEl) cartTotalPriceEl.textContent = `${new Intl.NumberFormat('vi-VN').format(totalPrice)}đ`;
        
        if (goToCheckoutBtn) {
            if (cart.length === 0) {
                goToCheckoutBtn.classList.add('disabled');
                goToCheckoutBtn.disabled = true;
            } else {
                goToCheckoutBtn.classList.remove('disabled');
                goToCheckoutBtn.disabled = false;
            }
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    window.addProductToCart = (product, quantity) => {
        // ... (Mã addProductToCart y như cũ) ...
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({ ...product, quantity: quantity });
        }
        
        renderCartPanel(); 
        showToast(); 
    };
    
    window.showToast = () => {
        // ... (Mã showToast y như cũ) ...
        if (!toastMessage) return;
        
        clearTimeout(toastMessage.timeoutId);
        toastMessage.classList.add('active');
        toastMessage.timeoutId = setTimeout(() => {
            toastMessage.classList.remove('active');
        }, 2000);
    };

    // --- Gán Sự Kiện (Đã CẬP NHẬT) ---
    
    // Mở Side Cart
    openTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openCartPanel();
        });
    });

    // Đóng Side Cart
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartPanel);

    // Xóa sản phẩm
    if (sideCartBody) {
        sideCartBody.addEventListener('click', (e) => {
            if (e.target.closest('.cart-item-remove')) {
                const indexToRemove = e.target.closest('.cart-item-remove').dataset.index;
                cart.splice(indexToRemove, 1);
                renderCartPanel(); 
            }
        });
    }

    // --- CẬP NHẬT LOGIC NÚT THANH TOÁN ---
    // Chuyển từ Side Cart sang Modal Thanh Toán
    if (goToCheckoutBtn) {
        goToCheckoutBtn.addEventListener('click', () => {
            closeCartPanel();
            // Thêm một độ trễ nhỏ để hiệu ứng mượt hơn
            setTimeout(openCheckoutModal, 300); 
        });
    }

    // Đóng Modal Thanh Toán
    if (closeCheckoutModalBtn) closeCheckoutModalBtn.addEventListener('click', closeCheckoutModal);

    // Đóng cả 2 khi click vào overlay
    if (overlay) {
        overlay.addEventListener('click', () => {
            closeCartPanel();
            closeCheckoutModal();
        });
    }

    // Xử lý đặt hàng (từ Modal)
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
            
            cart = []; 
            localStorage.removeItem('cart'); 
            
            renderCartPanel(); 
            closeCheckoutModal(); // Đóng modal
            checkoutForm.reset(); 
        });
    }

    // Khởi tạo giỏ hàng khi tải trang
    renderCartPanel();
});