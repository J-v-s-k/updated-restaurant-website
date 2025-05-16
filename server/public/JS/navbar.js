
function checkLoginStatus() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const accountIcon = document.querySelector('.account-icon');
    const userNameElement = document.getElementById('user-name');
    
    if (user) {
        accountIcon.classList.add('logged-in');
        userNameElement.textContent = `Hello, ${user.name}`;
    } else {
        accountIcon.classList.remove('logged-in');
        userNameElement.textContent = '';
    }
}


function logout() {
    localStorage.removeItem('currentUser');
    showMessage('Logout successful');
    setTimeout(() => {
        window.location.href = '/restaurant';
    }, 2000);
}


function showMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.position = 'fixed';
    messageElement.style.top = '20px';
    messageElement.style.left = '50%';
    messageElement.style.transform = 'translateX(-50%)';
    messageElement.style.backgroundColor = '#4CAF50';
    messageElement.style.color = 'white';
    messageElement.style.padding = '15px';
    messageElement.style.borderRadius = '5px';
    messageElement.style.zIndex = '1000';
    document.body.appendChild(messageElement);

    setTimeout(() => {
        document.body.removeChild(messageElement);
    }, 3000);
}


window.addEventListener('load', checkLoginStatus);