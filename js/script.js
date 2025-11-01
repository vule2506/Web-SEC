/* NỘI DUNG MỚI CHO Web-SEC/js/script.js */

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
    
    let allProductsList = []; 
    let currentFilteredProducts = []; 
    let currentPage = 1;
    const itemsPerPage = 20; 
    const formatter = new Intl.NumberFormat('vi-VN'); 

    const bookGrid = document.getElementById('main-book-grid');
    const categoryLinks = document.querySelectorAll('.category-bar-item[data-category]');
    const featuredTitle = document.getElementById('featured-books-title');
    const paginationContainer = document.getElementById('pagination-container');
    const searchInput = document.getElementById('search-input'); // Vẫn cần
    const searchButton = document.getElementById('search-button'); // Vẫn cần

    /**
     * Hàm "vẽ" 20 cuốn sách ra grid (Đã sửa lỗi ảnh từ lần trước)
     */
    function renderProductGrid(productsToDisplay) {
        if (!bookGrid) return;
        
        bookGrid.innerHTML = ''; 
        
        if (productsToDisplay.length === 0) {
            bookGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">Không tìm thấy sản phẩm nào phù hợp.</p>';
            return;
        }
        
        productsToDisplay.forEach(product => {
            const mainImageSrc = product.mainImage.replace('../', '');

            const productHTML = `
                <div class="book-card">
                    <a href="html/product-detail.html?id=${product.id}" class="book-card-image-link">
                        <img src="${mainImageSrc}" alt="${product.title}">
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
                            data-image="${mainImageSrc}">
                            Thêm vào giỏ
                        </a>
                    </div>
                </div>
            `;
            bookGrid.insertAdjacentHTML('beforeend', productHTML);
        });
    }

    /**
     * Hàm hiển thị một trang cụ thể (Không đổi)
     */
    function displayPage(page) {
        if (typeof productDatabase === 'undefined' || !bookGrid) return;
        
        currentPage = page;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const productsForThisPage = currentFilteredProducts.slice(startIndex, endIndex);
        
        renderProductGrid(productsForThisPage);
        setupPagination(); 
        
        if (featuredTitle) {
             featuredTitle.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * Hàm tạo nút phân trang (Không đổi)
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
     * Hàm "vẽ" các nút phân trang (Không đổi)
     */
    function setupPagination() {
        if (!paginationContainer) return;
        
        paginationContainer.innerHTML = ''; 
        const pageCount = Math.ceil(currentFilteredProducts.length / itemsPerPage);

        if (pageCount <= 1) return;

        paginationContainer.appendChild(
            createPaginationButton(currentPage - 1, '«', (currentPage === 1))
        );

        const maxButtonsToShow = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
        let endPage = Math.min(pageCount, startPage + maxButtonsToShow - 1);

        if (endPage - startPage < maxButtonsToShow - 1) {
            startPage = Math.max(1, endPage - maxButtonsToShow + 1);
        }

        if (startPage > 1) {
            paginationContainer.appendChild(createPaginationButton(1, '1'));
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                paginationContainer.appendChild(ellipsis);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationContainer.appendChild(
                createPaginationButton(i, i.toString(), false, i === currentPage)
            );
        }

        if (endPage < pageCount) {
            if (endPage < pageCount - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                paginationContainer.appendChild(ellipsis);
            }
            paginationContainer.appendChild(createPaginationButton(pageCount, pageCount.toString()));
        }

        paginationContainer.appendChild(
            createPaginationButton(currentPage + 1, '»', (currentPage === pageCount))
        );
    }

    /**
     * Hàm lọc sản phẩm theo thể loại (Không đổi)
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
        
        displayPage(1); 
    }

    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); 
            const categoryKey = link.dataset.category;
            const categoryDisplayName = link.querySelector('.category-name').textContent;
            filterProducts(categoryKey, categoryDisplayName);
        });
    });

    // ======================================================
    // 4. LOGIC TÌM KIẾM TRANG CHỦ (ĐÃ DỌN DẸP)
    // ======================================================

    /**
     * Hàm này chỉ chạy ở index.html để LỌC GRID
     * (main.js sẽ xử lý chuyển hướng)
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
        
        // Ẩn gợi ý (hàm này của main.js, nhưng gọi ở đây cũng được)
        const searchSuggestions = document.getElementById('search-suggestions');
        if (searchSuggestions) searchSuggestions.style.display = 'none';
    }
    
    // Gắn sự kiện TÌM KIẾM CỤC BỘ (chỉ cho index.html)
    // Nó sẽ ghi đè sự kiện 'redirectToSearch' trong main.js,
    // và đó CHÍNH LÀ điều chúng ta muốn.
    if (searchButton) {
        searchButton.addEventListener('click', (e) => {
            e.preventDefault(); // Ngăn main.js chuyển hướng
            e.stopPropagation(); // Ngăn main.js chạy
            performSearch(); // Chạy hàm lọc grid
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Ngăn main.js chuyển hướng
                e.stopPropagation(); // Ngăn main.js chạy
                performSearch(); // Chạy hàm lọc grid
            }
        });
        // Không cần addEventListener 'input' ở đây, main.js đã làm
    }

    // ======================================================
    // 5. KHỞI TẠO TRANG (ĐÃ CẬP NHẬT)
    // ======================================================
    function initializeStore() {
        if (typeof productDatabase !== 'undefined' && bookGrid) {
            allProductsList = Object.values(productDatabase); 
            currentFilteredProducts = allProductsList; 
            
            // [MỚI] KIỂM TRA TÌM KIẾM TỪ URL
            const urlParams = new URLSearchParams(window.location.search);
            const searchQuery = urlParams.get('search');
            
            if (searchQuery) {
                searchInput.value = searchQuery; // Điền vào ô tìm kiếm
                performSearch(); // Lọc ngay lập tức
            } else {
                displayPage(1); // Tải trang 1 bình thường
            }
            
        } else {
            if (bookGrid) {
                bookGrid.innerHTML = '<p style="text-align: center; grid-column: 1 / -1;">Lỗi: Không tải được dữ liệu sản phẩm.</p>';
            }
        }
    }

    initializeStore(); // Chạy hàm này khi tải trang

});