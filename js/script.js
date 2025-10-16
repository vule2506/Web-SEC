let slideIndex = 0;
        let slideInterval;
        let slides;
        let dots;
        /**
         * Hàm hiển thị slide theo index
         * @param {number} n - Chỉ mục của slide cần hiển thị
         */
        function showSlides(n) {
            if (!slides || !dots) return;

            // Xử lý vòng lặp slide
            if (n >= slides.length) {
                slideIndex = 0;
            } else if (n < 0) {
                slideIndex = slides.length - 1;
            } else {
                slideIndex = n;
            }

            // Ẩn tất cả slides và xóa trạng thái active của dots
            for (let i = 0; i < slides.length; i++) {
                slides[i].classList.remove('active');
                dots[i].classList.remove('active');
            }

            // Hiển thị slide và dot hiện tại
            slides[slideIndex].classList.add('active');
            dots[slideIndex].classList.add('active');
        }

        /**
         * Hàm chuyển slide tiến/lùi
         * @param {number} n - 1 cho tiến, -1 cho lùi
         */
        function changeSlide(n) {
            // Dừng interval tự động khi người dùng tương tác
            clearInterval(slideInterval);
            
            showSlides(slideIndex + n);
            
            // Khởi động lại interval sau khi chuyển slide
            startAutoSlide();
        }

        /**
         * Hàm chuyển đến slide cụ thể khi click dot
         * @param {number} n - Chỉ mục của slide
         */
        function currentSlide(n) {
            // Dừng interval tự động khi người dùng tương tác
            clearInterval(slideInterval);
            
            showSlides(n);
            
            // Khởi động lại interval sau khi chuyển slide
            startAutoSlide();
        }
        
        /**
         * Khởi động tính năng tự động chuyển slide (mỗi 0.5 giây)
         */
        function startAutoSlide() {
            // Xóa interval cũ trước khi tạo cái mới
            if (slideInterval) {
                clearInterval(slideInterval);
            }
            // Thiết lập interval mới: chuyển slide tiến 1 bước sau mỗi 500ms (0.5s)
            slideInterval = setInterval(() => {
                showSlides(slideIndex + 1);
            }, 500); 
        }

        // Khởi tạo slider khi DOM đã tải xong
        document.addEventListener('DOMContentLoaded', () => {
            slides = document.querySelectorAll('.slides .slide');
            dots = document.querySelectorAll('.dots-container .dot');
            if (slides.length > 0) {
                showSlides(slideIndex); 
                startAutoSlide(); 
            }
        });