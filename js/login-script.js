document.addEventListener('DOMContentLoaded', () => {

    // --- Switch between Login and Register forms ---
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
    // REGISTRATION AND LOGIN LOGIC WITH LOCALSTORAGE
    // ======================================================

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Get user list from localStorage or create an empty array
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // --- REGISTRATION LOGIC ---
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = registerForm.querySelector('input[placeholder*="tài khoản"]').value;
        const email = registerForm.querySelector('input[type="email"]').value;
        // Select all password fields within the registration form
        const passwordFields = registerForm.querySelectorAll('input[type="password"]');
        const password = passwordFields[0].value;
        const confirmPassword = passwordFields[1].value;

        // Check if passwords match
        if (password !== confirmPassword) {
            alert('Mật khẩu nhập lại không khớp. Vui lòng thử lại.');
            return;
        }

        // Check if username already exists
        const userExists = users.some(user => user.username === username);

        if (userExists) {
            alert('Tên tài khoản đã tồn tại. Vui lòng chọn tên khác.');
            return;
        }
        
        // Add new user to the list
        users.push({ username, email, password });
        // Save the updated user list to localStorage
        localStorage.setItem('users', JSON.stringify(users));

        alert('Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.');
        toLoginBtn.click(); // Switch to login form
        registerForm.reset();
    });

    // --- LOGIN LOGIC ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = loginForm.querySelector('input[placeholder*="tài khoản"]').value;
        const password = loginForm.querySelector('input[type="password"]').value;

        // Find the user in the list
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            // Save logged-in user info to sessionStorage
            sessionStorage.setItem('loggedInUser', JSON.stringify(user));
            alert('Đăng nhập thành công!');
            // Redirect to homepage
            window.location.href = '../index.html';
        } else {
            alert('Tên tài khoản hoặc mật khẩu không chính xác.');
        }
    });

    // --- PASSWORD VISIBILITY TOGGLE ---
    const togglePasswordIcons = document.querySelectorAll('.toggle-password');
    togglePasswordIcons.forEach(icon => {
        icon.addEventListener('click', function () {
            // Find the password input field right before the icon
            const passwordInput = this.previousElementSibling; 
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle the eye icon
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });

    // --- FORGOT PASSWORD LOGIC ---
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    const forgotPasswordLink = document.getElementById('forgot-password-link');
    const forgotPasswordForm = document.getElementById('forgot-password-form');
    const closeModalBtn = forgotPasswordModal.querySelector('.close-btn');

    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        forgotPasswordModal.style.display = 'flex'; // Use style to show
    });

    const closeModal = () => {
        forgotPasswordModal.style.display = 'none'; // Use style to hide
    }

    closeModalBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if (e.target == forgotPasswordModal) {
            closeModal();
        }
    });

    forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = forgotPasswordForm.querySelector('#forgot-email').value;
        
        const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
        const foundUser = storedUsers.find(user => user.email === email);

        if (foundUser) {
            // SECURITY WARNING: This is not safe for a real website!
            // Never show a user's password directly.
            alert(`Tìm thấy tài khoản! Mật khẩu của bạn là: ${foundUser.password}\n(Lưu ý: Chức năng này không an toàn cho website thực tế.)`);
            closeModal();
        } else {
            alert('Không tìm thấy tài khoản nào được đăng ký với email này.');
        }
        forgotPasswordForm.reset();
    });
});