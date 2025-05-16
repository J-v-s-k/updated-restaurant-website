document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cateringForm');
    const successMessage = document.getElementById('successMessage');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        successMessage.style.display = 'block';
        window.scrollTo(0, 0);
        setTimeout(function() {
            successMessage.style.display = 'none';
        }, 5000);
        form.reset();
    });
});