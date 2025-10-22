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
    // 2. LOGIC THÊM VÀO GIỎ (MỚI)
    // ======================================================
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const product = {
                id: button.dataset.id,
                name: button.dataset.name,
                price: parseInt(button.dataset.price),
                image: button.dataset.image
            };
            
            // Gọi hàm toàn cục từ main.js
            if (window.addProductToCart) {
                window.addProductToCart(product, 1); // Thêm 1 sản phẩm
            }
        });
    });
});