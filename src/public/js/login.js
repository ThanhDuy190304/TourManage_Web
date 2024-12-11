document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById("loginForm");

    // Xử lý khi click nút LOGIN
    loginForm.addEventListener('click', async function (event) {
        if (event.target.value === "LOGIN") {
            await handleLogin();
        }
    });

    // Xử lý khi nhấn Enter trong ô nhập liệu
    loginForm.addEventListener('keypress', async function (event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Ngăn form submit mặc định
            await handleLogin();
        }
    });

    async function handleLogin() {
        const usernameInput = document.querySelector('input[name="Username_Email"]');
        const passwordInput = document.querySelector('input[name="password"]');
        const usernameEmail = usernameInput.value;
        const password = passwordInput.value;
        const errorMessageElement = document.getElementById('errorMessage'); // Vùng hiển thị lỗi
        errorMessageElement.textContent = '';

        // Kiểm tra input
        if (!usernameEmail) {
            usernameInput.setCustomValidity("Please enter your Username or Email!");
            usernameInput.reportValidity();
            return;
        } else {
            usernameInput.setCustomValidity("");
        }

        if (!password) {
            passwordInput.setCustomValidity("Please enter your password!");
            passwordInput.reportValidity();
            return;
        } else {
            passwordInput.setCustomValidity("");
        }

        const cartDataArray = JSON.parse(localStorage.getItem('cartDataArray')) || [];

        // Gửi yêu cầu tới server
        try {
            const response = await fetch('/login/postLogin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Username_Email: usernameEmail,
                    password: password,
                    cartDataArray: cartDataArray,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                const countItem = data.countItem;

                localStorage.removeItem('cartDataArray');

                localStorage.setItem('countCartItem', countItem);
                const returnTo = sessionStorage.getItem('returnTo');

                if (returnTo) {
                    window.location.href = returnTo;
                    sessionStorage.removeItem('returnTo');
                } else {
                    window.location.href = '/';
                }

            } else {
                const error = await response.json();
                errorMessageElement.textContent = error.message || 'Login failed. Please try again.';
            }
        } catch (err) {
            console.error('Error during login:', err);
            errorMessageElement.textContent = 'An unexpected error occurred. Please try again later.';
        }
    }
});
