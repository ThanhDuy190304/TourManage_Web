document.addEventListener('DOMContentLoaded', () => {
    function handleBookingDialog() {
        const dialog = document.getElementById('bookingDialog');
        const overlay = document.getElementById('overlay');
        const openBookingDialogButton = document.getElementById('openBookingDialog');
        const closeBookingDialogButton = document.getElementById('closeBookingDialog');
        const increaseButton = document.getElementById('increase');
        const decreaseButton = document.getElementById('decrease');
        const quantityDisplay = document.getElementById('quantityDisplay');
        const bookingButton = document.getElementById('bookTour');
        let quantity = 1;
        const maxQuantity = 2;

        // Hàm cập nhật trạng thái nút
        function updateButtonState() {
            if (quantity <= 1) {
                decreaseButton.style.cursor = 'default';
                decreaseButton.style.color = 'gray'; // Màu khi không thể chọn
                decreaseButton.disabled = true;
            } else {
                decreaseButton.style.cursor = 'pointer';
                decreaseButton.style.color = 'black'; // Màu khi có thể chọn
                decreaseButton.disabled = false;
            }

            if (quantity >= maxQuantity) {
                increaseButton.style.cursor = 'default';
                increaseButton.style.color = 'gray'; // Màu khi không thể chọn
                increaseButton.disabled = true;
            } else {
                increaseButton.style.cursor = 'pointer';
                increaseButton.style.color = 'black'; // Màu khi có thể chọn
                increaseButton.disabled = false;
            }
        }

        // Xử lý khi nhấn nút tăng
        increaseButton.addEventListener('click', () => {
            if (quantity < maxQuantity) {
                quantity++;
                quantityDisplay.textContent = quantity;
                updateButtonState(); // Cập nhật trạng thái sau khi tăng
            }
        });

        // Xử lý khi nhấn nút giảm
        decreaseButton.addEventListener('click', () => {
            if (quantity > 1) {
                quantity--;
                quantityDisplay.textContent = quantity;
                updateButtonState(); // Cập nhật trạng thái sau khi giảm
            }
        });

        // Hiển thị dialog và overlay khi nhấn nút mở
        openBookingDialogButton.addEventListener('click', () => {
            dialog.classList.remove('hidden');
            overlay.classList.remove('hidden');
        });

        // Ẩn dialog và overlay khi nhấn nút đóng
        closeBookingDialogButton.addEventListener('click', () => {
            dialog.classList.add('hidden');
            overlay.classList.add('hidden');
        });

        bookingButton.addEventListener('click', () => {
            // Thu thập thông tin cần thiết
            const tourDate = document.querySelector('input[name="tourDate"]:checked').value;
            const quantity = document.getElementById("quantityDisplay").innerText;
            const selectedInput = document.querySelector('input[name="tourDate"]:checked');
            const scheduleId = selectedInput.getAttribute('schedule_id');

            const reservationData = {
                tour_id: tour.tour_id,
                title: tour.title,
                prices: tour.prices,
                tourDate: tourDate,
                quantity: quantity,
                scheduleId: scheduleId
            };

            sessionStorage.setItem('reservationData', JSON.stringify(reservationData));
            window.location.href = '/reservation';
        });

        let isButtonUpdated = false;
        document.querySelectorAll('input[name="tourDate"]').forEach(input => {
            input.addEventListener('change', function () {
                // Lấy số lượng vé còn lại từ data attribute của input
                const availableQuantity = this.getAttribute('available-quantity');
                // Cập nhật số lượng vé còn lại vào giao diện người dùng
                document.getElementById('remaining-tickets').textContent = `Remaining tickets: ${availableQuantity}`;
                if (!isButtonUpdated) {
                    bookingButton.classList.remove('bg-neutral-300', 'cursor-default');
                    bookingButton.classList.add('bg-green-700', 'hover:bg-green-600', 'cursor-pointer');
                    isButtonUpdated = true;
                }
            });
        });
    }

    // Gọi hàm để khởi tạo xử lý booking
    handleBookingDialog();
});


