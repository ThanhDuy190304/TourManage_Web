function handleBookingDialog() {
    const dialog = document.getElementById('bookingDialog');
    const overlay = document.getElementById('overlay');
    const openBookingDialogButton = document.getElementById('openBookingDialog');
    const closeBookingDialogButton = document.getElementById('closeBookingDialog');
    const increaseButton = document.getElementById('increase');
    const decreaseButton = document.getElementById('decrease');
    const quantityDisplay = document.getElementById('quantityDisplay');

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

    // Khởi tạo trạng thái nút
    updateButtonState();

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

    document.querySelectorAll('input[name="tourDate"]').forEach(input => {
        input.addEventListener('change', function () {
            // Lấy số lượng vé còn lại từ data attribute của input
            const availableQuantity = this.getAttribute('available-quantity');
            // Cập nhật số lượng vé còn lại vào giao diện người dùng
            document.getElementById('remaining-tickets').textContent = `Remaining tickets: ${availableQuantity}`;
        });
    });
}

// Gọi hàm để khởi tạo xử lý booking
handleBookingDialog();
