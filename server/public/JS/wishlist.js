document.addEventListener('DOMContentLoaded', function() {
    let wishlistCount = localStorage.getItem('wishlistCount') || 0;
    updateWishlistCount(wishlistCount);

    const wishlistIcon = document.querySelector('.wishlist-icon');
    if (wishlistIcon) {
        wishlistIcon.addEventListener('click', function() {
            wishlistCount++;
            localStorage.setItem('wishlistCount', wishlistCount);
            updateWishlistCount(wishlistCount);
        });
    }
});

function updateWishlistCount(count) {
    const wishlistCountElement = document.querySelector('.wishlist-count');
    if (wishlistCountElement) {
        wishlistCountElement.textContent = count;
    }
}