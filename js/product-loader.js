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

    /**
     * CHỨC NĂNG 1: TẢI TRANG CHI TIẾT SẢN PHẨM (product-detail.html)
     */
    const productDetailLayout = document.querySelector(".product-detail-layout");
    if (productDetailLayout) {
        loadProductDetail();
    }

    // --- ĐỊNH NGHĨA HÀM ---

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

    // ĐÃ XÓA LOGIC loadProductGrid() KHỎI ĐÂY
    // script.js sẽ xử lý việc này
});
