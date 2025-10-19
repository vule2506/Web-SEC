document.addEventListener('DOMContentLoaded', () => {
    // ======================================================
    // KIỂM TRA VÀ CẬP NHẬT TRẠNG THÁI ĐĂNG NHẬP
    // ======================================================
    const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    const accountLink = document.getElementById('account-link');

    if (loggedInUser && accountLink) {
        const userAccountDiv = document.createElement('div');
        userAccountDiv.className = 'action-item user-account';
        userAccountDiv.innerHTML = `
            <i class="far fa-user-circle"></i>
            <span class="welcome-text">${loggedInUser.username}</span>
            <div class="user-dropdown-menu">
                <div class="dropdown-header">
                     <div class="user-avatar-dropdown">
                        <i class="fas fa-crown"></i>
                     </div>
                     <div class="user-info-dropdown">
                        <span class="dropdown-username">${loggedInUser.username}</span>
                        <span class="user-level">Thành viên</span>
                    </div>
                </div>
                <a href="#" class="dropdown-item">
                    <i class="fas fa-box"></i>
                    <span>Đơn hàng của tôi</span>
                </a>
                <a href="#" id="logout-btn" class="dropdown-item logout-item">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Thoát tài khoản</span>
                </a>
            </div>
        `;

        accountLink.parentNode.replaceChild(userAccountDiv, accountLink);

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                sessionStorage.removeItem('loggedInUser');
                alert('Bạn đã đăng xuất.');
                window.location.href = window.location.pathname.includes('index.html') ? 'index.html' : '../index.html';
            });
        }
    }
});