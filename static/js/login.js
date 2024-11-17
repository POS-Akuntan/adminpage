document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.getElementById('login-btn'); // Ganti selector tombol login
    const emailInput = document.getElementById('email'); // Ganti selector untuk email
    const passwordInput = document.getElementById('password');

    loginButton.addEventListener('click', function (event) {
        event.preventDefault(); // Mencegah pengiriman form secara default
        const email = emailInput.value; // Ambil nilai dari input email
        const password = passwordInput.value;

        if (!email || !password) {
            alert('Please complete all fields');
            return;
        }

        const data = {
            email: email, // Ganti username dengan email
            password: password,
        };

        fetch('http://localhost:8081/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Login failed');
            }
            return response.json();
        })
        .then(result => {
            console.log(result);
            alert('Login successful!');
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Login failed. Check your email and password.');
        });
    });
});
