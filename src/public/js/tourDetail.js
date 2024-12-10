// Xử lý logic cho dialog booking và thêm vào giỏ hàng
function initBookingDialog(action) {
    const dialog = document.getElementById('Dialog');
    const overlay = document.getElementById('overlay');
    const closeDialogButton = document.getElementById('closeDialog');
    const increaseButton = document.getElementById('increase');
    const decreaseButton = document.getElementById('decrease');
    const quantityDisplay = document.getElementById('quantityDisplay');
    const addToCartButton = document.getElementById('addToCartButton');
    const bookTourButton = document.getElementById('bookTourButton');

    function openDialog() {
        dialog.classList.remove('hidden');
        overlay.classList.remove('hidden');
        addToCartButton.classList.add('hidden');
        bookTourButton.classList.add('hidden');
        if (action === 'addToCart') {
            addToCartButton.classList.remove('hidden');
        } else {
            bookTourButton.classList.remove('hidden');
        }
    }
    openDialog();

    let quantity = 1;
    const maxQuantity = 5;
    function updateButtonState() {
        decreaseButton.disabled = quantity <= 1;
        increaseButton.disabled = quantity >= maxQuantity;

        decreaseButton.style.cursor = quantity <= 1 ? 'default' : 'pointer';
        decreaseButton.style.color = quantity <= 1 ? 'gray' : 'black';

        increaseButton.style.cursor = quantity >= maxQuantity ? 'default' : 'pointer';
        increaseButton.style.color = quantity >= maxQuantity ? 'gray' : 'black';
    }
    updateButtonState(); // Cập nhật trạng thái ban đầu



    closeDialogButton.addEventListener('click', () => {
        dialog.classList.add('hidden');
        overlay.classList.add('hidden');
    });

    increaseButton.addEventListener('click', () => {
        if (quantity < maxQuantity) {
            quantity++;
            quantityDisplay.textContent = quantity;
            updateButtonState();
        }
    });

    decreaseButton.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            quantityDisplay.textContent = quantity;
            updateButtonState();
        }
    });

    let isButtonUpdated = false;
    document.querySelectorAll('input[name="tourDate"]').forEach(input => {
        input.addEventListener('change', function () {
            const availableQuantity = this.getAttribute('available-quantity');
            document.getElementById('remaining-tickets').textContent = `Remaining tickets: ${availableQuantity}`;
            if (!isButtonUpdated) {
                addToCartButton.classList.remove('bg-neutral-300', 'cursor-default');
                addToCartButton.classList.add('bg-green-700', 'hover:bg-green-600', 'cursor-pointer');
                bookTourButton.classList.remove('bg-neutral-300', 'cursor-default');
                bookTourButton.classList.add('bg-green-700', 'hover:bg-green-600', 'cursor-pointer');
                isButtonUpdated = true;
            }

        });
    });

    addToCartButton?.addEventListener('click', () => {
        if (action === 'addToCart') {
            const tourDateSelect = document.querySelector('input[name="tourDate"]:checked');
            if (!tourDateSelect) {
                alert("Please select a tour date.");
                return;
            }
            const scheduleId = tourDateSelect.getAttribute('schedule_id');
            handleAddToCart(tour.tourId, scheduleId, quantityDisplay.textContent);
        }
    });

    bookTourButton?.addEventListener('click', () => {
        if (action === 'booking') {
            const tourDateSelect = document.querySelector('input[name="tourDate"]:checked');
            if (!tourDateSelect) {
                alert("Please select a tour date.");
                return;
            }
            const tourDate = tourDateSelect.value;
            const scheduleId = tourDateSelect.getAttribute('schedule_id');

            // Truyền các giá trị vào handleBooking
            handleBooking(
                tour.tourId,
                tour.title,
                tour.prices,
                tourDate,
                quantityDisplay.textContent,
                scheduleId,
                tour.voucher
            );
        }
    });

}

function handleBooking(tourId, title, prices, tourDate, quantity, scheduleId, voucher) {
    const reservationDataArray = [
        {
            tourId: tourId,
            title: title,
            prices: prices,
            tourDate: tourDate,
            quantity: quantity,
            scheduleId: scheduleId,
            voucher: voucher,
        }
    ];
    const jsonReservationDataArray = JSON.stringify(reservationDataArray);
    sessionStorage.setItem("reservationDataArray", jsonReservationDataArray);

    const form = document.createElement('form');
    form.method = 'GET';
    form.action = '/reservation/save-reservation';
    // Tạo input ẩn để gửi dữ liệu
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'reservationDataArray';
    input.value = jsonReservationDataArray;
    form.appendChild(input);

    // Thêm form vào body và submit
    document.body.appendChild(form);
    form.submit();
}



async function handleAddToCart(tourId, scheduleId, quantity) {

    try {
        const response = await fetch('/cart/api/addToCart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tourId: tourId, scheduleId: scheduleId, quantity: quantity })
        });

        const data = await response.json();

        if (response.status === 200 && data.success) {
            document.getElementById('cartCount').innerText = data.count.toString();
        } else if (response.status === 401) {
            let cartDataArray = JSON.parse(localStorage.getItem('cartDataArray')) || [];
            console.log(1);
            const existingItem = cartDataArray.find(item => item.tourId === tourId && item.scheduleId === scheduleId);

            if (existingItem) {
                existingItem.quantity = (
                    parseInt(existingItem.quantity, 10) + parseInt(quantity, 10)
                ).toString();
                alert(`Increase quantity this tour!`);

            } else {
                cartDataArray.push({ tourId: tourId, scheduleId: scheduleId, quantity: quantity });
                alert(`Added new item to cart`);
            }

            localStorage.setItem('cartDataArray', JSON.stringify(cartDataArray));
            document.getElementById('cartCount').innerText = cartDataArray.length;
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error("Error adding to cart:", error);
    }
}



// Khởi tạo các xử lý khi DOM đã sẵn sàng
document.addEventListener('DOMContentLoaded', () => {

    const bookTourButton = document.getElementById('bookTour');
    const addToCartButton = document.getElementById('addToCart');

    bookTourButton.addEventListener('click', () => {
        initBookingDialog('booking'); // Gọi hàm initBookingDialog với chế độ 'booking'
    });

    addToCartButton.addEventListener('click', () => {
        initBookingDialog('addToCart'); // Gọi hàm initBookingDialog với chế độ 'addToCart'
    });
});
