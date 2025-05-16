document.addEventListener('DOMContentLoaded', function() {
    const accountIcon = document.getElementById('accountIcon');
    const accountDropdown = document.getElementById('accountDropdown');
    const accountName = document.getElementById('accountName');
    const logoutButton = document.getElementById('logoutButton');

    function checkAuthStatus() {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('/api/verify-token', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.valid) {
                    updateUIForLoggedInUser(data.username);
                } else {
                    throw new Error('Invalid token');
                }
            })
            .catch(error => {
                // console.error('Error:', error);
                localStorage.removeItem('token');
                updateUIForLoggedOutUser();
            });
        } else {
            updateUIForLoggedOutUser();
        }
    }

    function updateUIForLoggedInUser(username) {
        accountName.textContent = username;
        accountDropdown.style.display = 'none';
        accountIcon.onclick = toggleDropdown;
    }

    function updateUIForLoggedOutUser() {
        accountDropdown.style.display = 'none';
        accountIcon.onclick = redirectToLogin;
    }

    function toggleDropdown(e) {
        e.preventDefault();
        accountDropdown.style.display = accountDropdown.style.display === 'none' ? 'block' : 'none';
    }

    function redirectToLogin(e) {
        e.preventDefault();
        window.location.href = '/login';
    }

    logoutButton.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('token');
        updateUIForLoggedOutUser();
        window.location.href = '/';
    });

    window.addEventListener('click', function(e) {
        if (!accountIcon.contains(e.target) && !accountDropdown.contains(e.target)) {
            accountDropdown.style.display = 'none';
        }
    });

    checkAuthStatus();
});