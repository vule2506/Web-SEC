// Script này sẽ chạy ngay khi trang chi tiết sản phẩm được tải
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Lấy ID sản phẩm từ URL
    // Ví dụ URL: .../product.html?id=SPALCH
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // 2. Tìm sản phẩm trong "database" (từ tệp database.js)
    // productDatabase được định nghĩa trong tệp database.js
    const product = productDatabase[productId];

    // 3. Kiểm tra xem có tìm thấy sản phẩm không
    if (product) {
        // Nếu tìm thấy, gọi hàm để điền thông tin lên trang
        populateProductData(product);
    } else {
        // Nếu không tìm thấy ID hoặc ID không có trong database
        // Hiển thị thông báo lỗi
        document.querySelector('.product-page-main .container').innerHTML = '<h1>Sản phẩm không tồn tại</h1><p>Vui lòng quay lại trang chủ.</p>';
    }
});

/**
 * Hàm này nhận một đối tượng (object) sản phẩm và
 * cập nhật nội dung của trang HTML.
 */
function populateProductData(product) {
    
    // Định dạng tiền tệ
    const formatter = new Intl.NumberFormat('vi-VN');

    // --- Thông tin chung (Cột phải) ---
    document.querySelector('.product-title').textContent = product.title;
    document.querySelector('.meta-item:nth-child(1) a').textContent = product.supplier;
    document.querySelector('.meta-item:nth-child(2) a').textContent = product.author;
    document.querySelector('.meta-item:nth-child(3) a').textContent = product.publisher;
    document.querySelector('.meta-item:nth-child(4) span:last-child').textContent = product.binding;

    document.querySelector('.review-count').textContent = `(${product.reviewCount} đánh giá)`;
    document.querySelector('.sold-count').textContent = `Đã bán ${product.soldCount}`;

    document.querySelector('.current-price').textContent = formatter.format(product.currentPrice) + ' đ';
    document.querySelector('.old-price').textContent = formatter.format(product.oldPrice) + ' đ';
    document.querySelector('.discount-badge').textContent = `-${product.discount}%`;

    // --- Hình ảnh (Cột trái) ---
    const mainImage = document.getElementById('main-product-image');
    mainImage.src = product.mainImage;
    mainImage.alt = product.title;

    const thumbnailContainer = document.querySelector('.thumbnail-container');
    thumbnailContainer.innerHTML = ''; // Xóa các ảnh thumbnail cũ
    product.thumbnails.forEach((thumbSrc, index) => {
        const img = document.createElement('img');
        img.src = thumbSrc;
        img.alt = `Thumbnail ${index + 1}`;
        img.classList.add('thumbnail');
        if (index === 0) {
            img.classList.add('active'); // Đặt ảnh đầu tiên là active
        }
        thumbnailContainer.appendChild(img);
    });

    // --- Nút Thêm vào giỏ ---
    // Cập nhật data-attributes để script giỏ hàng (product-script.js) hoạt động đúng
    const addToCartBtn = document.querySelector('.add-to-cart-main');
    addToCartBtn.dataset.id = product.id;
    addToCartBtn.dataset.name = product.title;
    addToCartBtn.dataset.price = product.currentPrice;
    addToCartBtn.dataset.image = product.thumbnails[0]; // Lấy ảnh thumbnail đầu tiên

    // --- Thông tin chi tiết (Bảng) ---
    document.querySelector('.spec-row:nth-child(1) .spec-value').textContent = product.sku;
    document.querySelector('.spec-row:nth-child(2) .spec-value').textContent = product.releaseDate;
    document.querySelector('.spec-row:nth-child(3) .spec-value').textContent = product.supplier;
    document.querySelector('.spec-row:nth-child(4) .spec-value').textContent = product.author;
    document.querySelector('.spec-row:nth-child(5) .spec-value').textContent = product.publisher;
    document.querySelector('.spec-row:nth-child(6) .spec-value').textContent = product.year;
    document.querySelector('.spec-row:nth-child(7) .spec-value').textContent = product.pages;
    document.querySelector('.spec-row:nth-child(8) .spec-value').textContent = product.binding;

    // --- Mô tả sản phẩm ---
    const descriptionBox = document.querySelector('.product-description');
    // Xóa các thẻ <p> mô tả cũ
    descriptionBox.querySelectorAll('p').forEach(p => p.remove()); 
    
    // Tách mô tả từ database thành các đoạn (dựa trên \n\n)
    const paragraphs = product.description.split('\n\n');
    paragraphs.forEach(text => {
        const p = document.createElement('p');
        p.textContent = text;
        descriptionBox.appendChild(p);
    });
}