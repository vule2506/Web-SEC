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
        if (!sideCart || !sideCart.classList.contains('is-open')) {
            if (overlay) overlay.classList.remove('is-open');
        }

        // DÁN THÊM 3 DÒNG NÀY ĐỂ RESET MODAL
        if (formView && reviewView && checkoutModalTitle) {
            formView.classList.remove('hidden');
            reviewView.classList.add('hidden');
            goToReviewBtn.classList.remove('hidden');
            backToFormBtn.classList.add('hidden');
            confirmOrderBtn.classList.add('hidden');
            checkoutModalTitle.textContent = 'Thông tin giao hàng';
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
        
        // ======================================================
        // KIỂM TRA ĐĂNG NHẬP (MỚI)
        // ======================================================
        // 1. Lấy thông tin người dùng từ sessionStorage
        const loggedInUser = sessionStorage.getItem('loggedInUser');

        // 2. Kiểm tra xem người dùng có tồn tại không
        if (!loggedInUser) {
            // Nếu không, thông báo và chuyển hướng
            alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
            
            // Đoạn mã này kiểm tra xem bạn đang ở trang chủ hay trang con
            // để điều hướng đến 'login.html' một cách chính xác
            if (window.location.pathname.includes('/html/')) {
                // Nếu đang ở (ví dụ: /html/product-detail.html)
                window.location.href = 'login.html';
            } else {
                // Nếu đang ở trang chủ (ví dụ: /index.html)
                window.location.href = 'html/login.html';
            }
            
            return; // Dừng hàm tại đây, không thêm gì vào giỏ
        }

        // ======================================================
        // LOGIC THÊM VÀO GIỎ (CŨ)
        // ======================================================
        // Nếu đã đăng nhập, đoạn mã cũ sẽ chạy bình thường
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
// === DÁN TOÀN BỘ LOGIC THANH TOÁN MỚI VÀO ĐÂY ===

// Lấy các phần tử mới của Modal
const checkoutModalTitle = document.getElementById('checkout-modal-title');
const formView = document.getElementById('checkout-form');
const reviewView = document.getElementById('checkout-review-view');

// Lấy các nút điều khiển mới
const goToReviewBtn = document.getElementById('go-to-review-btn');
const backToFormBtn = document.getElementById('back-to-form-btn');
const confirmOrderBtn = document.getElementById('confirm-order-btn');

// Lấy các vùng hiển thị thông tin review
const reviewShippingInfo = document.getElementById('review-shipping-info');
const reviewItemList = document.getElementById('review-item-list');
const reviewTotal = document.getElementById('review-total');

// --- BƯỚC 1: Bấm nút "Xem Lại Đơn Hàng" ---
if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Ngăn form gửi đi

        // Lấy dữ liệu từ form (chỉ lấy các trường đã điền)
        const formData = new FormData(checkoutForm);
        const name = formData.get('ho_ten') || 'Chưa nhập';
        const email = formData.get('email') || 'Chưa nhập';
        const phone = formData.get('so_dien_thoai') || 'Chưa nhập';
        const address = formData.get('dia_chi') || 'Chưa nhập';

        // 1. Điền thông tin giao hàng
        reviewShippingInfo.innerHTML = `
            Họ tên: <strong>${name}</strong><br>
            Số điện thoại: <strong>${phone}</strong><br>
            Địa chỉ: <strong>${address}</strong>
        `;

        // 2. Điền danh sách sản phẩm (tận dụng cart)
        reviewItemList.innerHTML = ''; // Xóa cũ
        if (cart.length === 0) {
            reviewItemList.innerHTML = '<p>Không có sản phẩm.</p>';
        } else {
            cart.forEach(item => {
                const itemHTML = `
                    <div class="cart-item" data-id="${item.id}">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-info">
                            <div>
                                <h4>${item.name}</h4>
                                <p class="cart-item-price">${new Intl.NumberFormat('vi-VN').format(item.price)}đ</p>
                                <p class="cart-item-quantity">x ${item.quantity}</p>
                            </div>
                        </div>
                    </div>`;
                reviewItemList.insertAdjacentHTML('beforeend', itemHTML);
            });
        }

        // 3. Điền tổng tiền
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        reviewTotal.innerHTML = `
            <strong>Tổng cộng:</strong>
            <span>${new Intl.NumberFormat('vi-VN').format(totalPrice)}đ</span>
        `;

        // 4. Chuyển đổi màn hình
        formView.classList.add('hidden');
        reviewView.classList.remove('hidden');
        goToReviewBtn.classList.add('hidden');
        backToFormBtn.classList.remove('hidden');
        confirmOrderBtn.classList.remove('hidden');
        if (checkoutModalTitle) checkoutModalTitle.textContent = 'Xác nhận đơn hàng';
    });
}

// --- BƯỚC 2: Bấm nút "Quay Lại" ---
if (backToFormBtn) {
    backToFormBtn.addEventListener('click', () => {
        // Chuyển đổi màn hình
        formView.classList.remove('hidden');
        reviewView.classList.add('hidden');
        goToReviewBtn.classList.remove('hidden');
        backToFormBtn.classList.add('hidden');
        confirmOrderBtn.classList.add('hidden');
        if (checkoutModalTitle) checkoutModalTitle.textContent = 'Thông tin giao hàng';
    });
}

// --- BƯỚC 3: Bấm nút "Xác Nhận Đặt Hàng" (Logic submit cuối cùng) ---
if (confirmOrderBtn) {
    confirmOrderBtn.addEventListener('click', () => {
        // Đây là lúc thực sự đặt hàng
        alert('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');

        cart = []; // Xóa giỏ hàng
        localStorage.removeItem('cart'); 

        renderCartPanel(); // Cập nhật lại giỏ hàng (sẽ rỗng)
        closeCheckoutModal(); // Đóng modal
        checkoutForm.reset(); // Xóa các trường đã điền
    });
}

// --- Cập nhật hàm ĐÓNG MODAL ---
// Tìm hàm closeCheckoutModal và thêm logic reset

// (Hàm này đã có, bạn chỉ cần dán thêm 3 dòng vào bên trong nó)


// === KẾT THÚC LOGIC MỚI ===
    // Khởi tạo giỏ hàng khi tải trang
    renderCartPanel();
});