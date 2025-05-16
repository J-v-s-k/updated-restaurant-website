document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('reservationForm');
    const modal = document.getElementById('confirmationModal');
    const modalContent = document.querySelector('.modal-content');
    const bookingIdSpan = document.getElementById('bookingId');
    const reservedDateSpan = document.getElementById('reservedDate');
    const saveButton = document.getElementById('saveButton');
    const closeModalButton = document.getElementById('closeModal');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const bookingId = generateBookingId();
        const reservedDate = formatReservedDate();
        
        bookingIdSpan.textContent = bookingId;
        reservedDateSpan.textContent = reservedDate;
        showModal();
    });

    closeModalButton.addEventListener('click', () => {
        hideModal();
        clearForm();
    });

    saveButton.addEventListener('click', () => {
        saveButton.style.display = 'none';
        closeModalButton.style.display = 'none';

        const clonedContent = modalContent.cloneNode(true);
        document.body.appendChild(clonedContent);

        clonedContent.style.position = 'absolute';
        clonedContent.style.left = '-9999px';
        clonedContent.style.top = '-9999px';
        clonedContent.style.width = '500px';
        clonedContent.style.height = 'auto';
        clonedContent.style.transform = 'none';

        html2canvas(clonedContent, {
            scale: 2,
            backgroundColor: null,
            width: 500,
            height: clonedContent.offsetHeight,
            scrollY: -window.scrollY
        }).then(canvas => {
            document.body.removeChild(clonedContent);

            saveButton.style.display = 'inline-block';
            closeModalButton.style.display = 'inline-block';

            const link = document.createElement('a');
            link.download = 'reservation_confirmation.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });

    function showModal() {
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        document.body.style.overflow = 'hidden';
    }

    function hideModal() {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }

    function clearForm() {
        form.reset();
    }

    function generateBookingId() {
        return Math.random().toString(36).substr(2, 16).toUpperCase();
    }

    function formatReservedDate() {
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        const date = new Date(`${dateInput.value}T${timeInput.value}`);
        return date.toLocaleString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    }
});
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('reservationForm');
    const modal = document.getElementById('confirmationModal');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const reservationData = Object.fromEntries(formData.entries());

        fetch('/api/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservationData),
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('bookingId').textContent = data.bookingId;
            document.getElementById('reservedDate').textContent = `${reservationData.date} at ${reservationData.time}`;
            modal.style.display = 'block';
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Failed to make reservation. Please try again.');
        });
    });
});
