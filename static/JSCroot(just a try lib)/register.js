// Import the JSCroot library (assuming you are using it as an ES module)
import * as JSCroot from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.1/api.js';

// Event listener for form submit
document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent form from submitting the default way

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const umkmName = document.getElementById('umkm_name').value;

    // Create an object to send to the backend
    const data = {
        name: name,
        email: email,
        password: password,
        umkm_name: umkmName
    };

    try {
        // Replace fetch with JSCroot's post request function
        const response = await JSCroot.post('http://localhost:8081/register', {
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        // Check server response
        if (response.ok) {
            const result = await response.json();
            alert('Registration successful!');
            console.log(result);
            // Redirect or do something after success
        } else {
            const error = await response.json();
            alert('Registration failed: ' + error.message);
            console.error(error);
        }
    } catch (err) {
        alert('Error occurred: ' + err.message);
        console.error(err);
    }
});

// Event listener for "Back to main menu" button
document.getElementById('back-btn').addEventListener('click', function (e) {
    e.preventDefault(); // Prevent default button behavior
    window.location.href = 'LP.html'; // Redirect to LP.html
});
