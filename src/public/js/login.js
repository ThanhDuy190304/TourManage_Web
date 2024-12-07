document.addEventListener('DOMContentLoaded', function () {
    document.getElementById("loginForm").addEventListener('click', async function (event) {
        if (event.target.value === "LOGIN") {
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

                    window.location.href = '/';
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
});
