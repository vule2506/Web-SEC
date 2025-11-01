// Chờ cho toàn bộ nội dung HTML được tải xong
document.addEventListener("DOMContentLoaded", () => {

    // Kiểm tra xem biến 'productDatabase' từ file 'database.js' đã tồn tại chưa
    if (typeof productDatabase === 'undefined') {
        console.error("Lỗi: database.js chưa được tải hoặc biến 'productDatabase' không tồn tại.");
        return;
    }

    // --- TIỆN ÍCH ---
    const formatPrice = (price) => {
        if (typeof price !== 'number') {
            price = Number(price) || 0;
        }
        return price.toLocaleString('vi-VN') + ' đ';
    };

    const getElement = (id) => {
        const element = document.getElementById(id);
        if (!element) {
            console.warn(`Không tìm thấy phần tử với ID: ${id}`);
        }
        return element;
    };
    
    const updateText = (id, text) => {
        const el = getElement(id);
        if (el) el.textContent = text;
    };

    const updateMultipleText = (className, text) => {
        const elements = document.querySelectorAll(className);
        elements.forEach(el => el.textContent = text);
    };


    /**
     * CHỨC NĂNG 1: TẢI TRANG CHI TIẾT SẢN PHẨM (product-detail.html)
     */
    const productDetailLayout = document.querySelector(".product-detail-layout");
    if (productDetailLayout) {
        loadProductDetail();
    }

    /**
     * CHỨC NĂNG 2: TẢI LƯỚI SẢN PHẨM (index.html)
     * Đây là chức năng sẽ tải sách lên trang chủ
     */
    const productGrid = document.querySelector(".book-grid");
    if (productGrid) {
        loadProductGrid(productGrid);
    }


    // --- ĐỊNH NGHĨA CÁC HÀM ---

    /**
     * Hàm chạy trên 'product-detail.html'
     * (Hàm này đã đúng từ lần trước, dùng để hiển thị thumbnail)
     */
    function loadProductDetail() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');

        if (!productId) {
            productDetailLayout.innerHTML = "<h1>Không tìm thấy sản phẩm</h1>";
            return;
        }

        const product = productDatabase[productId];

        if (!product) {
            productDetailLayout.innerHTML = "<h1>Sản phẩm không tồn tại</h1>";
            return;
        }
        
        document.title = `${product.title} - Hiệu Sách SGU`;

        const mainImage = document.getElementById("main-product-image");
        if (mainImage) {
            mainImage.src = product.mainImage;
            mainImage.alt = product.title;
        }
        
        const thumbnailContainer = document.querySelector(".thumbnail-container"); 
        
        if (thumbnailContainer) {
            thumbnailContainer.innerHTML = ""; // Xóa thumbnail placeholder
            
            product.thumbnails.forEach((thumbSrc, index) => {
                const thumbImg = document.createElement('img');
                thumbImg.src = thumbSrc;
                thumbImg.alt = `Thumbnail ${index + 1}`;
                thumbImg.className = "thumbnail"; 
                
                if (index === 0) {
                    thumbImg.classList.add('active');
                }

                thumbImg.addEventListener('click', () => {
                    if (mainImage) mainImage.src = thumbSrc;
                    thumbnailContainer.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                    thumbImg.classList.add('active');
                });
                
                thumbnailContainer.appendChild(thumbImg);
            });
        }

        // Cột Phải (Thông tin)
        const updateTextByQuery = (selector, text) => {
            const el = document.querySelector(selector);
            if (el) el.textContent = text;
        };
        
        const updateHtmlByQuery = (selector, html) => {
            const el = document.querySelector(selector);
            if (el) el.innerHTML = html;
        };

        updateTextByQuery(".product-title", product.title);
        updateTextByQuery(".product-meta-grid .meta-item:nth-child(1) a", product.supplier);
        updateTextByQuery(".product-meta-grid .meta-item:nth-child(2) a", product.author);
        updateTextByQuery(".product-meta-grid .meta-item:nth-child(3) a", product.publisher);
        updateTextByQuery(".product-meta-grid .meta-item:nth-child(4) span:last-child", product.category); 
        updateTextByQuery(".review-count", `(${product.reviewCount} đánh giá)`);
        updateTextByQuery(".sold-count", `Đã bán ${product.soldCount}`);
        updateTextByQuery(".current-price", formatPrice(product.currentPrice));
        updateTextByQuery(".old-price", formatPrice(product.oldPrice));
        updateTextByQuery(".discount-badge", `-${Math.round(product.discount)}%`);

        const addToCartBtn = document.querySelector(".add-to-cart-main");
        if (addToCartBtn) {
            addToCartBtn.dataset.id = product.id;
            addToCartBtn.dataset.name = product.title;
            addToCartBtn.dataset.price = product.currentPrice;
            addToCartBtn.dataset.image = product.mainImage;
        }

        updateTextByQuery(".spec-table .spec-row:nth-child(1) .spec-value", product.sku);
        updateTextByQuery(".spec-table .spec-row:nth-child(2) .spec-value", product.releaseDate);
        updateTextByQuery(".spec-table .spec-row:nth-child(3) .spec-value", product.supplier);
        updateTextByQuery(".spec-table .spec-row:nth-child(4) .spec-value", product.author);
        updateTextByQuery(".spec-table .spec-row:nth-child(5) .spec-value", product.publisher);
        updateTextByQuery(".spec-table .spec-row:nth-child(6) .spec-value", product.year);
        updateTextByQuery(".spec-table .spec-row:nth-child(7) .spec-value", product.pages);
        updateTextByQuery(".spec-table .spec-row:nth-child(8) .spec-value", product.binding);
        updateHtmlByQuery(".product-description", `<h2>Mô tả sản phẩm</h2>${product.description}`);
    }


    /**
     * [ĐÃ SỬA] Hàm này chạy trên 'index.html'.
     * Đã thêm lại các biến mainImageSrc, thumbImageSrc
     * và cấu trúc HTML mới để căn chỉnh thẻ.
     */
    function loadProductGrid(gridContainer) {
        gridContainer.innerHTML = ""; 

        for (const productId in productDatabase) {
            const product = productDatabase[productId];
            
            // [SỬA LỖI] Đây là 2 biến bị thiếu mà tôi quên không bảo bạn thêm vào
            const thumbImageSrc = product.thumbnails[0].replace('../', 'img/book/');

            // Cấu trúc HTML mới để căn chỉnh
            const cardHTML = `
                <div class="book-card">
                    <a href="html/product-detail.html?id=${product.id}" class="book-card-image-link">
                        <img src="${product.mainImage}" alt="${product.title}">
                    </a>
                    
                    <div class="book-card-details">
                        <h3>
                            <a href="html/product-detail.html?id=${product.id}">${product.title}</a>
                        </h3>
                        <p class="author">${product.author}</p>
                        <p class="price">${formatPrice(product.currentPrice)}</p>

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
            gridContainer.innerHTML += cardHTML;
        }
    }

});