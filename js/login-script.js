document.addEventListener('DOMContentLoaded', () => {

    // --- Xử lý chuyển đổi giữa form Đăng nhập và Đăng ký ---
    const toRegisterBtn = document.getElementById('to-register-btn');
    const toLoginBtn = document.getElementById('to-login-btn');
    const loginFormContainer = document.getElementById('login-form-container');
    const registerFormContainer = document.getElementById('register-form-container');
    const loginPanel = document.getElementById('login-panel');
    const registerPanel = document.getElementById('register-panel');

    toRegisterBtn.addEventListener('click', () => {
        loginFormContainer.classList.add('hidden');
        registerFormContainer.classList.remove('hidden');
        loginPanel.classList.add('hidden');
        registerPanel.classList.remove('hidden');
    });

    toLoginBtn.addEventListener('click', () => {
        loginFormContainer.classList.remove('hidden');
        registerFormContainer.classList.add('hidden');
        loginPanel.classList.remove('hidden');
        registerPanel.classList.add('hidden');
    });

    // ======================================================
    // LOGIC ĐĂNG KÝ VÀ ĐĂNG NHẬP VỚI LOCALSTORAGE
    // ======================================================

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Lấy danh sách người dùng từ localStorage hoặc tạo mảng rỗng
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // --- XỬ LÝ ĐĂNG KÝ ---
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = registerForm.querySelector('input[placeholder*="tài khoản"]').value;
        const email = registerForm.querySelector('input[type="email"]').value;
        const password = registerForm.querySelector('input[placeholder*="mật khẩu"]').value;

        // Kiểm tra xem tên người dùng đã tồn tại chưa
        const userExists = users.some(user => user.username === username);

        if (userExists) {
            alert('Tên tài khoản đã tồn tại. Vui lòng chọn tên khác.');
            return;
        }
        
        // Thêm người dùng mới vào danh sách
        users.push({ username, email, password });
        // Lưu danh sách người dùng mới vào localStorage
        localStorage.setItem('users', JSON.stringify(users));

        alert('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
        toLoginBtn.click();
        registerForm.reset();
    });

    // --- XỬ LÝ ĐĂNG NHẬP ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = loginForm.querySelector('input[placeholder*="tài khoản"]').value;
        const password = loginForm.querySelector('input[placeholder*="mật khẩu"]').value;

        // Tìm người dùng trong danh sách
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            // Lưu thông tin người dùng đang đăng nhập vào sessionStorage
            sessionStorage.setItem('loggedInUser', JSON.stringify(user));
            alert('Đăng nhập thành công!');
            // Chuyển hướng về trang chủ
            window.location.href = '../index.html';
        } else {
            alert('Tên tài khoản hoặc mật khẩu không chính xác.');
        }
    });

    // --- XỬ LÝ ẨN/HIỆN MẬT KHẨU ---
    const togglePasswordIcons = document.querySelectorAll('.toggle-password');
    togglePasswordIcons.forEach(icon => {
        icon.addEventListener('click', function () {
            const passwordInput = this.previousElementSibling;
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye-slash');
            this.classList.toggle('fa-eye');
        });
    });

    // --- LOGIC QUÊN MẬT KHẨU ---
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const closeModalBtn = forgotPasswordModal.querySelector('.close-btn');

    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        forgotPasswordModal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
        forgotPasswordModal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target == forgotPasswordModal) {
            forgotPasswordModal.classList.remove('active');
        }
    });

    forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = forgotPasswordForm.querySelector('#forgot-email').value;
        
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        const foundUser = storedUsers.find(user => user.email === email);

        if (foundUser) {
            alert(`Tìm thấy tài khoản! Mật khẩu của bạn là: ${foundUser.password}`);
            forgotPasswordModal.classList.remove('active');
        } else {
            alert('Không tìm thấy tài khoản nào được đăng ký với email này.');
        }
        forgotPasswordForm.reset();
    });
});