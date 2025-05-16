document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = e.target.email.value;
  const password = e.target.password.value;

  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUser', JSON.stringify({name: 'User Name', }));
      document.getElementById('successMessage').style.display = 'block';
      setTimeout(() => {
        window.location.href = '/restaurant';
      }, 2000);
    } else {
      document.getElementById('errorMessage').style.display = 'block';
      setTimeout(() => {
        document.getElementById('errorMessage').style.display = 'none';
      }, 2000);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred. Please try again.');
  }
});
