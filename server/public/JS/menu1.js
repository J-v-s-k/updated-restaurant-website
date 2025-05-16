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
let currentCategory = 'ALL';
let currentDietType = 'ALL';
let currentTimeSort = 'ALL';

function applyFixedDiscounts() {
    const cards = document.querySelectorAll('.card');
    const fixedDiscountPercent = 20;

    cards.forEach(card => {
        const priceElement = card.querySelector('p:nth-of-type(1)');
        const originalPriceSpan = priceElement.querySelector('.original-price');
        const discountedPriceSpan = priceElement.querySelector('.discounted-price');

        if (originalPriceSpan && discountedPriceSpan) {
            const originalPrice = parseFloat(originalPriceSpan.textContent.replace('₹', ''));
            const discountedPrice = Math.round(originalPrice * (100 - fixedDiscountPercent) / 100);

            originalPriceSpan.style.textDecoration = 'line-through';
            originalPriceSpan.style.color = '#888';
            discountedPriceSpan.textContent = `₹${discountedPrice}`;
            discountedPriceSpan.style.color = '#FF6B35';
            discountedPriceSpan.style.fontWeight = 'bold';

            const discountLabel = document.createElement('div');
            discountLabel.className = 'discount-label';
            discountLabel.textContent = `${fixedDiscountPercent}% OFF`;
            discountLabel.style.position = 'absolute';
            discountLabel.style.top = '5px';
            discountLabel.style.right = '10px';
            discountLabel.style.backgroundColor = '#FF9A00';
            discountLabel.style.color = '#333333';
            discountLabel.style.padding = '5px 10px';
            discountLabel.style.borderRadius = '4px';
            discountLabel.style.fontWeight = 'bold';
            discountLabel.style.fontSize = '14px';
            
            const imageContainer = card.querySelector('.image-container');
            if (imageContainer) {
                imageContainer.style.position = 'relative';
                const existingLabel = imageContainer.querySelector('.discount-label');
                if (existingLabel) {
                    existingLabel.remove();
                }
                imageContainer.appendChild(discountLabel);
            }
        }
    });
}

function sortByTime() {
    currentTimeSort = document.getElementById('timeSort').value;
    applyFilters();
}

function filterMenu(category) {
    currentCategory = category;
    applyFilters();
}

function filterByDietType() {
    currentDietType = document.getElementById('dietType').value;
    applyFilters();
}

function applyFilters() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const dietType = card.querySelector('.badge').classList.contains('badge-secondary') ? 'VEG' : 'NON-VEG';
        const prepTime = parseInt(card.getAttribute('data-prep-time').split(' ')[0]);
        
        const categoryMatch = currentCategory === 'ALL' || cardCategory === currentCategory;
        const dietTypeMatch = currentDietType === 'ALL' || dietType === currentDietType;
        const timeSortMatch = currentTimeSort === 'ALL' || 
                             (currentTimeSort === 'QUICK' && prepTime <= 15) ||
                             (currentTimeSort === 'MEDIUM' && prepTime > 15 && prepTime <= 30) ||
                             (currentTimeSort === 'LONG' && prepTime > 30);

        if (categoryMatch && dietTypeMatch && timeSortMatch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

window.addEventListener('load', applyFixedDiscounts);

applyFilters();

const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalImage = document.getElementById('modal-image');
const modalDiscountedPrice = document.getElementById('modal-discounted-price');
const closeModal = document.getElementsByClassName('close')[0];

function openModal(imageSrc, title, prepTime, description, discountedPrice) {
    modalImage.src = imageSrc;
    modalTitle.innerText = title;
    document.getElementById("modal-prep-time").innerText = prepTime;
    modalDescription.innerText = description;
    modalDiscountedPrice.innerText = `Price: ${discountedPrice}`;
    modal.style.display = "block";
}

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
        const imageSrc = card.getAttribute('data-image');
        const title = card.getAttribute('data-name');
        const prepTime = card.getAttribute('data-prep-time');
        const description = card.getAttribute('data-description');
        const discountedPrice = card.getElementsByClassName('discounted-price')[0].innerText;
        openModal(imageSrc, title, prepTime, description, discountedPrice);
    });
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

const wishlistSidebar = document.getElementById('wishlist-sidebar');
const openWishlistBtn = document.querySelector('.wishlist-container');
const closeWishlistBtn = document.getElementById('close-wishlist');
const wishlistItems = document.getElementById('wishlist-items');

function openWishlistSidebar() {
    wishlistSidebar.classList.add('open');
    updateWishlistSidebar();
}

function closeWishlistSidebar() {
    wishlistSidebar.classList.remove('open');
}

openWishlistBtn.addEventListener('click', openWishlistSidebar);
closeWishlistBtn.addEventListener('click', closeWishlistSidebar);

document.addEventListener('click', (event) => {
    if (!wishlistSidebar.contains(event.target) && !openWishlistBtn.contains(event.target)) {
        closeWishlistSidebar();
    }
});

