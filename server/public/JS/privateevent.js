document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.querySelector('.card-container');
    const cards = document.querySelectorAll('.card');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    let currentIndex = 0;

    function showCard(index) {
        cards.forEach((card, i) => {
            if (i === index) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
        currentIndex = index;
        updateButtonVisibility();
    }

    function updateButtonVisibility() {
        prevButton.style.visibility = currentIndex === 0 ? 'hidden' : 'visible';
        nextButton.style.visibility = currentIndex === cards.length - 1 ? 'hidden' : 'visible';
    }

    prevButton.addEventListener('click', () => {
        if (currentIndex > 0) {
            showCard(currentIndex - 1);
        }
    });

    nextButton.addEventListener('click', () => {
        if (currentIndex < cards.length - 1) {
            showCard(currentIndex + 1);
        }
    });

    showCard(0);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            showCard(currentIndex - 1);
        } else if (e.key === 'ArrowRight' && currentIndex < cards.length - 1) {
            showCard(currentIndex + 1);
        }
    });

    function createBookingForm() {
        const form = document.createElement('div');
        form.className = 'booking-form hidden';
        form.innerHTML = `
            <form>
                <input type="text" name="name" placeholder="Name" required>
                <input type="tel" name="phone" placeholder="Phone" required>
                <div class="date-time-container">
                    <input type="date" name="date" required>
                    <input type="time" name="time" required>
                </div>
                <input type="number" name="guests" placeholder="Number of Guests" required>
                <select name="occasion" required>
                    <option value="">Select Occasion</option>
                    <option value="birthday">Birthday</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="business">Business</option>
                    <option value="other">Other</option>
                </select>
                <button type="submit" class="submit-booking">Book Now!</button>
                <button type="button" class="cancel-booking">Cancel</button>
            </form>
        `;
        return form;
    }

    const cardContents = document.querySelectorAll('.card-content');
    cardContents.forEach(cardContent => {
        const bookingForm = createBookingForm();
        cardContent.appendChild(bookingForm);
    });

    const bookNowButtons = document.querySelectorAll('.book-now');
    bookNowButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const cardContent = e.target.closest('.card-content');
            const bookingForm = cardContent.querySelector('.booking-form');
            
            cardContent.classList.add('form-visible');
            bookingForm.classList.remove('hidden');
            bookingForm.classList.add('visible');
        });
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('cancel-booking')) {
            const cardContent = e.target.closest('.card-content');
            const bookingForm = cardContent.querySelector('.booking-form');
            
            cardContent.classList.remove('form-visible');
            bookingForm.classList.remove('visible');
            bookingForm.classList.add('hidden');
        }
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.card-content') && !e.target.classList.contains('book-now')) {
            const visibleForms = document.querySelectorAll('.booking-form.visible');
            visibleForms.forEach(form => {
                form.classList.remove('visible');
                form.classList.add('hidden');
                form.closest('.card-content').classList.remove('form-visible');
            });
        }
    });

    function generateBookingId() {
        return Math.random().toString(36).substr(2, 9).toUpperCase();
    }

    function formatDateTime(date, time) {
        const dateObj = new Date(`${date}T${time}`);
        return dateObj.toLocaleString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    }

    document.addEventListener('submit', (e) => {
        if (e.target.closest('.booking-form')) {
            e.preventDefault();
            const form = e.target;
            const card = form.closest('.card');
            const bookingId = generateBookingId();
            const reservedDate = formatDateTime(form.date.value, form.time.value);

            const bookingData = {
                name: form.name.value,
                phone: form.phone.value,
                date: form.date.value,
                time: form.time.value,
                guests: form.guests.value,
                occasion: form.occasion.value,
                venueName: card.querySelector('h2').textContent,
                price: card.querySelector('.price').textContent
            };

            fetch('/api/private-event-bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('bookingId').textContent = data.bookingId;
                document.getElementById('reservedDate').textContent = reservedDate;

                document.getElementById('confirmationModal').classList.remove('hidden');

                const cardContent = form.closest('.card-content');
                const bookingForm = cardContent.querySelector('.booking-form');
                cardContent.classList.remove('form-visible');
                bookingForm.classList.remove('visible');
                bookingForm.classList.add('hidden');
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Failed to make booking. Please try again.');
            });
        }
    });

    
    document.getElementById('saveScreenshot').addEventListener('click', () => {
        const modalContent = document.querySelector('.modal-content');
        const callbackMessage = modalContent.querySelector('p[style="font-style: italic;"]');
        const modalButtons = modalContent.querySelector('.modal-buttons');

        callbackMessage.style.display = 'none';
        modalButtons.style.display = 'none';

        html2canvas(modalContent).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            
            const link = document.createElement('a');
            link.download = 'reservation_confirmation.png';
            link.href = imgData;
            
            document.body.appendChild(link);
            
            link.click();
            
            document.body.removeChild(link);

            callbackMessage.style.display = 'block';
            modalButtons.style.display = 'flex';
        }).catch(error => {
            console.error('Error generating screenshot:', error);
            alert('Failed to generate screenshot. Please try again.');

            callbackMessage.style.display = 'block';
            modalButtons.style.display = 'flex';
        });
    });

    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('confirmationModal').classList.add('hidden');
    });
});

const form = card.querySelector('form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const bookingData = Object.fromEntries(formData.entries());
            bookingData.venueName = card.querySelector('h2').textContent;
            bookingData.price = card.querySelector('.price').textContent;

            fetch('/api/private-event-bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            })
            .then(response => response.json())
            .then(data => {
                document.getElementById('bookingId').textContent = data.bookingId;
                document.getElementById('reservedDate').textContent = `${bookingData.date} at ${bookingData.time}`;
                showConfirmationModal();
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Failed to make booking. Please try again.');
            });
        });
