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
                // Remove existing discount label if any
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

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
});



window.addEventListener('load', () => {
    applyFixedDiscounts();
    applyFilters();
});

// document.getElementById('home-delivery').addEventListener('click', () => {
//     const quantity = document.getElementById('quantity').value;
//     const title = document.getElementById('modal-title').innerText;
//     alert(`You have ordered ${quantity} of ${title}`);
//     modal.style.display = 'none';
// });


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


function handleHomeDelivery() {
    const modalForm = document.querySelector('.modal-form');
    const homeDeliveryBtn = document.getElementById('home-delivery');
    const takeAwayBtn = document.getElementById('take-away');
    
    if (homeDeliveryBtn.classList.contains('active')) {
        modalForm.style.display = 'none';
        homeDeliveryBtn.classList.remove('active');
    } else {
        modalForm.innerHTML = `
            <form id="delivery-form">
                <input type="text" name="name" placeholder="Name" required>
                <input type="tel" name="phone" placeholder="Phone Number" required>
                <textarea name="address" placeholder="Delivery Address" required></textarea>
                <button type="submit" class="submit-btn">Confirm Delivery Order</button>
            </form>
        `;
        modalForm.style.display = 'block';
        homeDeliveryBtn.classList.add('active');
        takeAwayBtn.classList.remove('active');
    }
}

function handleTakeAway() {
    const modalForm = document.querySelector('.modal-form');
    const takeAwayBtn = document.getElementById('take-away');
    const homeDeliveryBtn = document.getElementById('home-delivery');
    
    if (takeAwayBtn.classList.contains('active')) {
        modalForm.style.display = 'none';
        takeAwayBtn.classList.remove('active');
    } else {
        modalForm.innerHTML = `
            <form id="take-away-form">
                <input type="text" name="name" placeholder="Name" required>
                <input type="tel" name="phone" placeholder="Phone Number" required>
                <input type="time" name="pickup-time" required>
                <button type="submit" class="submit-btn">Confirm Take Away Order</button>
            </form>
        `;
        modalForm.style.display = 'block';
        takeAwayBtn.classList.add('active');
        homeDeliveryBtn.classList.remove('active');
    }
}


document.getElementById('home-delivery').addEventListener('click', handleHomeDelivery);
document.getElementById('take-away').addEventListener('click', handleTakeAway);


function submitOrder(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const orderType = form.id === 'delivery-form' ? 'delivery' : 'take-away';

    const orderData = {
        itemName: document.getElementById('modal-title').textContent,
        quantity: parseInt(document.getElementById('quantity').value),
        price: parseFloat(document.getElementById('modal-discounted-price').textContent.replace('Price: ₹', '')),
        name: formData.get('name'),
        phone: formData.get('phone')
    };

    let endpoint;

    if (orderType === 'delivery') {
        orderData.address = formData.get('address');
        endpoint = 'http://localhost:5000/api/delivery-orders';
    } else {
        orderData.pickupTime = formData.get('pickup-time');
        endpoint = 'http://localhost:5000/api/takeaway-orders';
    }

    console.log('Sending order data:', orderData);

    fetch(endpoint, {
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
        document.getElementById('successMessage').style.display = 'block';
        
        setTimeout(() => {
            document.getElementById('successMessage').style.display = 'none';
            modal.style.display = 'none';
        }, 3000);
        
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Failed to place order. Please try again. Error: ' + error.message);
    });
}

document.addEventListener('submit', function(e) {
    if (e.target.id === 'delivery-form' || e.target.id === 'take-away-form') {
        e.preventDefault();
        submitOrder(e);
    }
});
