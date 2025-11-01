/* NỘI DUNG MỚI CHO Web-SEC/js/main.js */

document.addEventListener('DOMContentLoaded', () => {
    // ======================================================
    // 1. LOGIC ĐĂNG NHẬP (Giữ nguyên)
    // ======================================================
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    const accountLink = document.getElementById('account-link');

    if (loggedInUser && accountLink) {
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
    // 2. LOGIC GIỎ HÀNG VÀ MODAL (Giữ nguyên)
    // ======================================================
    
    const sideCart = document.getElementById('side-cart-container');
    const overlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart-btn');
    const openTriggers = document.querySelectorAll('.open-cart-trigger');
    
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutModalBtn = document.getElementById('close-checkout-modal-btn');
    
    const sideCartBody = document.getElementById('side-cart-body');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const cartCountBadge = document.querySelector('.cart-count');
    const goToCheckoutBtn = document.getElementById('go-to-checkout-btn');
    
    const checkoutForm = document.getElementById('checkout-form');
    const toastMessage = document.getElementById('add-to-cart-toast');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // --- Hàm Mở/Đóng Side Cart ---
    const openCartPanel = () => {
        renderCartPanel(); 
        if (sideCart) sideCart.classList.add('is-open');
        if (overlay) overlay.classList.add('is-open');
    };

    const closeCartPanel = () => {
        if (sideCart) sideCart.classList.remove('is-open');
        if (!checkoutModal || !checkoutModal.classList.contains('is-open')) {
            if (overlay) overlay.classList.remove('is-open');
        }
    };

    const checkoutModalTitle = document.getElementById('checkout-modal-title');
    const formView = document.getElementById('checkout-form');
    const reviewView = document.getElementById('checkout-review-view');
    const goToReviewBtn = document.getElementById('go-to-review-btn');
    const backToFormBtn = document.getElementById('back-to-form-btn');
    const confirmOrderBtn = document.getElementById('confirm-order-btn');

    const openCheckoutModal = () => {
        if (checkoutModal) checkoutModal.classList.add('is-open');
        if (overlay) overlay.classList.add('is-open'); 
    };

    const closeCheckoutModal = () => {
        if (checkoutModal) checkoutModal.classList.remove('is-open');
        if (!sideCart || !sideCart.classList.contains('is-open')) {
            if (overlay) overlay.classList.remove('is-open');
        }

        if (formView && reviewView && checkoutModalTitle) {
            formView.classList.remove('hidden');
            reviewView.classList.add('hidden');
            goToReviewBtn.classList.remove('hidden');
            backToFormBtn.classList.add('hidden');
            confirmOrderBtn.classList.add('hidden');
            checkoutModalTitle.textContent = 'Thông tin giao hàng';
        }
    };

    // --- Hàm Logic Giỏ Hàng (Dùng 'product') ---
    const renderCartPanel = () => {
         if (!sideCartBody) return; 
        
        sideCartBody.innerHTML = ''; 
        if (cart.length === 0) {
            sideCartBody.innerHTML = '<p class="cart-empty-message">Giỏ hàng của bạn đang trống.</p>';
        } else {
            cart.forEach((product, index) => {
                const cartItemHTML = `
                    <div class="cart-item" data-id="${product.id}">
                        <img src="${product.image}" alt="${product.name}" class="cart-item-img">
                        <div class="cart-item-info">
                            <div>
                                <h4>${product.name}</h4>
                                <p class="cart-item-price">${new Intl.NumberFormat('vi-VN').format(product.price)}đ</p>
                                <p class="cart-item-quantity">x ${product.quantity}</p>
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
        const totalItems = cart.reduce((sum, product) => sum + product.quantity, 0);
        const totalPrice = cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
        
        if (cartCountBadge) cartCountBadge.textContent = totalItems;
        if (cartTotalPriceEl) cartTotalPriceEl.textContent = `${new Intl.NumberFormat('vi-VN').format(totalPrice)}đ`;
        
        if (goToCheckoutBtn) {
            goToCheckoutBtn.disabled = cart.length === 0;
            goToCheckoutBtn.classList.toggle('disabled', cart.length === 0);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    window.addProductToCart = (product, quantity) => {
        const existingProduct = cart.find(p => p.id === product.id);
        
        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.push({ ...product, quantity: quantity });
        }
        
        renderCartPanel(); 
        showToast(); 
    };
    
    window.showToast = () => {
        if (!toastMessage) return;
        
        clearTimeout(toastMessage.timeoutId);
        toastMessage.classList.add('active');
        toastMessage.timeoutId = setTimeout(() => {
            toastMessage.classList.remove('active');
        }, 2000);
    };

    // --- Gán Sự Kiện ---
    openTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openCartPanel();
        });
    });

    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCartPanel);

    if (sideCartBody) {
        sideCartBody.addEventListener('click', (e) => {
            const removeButton = e.target.closest('.cart-item-remove');
            if (removeButton) {
                const indexToRemove = removeButton.dataset.index;
                cart.splice(indexToRemove, 1);
                renderCartPanel(); 
            }
        });
    }

    if (goToCheckoutBtn) {
        goToCheckoutBtn.addEventListener('click', () => {
            if (loggedInUser) {
                closeCartPanel();
                setTimeout(openCheckoutModal, 300); 
            } else {
                alert('Bạn cần đăng nhập để tiếp tục thanh toán.');
                let loginPath = 'html/login.html'; 
                if (window.location.pathname.includes('/html/')) {
                    loginPath = 'login.html'; 
                }
                window.location.href = loginPath;
            }
        });
    }

    if (closeCheckoutModalBtn) closeCheckoutModalBtn.addEventListener('click', closeCheckoutModal);

    if (overlay) {
        overlay.addEventListener('click', () => {
            closeCartPanel();
            closeCheckoutModal();
        });
    }

    // === LOGIC THANH TOÁN (Không đổi) ===
    const reviewShippingInfo = document.getElementById('review-shipping-info');
    const reviewItemList = document.getElementById('review-item-list');
    const reviewTotal = document.getElementById('review-total');

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault(); 

            const formData = new FormData(checkoutForm);
            const name = formData.get('ho_ten') || 'Chưa nhập';
            const phone = formData.get('so_dien_thoai') || 'Chưa nhập';
            const address = formData.get('dia_chi') || 'Chưa nhập';

            reviewShippingInfo.innerHTML = `
                Họ tên: <strong>${name}</strong><br>
                Số điện thoại: <strong>${phone}</strong><br>
                Địa chỉ: <strong>${address}</strong>
            `;

            reviewItemList.innerHTML = ''; 
            if (cart.length === 0) {
                reviewItemList.innerHTML = '<p>Không có sản phẩm.</p>';
            } else {
                cart.forEach(product => {
                    const productHTML = `
                        <div class="cart-item" data-id="${product.id}">
                            <img src="${product.image}" alt="${product.name}" class="cart-item-img">
                            <div class="cart-item-info">
                                <div>
                                    <h4>${product.name}</h4>
                                    <p class="cart-item-price">${new Intl.NumberFormat('vi-VN').format(product.price)}đ</p>
                                    <p class="cart-item-quantity">x ${product.quantity}</p>
                                </div>
                            </div>
                        </div>`;
                    reviewItemList.insertAdjacentHTML('beforeend', productHTML);
                });
            }

            const totalPrice = cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
            reviewTotal.innerHTML = `
                <strong>Tổng cộng:</strong>
                <span>${new Intl.NumberFormat('vi-VN').format(totalPrice)}đ</span>
            `;

            formView.classList.add('hidden');
            reviewView.classList.remove('hidden');
            goToReviewBtn.classList.add('hidden');
            backToFormBtn.classList.remove('hidden');
            confirmOrderBtn.classList.remove('hidden');
            if (checkoutModalTitle) checkoutModalTitle.textContent = 'Xác nhận đơn hàng';
        });
    }

    if (backToFormBtn) {
        backToFormBtn.addEventListener('click', () => {
            formView.classList.remove('hidden');
            reviewView.classList.add('hidden');
            goToReviewBtn.classList.remove('hidden');
            backToFormBtn.classList.add('hidden');
            confirmOrderBtn.classList.add('hidden');
            if (checkoutModalTitle) checkoutModalTitle.textContent = 'Thông tin giao hàng';
        });
    }

    if (confirmOrderBtn) {
        confirmOrderBtn.addEventListener('click', () => {
            alert('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
            cart = []; 
            localStorage.removeItem('cart'); 
            renderCartPanel(); 
            closeCheckoutModal(); 
            checkoutForm.reset(); 
        });
    }

    // ======================================================
    // 3. [MỚI] LOGIC TÌM KIẾM TOÀN CỤC (GLOBAL SEARCH)
    // ======================================================
    const formatter = new Intl.NumberFormat('vi-VN');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchSuggestions = document.getElementById('search-suggestions');

    /**
     * Hàm HIỂN THỊ HỘP GỢI Ý (Đã sửa lỗi đường dẫn)
     */
    function showSuggestions() {
        if (!searchSuggestions || typeof productDatabase === 'undefined') return;

        const query = searchInput.value.toLowerCase().trim();

        if (query === '') {
            searchSuggestions.innerHTML = '';
            searchSuggestions.style.display = 'none';
            return;
        }

        const allProducts = Object.values(productDatabase);
        const suggestions = allProducts.filter(product => {
            return product.title.toLowerCase().includes(query);
        }).slice(0, 5); // Lấy 5 gợi ý

        searchSuggestions.innerHTML = ''; 

        if (suggestions.length > 0) {
            const isAtProductPage = window.location.pathname.includes('/html/');
            
            suggestions.forEach(product => {
                // Sửa đường dẫn ảnh và link tùy theo trang
                let thumbImageSrc = product.thumbnails[0];
                let productLink = `html/product-detail.html?id=${product.id}`;

                if (isAtProductPage) {
                    // Đang ở trang product-detail.html, đường dẫn database (../img/...) đã đúng
                    productLink = `product-detail.html?id=${product.id}`;
                } else {
                    // Đang ở trang index.html, cần xóa '../'
                    thumbImageSrc = thumbImageSrc.replace('../', '');
                }

                const suggestionHTML = `
                    <a href="${productLink}" class="suggestion-item">
                        <img src="${thumbImageSrc}" alt="${product.title}">
                        <div class="suggestion-item-info">
                            <span class="title">${product.title}</span>
                            <span class="price">${formatter.format(product.currentPrice)}đ</span>
                        </div>
                    </a>
                `;
                searchSuggestions.insertAdjacentHTML('beforeend', suggestionHTML);
            });
            searchSuggestions.style.display = 'block';
        } else {
            searchSuggestions.innerHTML = '<div style="padding: 10px 15px; color: #888;">Không tìm thấy sản phẩm...</div>';
            searchSuggestions.style.display = 'block';
        }
    }
    
    /**
     * Hàm CHUYỂN HƯỚNG TÌM KIẾM
     * (Chuyển người dùng về index.html để xem kết quả)
     */
    function redirectToSearch() {
        const query = searchInput.value.trim();
        if (query === '') return;
        
        // Tạo URL tìm kiếm
        const searchUrl = `?search=${encodeURIComponent(query)}`;
        
        if (window.location.pathname.includes('/html/')) {
            // Nếu đang ở trang con (product-detail), quay về trang chủ
            window.location.href = `../index.html${searchUrl}`;
        } else {
            // Nếu đang ở trang chủ (index.html), chỉ cần tải lại với query
            // (Hàm này sẽ bị `script.js` ghi đè, nhưng nếu `script.js` lỗi, nó vẫn chạy)
             window.location.href = `index.html${searchUrl}`;
        }
    }

    // Gắn sự kiện tìm kiếm (chỉ gắn GỢI Ý và CHUYỂN HƯỚNG)
    if (searchButton) {
        searchButton.addEventListener('click', (e) => {
            e.preventDefault(); 
            redirectToSearch();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); 
                redirectToSearch();
            }
        });
        // Gắn sự kiện GỢI Ý
        searchInput.addEventListener('input', showSuggestions);
    }

    // Ẩn gợi ý khi click ra ngoài
    document.addEventListener('click', (e) => {
        if (!searchSuggestions || !searchInput) return;
        if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
            searchSuggestions.style.display = 'none';
        }
    });

    // ======================================================
    // KHỞI TẠO
    // ======================================================
    renderCartPanel();
});