function updateWishlistSidebar() {
    wishlistItems.innerHTML = '';
    if (wishlist.length === 0) {
        wishlistItems.innerHTML = '<p class="empty-wishlist">Your wishlist is empty.</p>';
    } else {
        wishlist.forEach(item => {
            const wishlistItem = document.createElement('div');
            wishlistItem.classList.add('wishlist-item');
            wishlistItem.innerHTML = `
                <span class="wishlist-item-name" onclick="openModalFromWishlist('${item.id}')">${item.name}</span>
                <span class="wishlist-item-price">${item.price}</span>
                <button class="remove-from-wishlist" onclick="removeFromWishlist('${item.name}', event)">Remove</button>
            `;
            wishlistItems.appendChild(wishlistItem);
        });
    }
}

function updateWishlistCount() {
    const wishlistCount = document.getElementById('wishlist-count');
    wishlistCount.textContent = wishlist.length;
}

function removeFromWishlist(itemName, event) {
    event.stopPropagation();
    const index = wishlist.findIndex(item => item.name === itemName);
    if (index !== -1) {
        wishlist.splice(index, 1);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistIcon(itemName, false);
        updateWishlistCount();
        updateWishlistSidebar();
    }
}

function initializeWishlist() {
    wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    updateWishlistCount();
    updateWishlistSidebar();
    
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const itemName = card.querySelector('h4').textContent;
        const wishlistBtn = card.querySelector('.wishlist-btn');
        const isFavorite = wishlist.some(item => item.name === itemName);
        if (isFavorite) {
            wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
            wishlistBtn.style.color = 'red';
        } else {
            wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
            wishlistBtn.style.color = 'black';
        }
    });
}

function updateWishlistIcon(itemName, isFavorite) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        if (card.querySelector('h4').textContent === itemName) {
            const wishlistBtn = card.querySelector('.wishlist-btn');
            if (isFavorite) {
                wishlistBtn.innerHTML = '<i class="fas fa-heart"></i>';
                wishlistBtn.style.color = 'red';
            } else {
                wishlistBtn.innerHTML = '<i class="far fa-heart"></i>';
                wishlistBtn.style.color = 'black';
            }
        }
    });
}

function toggleWishlist(button, event) {
    event.stopPropagation();
    const card = button.closest('.card');
    const itemName = card.querySelector('h4').textContent;
    const itemIndex = wishlist.findIndex(item => item.name === itemName);

    if (itemIndex === -1) {
        const discountedPrice = card.querySelector('.discounted-price').textContent.trim();
        const newItem = {
            id: card.dataset.id,
            name: card.dataset.name,
            description: card.dataset.description,
            image: card.dataset.image,
            prepTime: card.dataset.prepTime,
            price: discountedPrice
        };
        wishlist.push(newItem);
        button.innerHTML = '<i class="fas fa-heart"></i>';
        button.style.color = 'red';
    } else {
        wishlist.splice(itemIndex, 1);
        button.innerHTML = '<i class="far fa-heart"></i>';
        button.style.color = 'black';
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    updateWishlistSidebar();
}

function addToWishlist(item) {
    const wishlistItems = document.getElementById('wishlist-items');
    const wishlistItem = document.createElement('div');
    wishlistItem.className = 'wishlist-item';
    wishlistItem.dataset.id = item.dataset.id;
    wishlistItem.innerText = item.dataset.name;
    wishlistItem.addEventListener('click', () => {
        openModalFromWishlist(item.dataset.id);
    });
    wishlistItems.appendChild(wishlistItem);
}

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
});

document.getElementById('close-wishlist').addEventListener('click', () => {
    closeWishlistSidebar();
});

window.addEventListener('load', () => {
    applyFixedDiscounts();
    applyFilters();
    initializeWishlist();
});

function openModalFromWishlist(itemId) {
    const item = wishlist.find(item => item.id === itemId);
    if (item) {
        openModal(item.image, item.name, item.prepTime, item.description, item.price);
        document.getElementById('quantity').value = '1';
        document.getElementById('table-number').value = '1';
        document.getElementById('modal-discounted-price').textContent = `Price: ${item.price}`;
    }
}

function submitOrder() {
    const itemName = document.getElementById('modal-title').textContent;
    const quantity = document.getElementById('quantity').value;
    const tableNumber = document.getElementById('table-number').value;
    const priceText = document.getElementById('modal-discounted-price').textContent;
    const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));

    const orderData = {
        itemName,
        quantity: parseInt(quantity),
        tableNumber: parseInt(tableNumber),
        price: price * parseInt(quantity)
    };

    fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Order placed successfully:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Failed to place order. Please try again. Error: ' + error.message);
    });
}

document.getElementById('order-now').addEventListener('click', submitOrder);

document.getElementById('order-now').addEventListener('click', () => {
    const quantity = document.getElementById('quantity').value;
    const title = document.getElementById('modal-title').innerText;
    
    document.getElementById('successMessage').style.display = 'block';
    setTimeout(function() {
        document.getElementById('successMessage').style.display = 'none';
    }, 5000);
    modal.style.display = 'none';
});

document.getElementById('increment').addEventListener('click', () => {
    const quantityInput = document.getElementById('quantity');
    quantityInput.value = parseInt(quantityInput.value) + 1;
});

document.getElementById('decrement').addEventListener('click', () => {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput.value > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
    }
});
