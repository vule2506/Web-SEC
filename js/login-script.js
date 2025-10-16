// --- Xử lý chuyển đổi giữa form Đăng nhập và Đăng ký ---
const toRegisterBtn = document.getElementById('to-register-btn');
const toLoginBtn = document.getElementById('to-login-btn');

const loginForm = document.getElementById('login-form-container');
const registerForm = document.getElementById('register-form-container');
const loginPanel = document.getElementById('login-panel');
const registerPanel = document.getElementById('register-panel');

toRegisterBtn.addEventListener('click', () => {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    loginPanel.classList.add('hidden');
    registerPanel.classList.remove('hidden');
});

toLoginBtn.addEventListener('click', () => {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    loginPanel.classList.remove('hidden');
    registerPanel.classList.add('hidden');
});


// --- Xử lý tính năng ẩn/hiện mật khẩu ---
const togglePasswordIcons = document.querySelectorAll('.toggle-password');

togglePasswordIcons.forEach(icon => {
    icon.addEventListener('click', function () {
        const passwordInput = this.parentElement.querySelector('input');
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        this.classList.toggle('fa-eye-slash');
        this.classList.toggle('fa-eye');
    });
});