document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");

    registerForm.addEventListener('keypress', async function (event) {
        if (event.key === "Enter") {
            await handleRegister();
        }
    });
    registerForm.addEventListener('click', async function (event) {
        if (event.target.value === "SIGN UP") {
            await handleRegister();
        }
    });

    async function handleRegister() {
        const userNameInput = document.querySelector('input[name="username"]');
        const emailInput = document.querySelector('input[name="email"]');
        const passwordInput = document.querySelector('input[name="password"]');
        const confirmPasswordInput = document.querySelector('input[name="confirmPassword"]');
        const messageDiv = document.getElementById('message');
        messageDiv.innerHTML = '';

        const userName = userNameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (!userName || !email || !password || !confirmPassword) {
            messageDiv.innerHTML = '<p style="color: #b20000;">Please fill in all fields!</p>';
            return;
        }

        if (password !== confirmPassword) {
            messageDiv.innerHTML = '<p style="color: #b20000;">Confirmation password does not match.</p>';
            return;
        }

        try {
            const response = await fetch('/register/postRegister', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userName, email, password, confirmPassword })
            });

            const data = await response.json();
            if (response.ok) {
                const message = data.message || 'Registration successful, please check your email for verifying!';
                messageDiv.innerHTML = `<p style="color: #009900;">${message}</p>`;
            } else {
                messageDiv.innerHTML = `<p style="color: #b20000;">${data.message || 'Registration failed'}</p>`;
            }
        } catch (error) {
            console.error('Error during registration:', error);
            messageDiv.innerHTML = '<p style="color: #b20000;">An error occurred, please try again later.</p>';
        }
    }
});
