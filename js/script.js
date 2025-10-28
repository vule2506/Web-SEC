/* NỘI DUNG CHO Web-SEC/js/script.js */

document.addEventListener('DOMContentLoaded', () => {

    // ======================================================
    // 1. LOGIC SLIDER (Giữ nguyên)
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
    if (slides.length > 0) {
        showSlides(slideIndex); 
        startAutoSlide(); 
    }

    // ======================================================
    // 2. LOGIC THÊM VÀO GIỎ (DÙNG EVENT DELEGATION - ĐÃ SỬA LỖI)
    // ======================================================
    // Lắng nghe sự kiện trên CHA (grid) thay vì từng nút
    const bookGridForCart = document.getElementById('main-book-grid');

    if (bookGridForCart) {
        bookGridForCart.addEventListener('click', (e) => {
            // Kiểm tra xem mục được click có phải là nút "Thêm vào giỏ" không
            const button = e.target.closest('.add-to-cart-btn');
            
            if (button) {
                e.preventDefault(); // Ngăn thẻ <a> tải lại trang
                
                const product = {
                    id: button.dataset.id,
                    name: button.dataset.name,
                    price: parseInt(button.dataset.price),
                    image: button.dataset.image
                };
                
                // Gọi hàm toàn cục từ main.js (lúc này đã được tải)
                if (window.addProductToCart) {
                    window.addProductToCart(product, 1);
                } else {
                    console.error('Lỗi: Hàm addProductToCart chưa được tải.');
                }
            }
        });
    }

    // ======================================================
    // 3. LOGIC LỌC VÀ RENDER SẢN PHẨM
    // ======================================================
    
    const bookGrid = document.getElementById('main-book-grid');
    const categoryLinks = document.querySelectorAll('.category-bar-item[data-category]');
    const featuredTitle = document.getElementById('featured-books-title');
    const formatter = new Intl.NumberFormat('vi-VN'); // Định dạng tiền tệ

    /**
     * Hàm "vẽ" sản phẩm ra grid
     */
    function renderProducts(productsToRender) {
        if (!bookGrid) return;
        
        bookGrid.innerHTML = ''; // Xóa sạch sách cũ
        
        if (productsToRender.length === 0) {
            bookGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">Không tìm thấy sản phẩm nào phù hợp.</p>';
            return;
        }
        
        // Kiểm tra xem productDatabase đã tải chưa
        if (typeof productDatabase === 'undefined') {
             bookGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">Lỗi: Không tải được dữ liệu sản phẩm.</p>';
             return;
        }
        
        productsToRender.forEach(product => {
            const productHTML = `
                <div class="book-card">
                    <a href="html/product-detail.html?id=${product.id}">
                        <img src="${product.mainImage}" alt="${product.title}">
                        <h3>${product.title}</h3>
                        <p class="author">${product.author || 'Không rõ tác giả'}</p>
                        <p class="price">${formatter.format(product.currentPrice)}đ</p>
                    </a>
                    <a href="#" class="btn btn-secondary add-to-cart-btn" 
                        data-id="${product.id}" 
                        data-name="${product.title}" 
                        data-price="${product.currentPrice}" 
                        data-image="${product.thumbnails[0]}">
                        Thêm vào giỏ
                    </a>
                </div>
            `;
            bookGrid.insertAdjacentHTML('beforeend', productHTML);
        });
    }

    /**
     * Hàm lọc sản phẩm theo thể loại
     */
    function filterProducts(category, categoryName) {
        // Chỉ chạy nếu productDatabase đã tồn tại
        if (typeof productDatabase === 'undefined') return; 

        const allProducts = Object.values(productDatabase);
        let filteredProducts;

        if (category === 'all') {
            filteredProducts = allProducts;
            if (featuredTitle) featuredTitle.textContent = 'Tất Cả Sản Phẩm';
        } else {
            filteredProducts = allProducts.filter(product => product.category === category);
            if (featuredTitle) featuredTitle.textContent = categoryName;
        }
        
        renderProducts(filteredProducts);
    }

    // Gắn sự kiện click cho các link thể loại
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            const categoryKey = link.dataset.category;
            const categoryDisplayName = link.textContent; 
            filterProducts(categoryKey, categoryDisplayName);
        });
    });

    // Tải tất cả sản phẩm lên lần đầu tiên
    // Đảm bảo productDatabase đã tải
    if (typeof productDatabase !== 'undefined') {
        renderProducts(Object.values(productDatabase));
        if (featuredTitle) featuredTitle.textContent = 'Sách Nổi Bật Tuần Này';
    } else {
        console.error('Lỗi: database.js chưa tải kịp.');
        if (bookGrid) bookGrid.innerHTML = '<p>Đang tải dữ liệu sản phẩm...</p>';
    }


    // ======================================================
    // 4. LOGIC TÌM KIẾM SÁCH (VỚI GỢI Ý)
    // ======================================================

    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchSuggestions = document.getElementById('search-suggestions');

    /**
     * Hàm lọc và CẬP NHẬT GRID CHÍNH
     */
    function performSearch() {
        if (typeof productDatabase === 'undefined') return;
        
        const query = searchInput.value.toLowerCase().trim();
        const allProducts = Object.values(productDatabase);
        
        const searchResults = allProducts.filter(product => {
            return product.title.toLowerCase().includes(query);
        });
        
        renderProducts(searchResults);
        
        if (featuredTitle) {
            if (query) {
                featuredTitle.textContent = `Kết quả tìm kiếm cho "${query}"`;
            } else {
                featuredTitle.textContent = 'Tất Cả Sản Phẩm';
                renderProducts(allProducts);
            }
        }
        
        if (searchSuggestions) searchSuggestions.style.display = 'none';
    }
    
    /**
     * Hàm HIỂN THỊ HỘP GỢI Ý
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
            suggestions.forEach(product => {
                const suggestionHTML = `
                    <a href="html/product-detail.html?id=${product.id}" class="suggestion-item">
                        <img src="${product.thumbnails[0]}" alt="${product.title}">
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

    // Gắn sự kiện cho nút bấm
    if (searchButton) {
        searchButton.addEventListener('click', (e) => {
            e.preventDefault(); 
            performSearch();
        });
    }
    
    if (searchInput) {
        // Gắn sự kiện cho phím "Enter"
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); 
                performSearch();
            }
        });

        // Gắn sự kiện "input" (khi gõ)
        searchInput.addEventListener('input', showSuggestions);
    }

    // Ẩn gợi ý khi click ra ngoài
    document.addEventListener('click', (e) => {
        if (!searchSuggestions || !searchInput) return;
        if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
            searchSuggestions.style.display = 'none';
        }
    });
});