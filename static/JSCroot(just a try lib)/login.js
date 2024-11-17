// Import the JSCroot library
import * as JSCroot from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.1/api.js';

document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('login-btn'); // Selector for login button
    const emailInput = document.getElementById('email'); // Selector for email input
    const passwordInput = document.getElementById('password');

    loginButton.addEventListener('click', async function (event) {
        event.preventDefault(); // Prevent default form submission

        const email = emailInput.value; // Get email input value
        const password = passwordInput.value;

        if (!email || !password) {
            alert('Please complete all fields');
            return;
        }

        const data = {
            email: email,
            password: password,
        };

        try {
            const response = await JSCroot.post('http://localhost:8081/login', {
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result);
                alert('Login successful!');
                window.location.href = 'index.html'; // Redirect on success
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Login failed. Check your email and password.');
        }
    });
});
