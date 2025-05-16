var navbar = document.querySelector(".navbar");
var company = document.querySelector(".company");

window.onscroll = function () {
    if (window.scrollY > 50) {
        company.style.fontSize = "25px";
        navbar.style.height = "80px";
        navbar.style.padding = "10px 20px";
    } else {
        company.style.fontSize = "30px";
        navbar.style.height = "100px";
        navbar.style.padding = "15px 20px";
    }
}
document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());
    
    try {
        const response = await fetch('/api/contact-us', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            document.getElementById('successMessage').style.display = 'block';
            this.reset();
            window.scrollTo(0, 0);
            setTimeout(function() {
                document.getElementById('successMessage').style.display = 'none';
            }, 5000);
        } else {
            alert('Error submitting contact form. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting contact form. Please try again.');
    }
});