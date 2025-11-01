/* NỘI DUNG CHO Web-SEC/js/script.js */

document.addEventListener('DOMContentLoaded', () => {

    // ======================================================
    // 1. LOGIC SLIDER (Không đổi)
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
    // 2. LOGIC THÊM VÀO GIỎ (Không đổi)
    // ======================================================
    const bookGridForCart = document.getElementById('main-book-grid');

    if (bookGridForCart) {
        bookGridForCart.addEventListener('click', (e) => {
            const button = e.target.closest('.add-to-cart-btn');
            
            if (button) {
                e.preventDefault(); 
                
                const product = {
                    id: button.dataset.id,
                    name: button.dataset.name,
                    price: parseInt(button.dataset.price),
                    image: button.dataset.image
                };
                
                if (window.addProductToCart) {
                    window.addProductToCart(product, 1);
                } else {
                    console.error('Lỗi: Hàm addProductToCart chưa được tải.');
                }
            }
        });
    }

    // ======================================================
    // 3. LOGIC LỌC, RENDER SẢN PHẨM VÀ PHÂN TRANG (ĐÃ CẬP NHẬT)
    // ======================================================
    
    // --- Biến toàn cục cho phân trang ---
    let allProductsList = []; // Chứa TẤT CẢ sản phẩm từ database
    let currentFilteredProducts = []; // Chứa sản phẩm SAU KHI lọc/tìm kiếm
    let currentPage = 1;
    const itemsPerPage = 20; // Số sách tối đa mỗi trang
    const formatter = new Intl.NumberFormat('vi-VN'); // Định dạng tiền tệ

    // --- DOM Elements ---
    const bookGrid = document.getElementById('main-book-grid');
    const categoryLinks = document.querySelectorAll('.category-bar-item[data-category]');
    const featuredTitle = document.getElementById('featured-books-title');
    const paginationContainer = document.getElementById('pagination-container');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchSuggestions = document.getElementById('search-suggestions');

    /**
     * Hàm "vẽ" 20 cuốn sách ra grid (Tên cũ: renderProducts)
     */
    function renderProductGrid(productsToDisplay) {
        if (!bookGrid) return;
        
        bookGrid.innerHTML = ''; // Xóa sạch sách cũ
        
        if (productsToDisplay.length === 0) {
            bookGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">Không tìm thấy sản phẩm nào phù hợp.</p>';
            return;
        }
        
        productsToDisplay.forEach(product => {
            const thumbImageSrc = product.thumbnails[0].replace('../', 'img/book');

            const productHTML = `
                <div class="book-card">
                    <a href="html/product-detail.html?id=${product.id}" class="book-card-image-link">
                        <img src="${product.mainImage}" alt="${product.title}">
                    </a>
                    
                    <div class="book-card-details">
                        <h3>
                            <a href="html/product-detail.html?id=${product.id}">${product.title}</a>
                        </h3>
                        <p class="author">${product.author || 'Không rõ tác giả'}</p>
                        <p class="price">${formatter.format(product.currentPrice)}đ</p>

                        <a href="#" class="btn btn-secondary add-to-cart-btn" 
                            data-id="${product.id}" 
                            data-name="${product.title}" 
                            data-price="${product.currentPrice}" 
                            data-image="${thumbImageSrc}">
                            Thêm vào giỏ
                        </a>
                    </div>
                </div>
            `;
            bookGrid.insertAdjacentHTML('beforeend', productHTML);
        });
    }

    /**
     * [MỚI] Hàm hiển thị một trang cụ thể
     */
    function displayPage(page) {
        if (typeof productDatabase === 'undefined' || !bookGrid) return;
        
        currentPage = page;

        // Tính toán sản phẩm cho trang hiện tại
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        
        // Cắt mảng sản phẩm đã lọc
        const productsForThisPage = currentFilteredProducts.slice(startIndex, endIndex);
        
        renderProductGrid(productsForThisPage); // Vẽ lại lưới sách
        setupPagination(); // Vẽ lại các nút phân trang
        
        // Cuộn lên đầu lưới sản phẩm
        if (featuredTitle) {
             featuredTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * [MỚI] Hàm tạo nút phân trang
     */
    function createPaginationButton(page, text, isDisabled = false, isActive = false) {
        const button = document.createElement('button');
        button.className = 'pagination-btn';
        button.textContent = text;
        button.disabled = isDisabled;
        if (isActive) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            if (currentPage !== page) {
                displayPage(page);
            }
        });
        return button;
    }

    /**
     * [MỚI] Hàm "vẽ" các nút phân trang
     */
    function setupPagination() {
        if (!paginationContainer) return;
        
        paginationContainer.innerHTML = ''; // Xóa các nút cũ
        const pageCount = Math.ceil(currentFilteredProducts.length / itemsPerPage);

        // Không hiển thị thanh phân trang nếu chỉ có 1 trang
        if (pageCount <= 1) return;

        // Nút "Prev"
        paginationContainer.appendChild(
            createPaginationButton(currentPage - 1, '«', (currentPage === 1))
        );

        // Hiển thị nút trang (Logic hiển thị dấu ... )
        const maxButtonsToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
        let endPage = Math.min(pageCount, startPage + maxButtonsToShow - 1);

        if (endPage - startPage < maxButtonsToShow - 1) {
            startPage = Math.max(1, endPage - maxButtonsToShow + 1);
        }

        // Nút '1' và '...' ở đầu
        if (startPage > 1) {
            paginationContainer.appendChild(createPaginationButton(1, '1'));
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                paginationContainer.appendChild(ellipsis);
            }
        }

        // Các nút số ở giữa
        for (let i = startPage; i <= endPage; i++) {
            paginationContainer.appendChild(
                createPaginationButton(i, i.toString(), false, i === currentPage)
            );
        }

        // Nút '...' và nút cuối
        if (endPage < pageCount) {
            if (endPage < pageCount - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                paginationContainer.appendChild(ellipsis);
            }
            paginationContainer.appendChild(createPaginationButton(pageCount, pageCount.toString()));
        }

        // Nút "Next"
        paginationContainer.appendChild(
            createPaginationButton(currentPage + 1, '»', (currentPage === pageCount))
        );
    }

    /**
     * [CẬP NHẬT] Hàm lọc sản phẩm theo thể loại
     */
    function filterProducts(category, categoryName) {
        if (typeof productDatabase === 'undefined') return; 

        if (category === 'all') {
            currentFilteredProducts = allProductsList;
            if (featuredTitle) featuredTitle.textContent = 'Tất Cả Sản Phẩm';
        } else {
            currentFilteredProducts = allProductsList.filter(product => product.category === category);
            if (featuredTitle) featuredTitle.textContent = categoryName;
        }
        
        displayPage(1); // Luôn hiển thị trang 1 sau khi lọc
    }

    // Gắn sự kiện click cho các link thể loại
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            const categoryKey = link.dataset.category;
            const categoryDisplayName = link.querySelector('.category-name').textContent;
            filterProducts(categoryKey, categoryDisplayName);
        });
    });

    // ======================================================
    // 4. LOGIC TÌM KIẾM SÁCH (Cập nhật)
    // ======================================================

    /**
     * [CẬP NHẬT] Hàm lọc và CẬP NHẬT GRID CHÍNH
     */
    function performSearch() {
        if (typeof productDatabase === 'undefined') return;
        
        const query = searchInput.value.toLowerCase().trim();
        
        if (query) {
             currentFilteredProducts = allProductsList.filter(product => {
                return product.title.toLowerCase().includes(query);
            });
             if (featuredTitle) featuredTitle.textContent = `Kết quả tìm kiếm cho "${query}"`;
        } else {
            // Nếu ô tìm kiếm trống, quay về "Tất Cả Sản Phẩm"
            currentFilteredProducts = allProductsList;
             if (featuredTitle) featuredTitle.textContent = 'Tất Cả Sản Phẩm';
        }
        
        displayPage(1); // Hiển thị trang 1 của kết quả
        
        if (searchSuggestions) searchSuggestions.style.display = 'none';
    }
    
    /**
     * Hàm HIỂN THỊ HỘP GỢI Ý (Không đổi)
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
                const thumbImageSrc = product.thumbnails[0].replace('../', 'img/'); // Sửa đường dẫn ảnh
                const suggestionHTML = `
                    <a href="html/product-detail.html?id=${product.id}" class="suggestion-item">
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

    // Gắn sự kiện tìm kiếm
    if (searchButton) {
        searchButton.addEventListener('click', (e) => {
            e.preventDefault(); 
            performSearch();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); 
                performSearch();
            }
        });
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
    // 5. KHỞI TẠO TRANG (MỚI)
    // ======================================================
    function initializeStore() {
        if (typeof productDatabase !== 'undefined' && bookGrid) {
            // Lấy tất cả sản phẩm từ database
            allProductsList = Object.values(productDatabase);
            // Ban đầu, danh sách lọc chính là danh sách đầy đủ
            currentFilteredProducts = allProductsList; 
            // Hiển thị trang đầu tiên
            displayPage(1); 
        } else {
            if (bookGrid) {
                bookGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">Lỗi: Không tải được dữ liệu sản phẩm.</p>';
            }
        }
    }

    initializeStore(); // Chạy hàm này khi tải trang

});
