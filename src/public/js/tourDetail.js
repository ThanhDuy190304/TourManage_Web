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
                tour.voucher,
                tour.tourImg,
            );
        }
    });

}

function handleBooking(tourId, title, prices, tourDate, quantity, scheduleId, voucher, tourImg) {
    const reservationDataArray = [
        {
            tourId: tourId,
            title: title,
            prices: prices,
            tourDate: tourDate,
            quantity: quantity,
            scheduleId: scheduleId,
            voucher: voucher,
            img: tourImg
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
    document.body.removeChild(form);
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
            localStorage.setItem('countCartItem', data.count.toString());
        } else if (response.status === 401) {
            let cartDataArray = JSON.parse(localStorage.getItem('cartDataArray')) || [];
            const existingItem = cartDataArray.find(item => item.tourId === tourId && item.scheduleId === scheduleId);
            if (existingItem) {
                existingItem.quantity = (
                    parseInt(existingItem.quantity, 10) + parseInt(quantity, 10)
                ).toString();
                alert(`Increase quantity this tour!`);
            } else {
                cartDataArray.push({ tourId: tourId, scheduleId: scheduleId, quantity: quantity });
                localStorage.setItem('countCartItem', cartDataArray.length.toString());
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

document.addEventListener('DOMContentLoaded', () => {
    const bookTourButton = document.getElementById('bookTour');
    const addToCartButton = document.getElementById('addToCart');

    bookTourButton.addEventListener('click', () => {
        initBookingDialog('booking');
    });

    addToCartButton.addEventListener('click', () => {
        initBookingDialog('addToCart');
    });

});

document.addEventListener('DOMContentLoaded', () => {
    const reviewDialog = document.getElementById('reviewDialog');
    const addReviewButton = document.getElementById('addReviewButton');
    const closeReviewDialog = document.getElementById('closeReviewDialog');
    const dialogReviewForm = document.getElementById('dialogReviewForm');
    const ratingStarsContainer = document.getElementById('ratingStars');
    const reviewsList = document.getElementById('reviewsList');

    let selectedRating = 0;

    // Tạo các ngôi sao đánh giá
    function createRatingStars() {
        ratingStarsContainer.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.className = 'text-2xl cursor-pointer';
            star.innerHTML = '☆';
            star.dataset.rating = i;
            ratingStarsContainer.appendChild(star);

            // Sự kiện chọn sao
            star.addEventListener('click', () => {
                selectedRating = parseInt(star.dataset.rating, 10);
                updateStarColors();
            });
        }
    }

    // Cập nhật màu sắc ngôi sao
    function updateStarColors() {
        const stars = ratingStarsContainer.querySelectorAll('span');
        stars.forEach((star, index) => {
            if (index < selectedRating) {
                star.classList.add('text-yellow-500');
                star.classList.remove('text-gray-300');
                star.innerHTML = '★';
            } else {
                star.classList.add('text-gray-300');
                star.classList.remove('text-yellow-500');
                star.innerHTML = '☆';
            }
        });
    }

    // Mở dialog
    addReviewButton.addEventListener('click', () => {
        reviewDialog.classList.remove('hidden');
        createRatingStars();
    });

    // Đóng dialog
    closeReviewDialog.addEventListener('click', () => {
        reviewDialog.classList.add('hidden');
        dialogReviewForm.reset();
        selectedRating = 0;
        updateStarColors();
    });

    // Gửi review tới bảng feedbacks thông qua API
    async function submitReviewToAPI(reviewData) {
        console.log(reviewData)
        try {
            const response = await fetch('/user/createFeedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    tourId: reviewData.tourId,
                    comment: reviewData.comment,
                    rating: reviewData.rating,
                }),
            });

            if (response.ok) {
                alert('Review submitted successfully!');
                reviewDialog.classList.add('hidden'); // Ẩn hộp thoại sau khi gửi thành công
                dialogReviewForm.reset(); // Reset form
                selectedRating = 0; // Reset số sao
                updateStarColors(); // Cập nhật lại màu sao
                loadReviews(); // Làm mới danh sách review (nếu cần)
            } else {
                const error = await response.json();
                alert(`Error: ${error.message || 'Failed to submit review'}`);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('An error occurred while submitting your review. Please try again later.');
        }
    }

    // Xử lý form submit
    dialogReviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const comment = document.getElementById('dialogReviewComment').value;

        if (!comment || selectedRating === 0) {
            alert('Please fill in all fields and select a rating.');
            return;
        }

        const tourId = document.getElementById('detailed_tour').dataset.tourId;
        console.log(tourId)
        // Dữ liệu gửi lên API
        const reviewData = {
            tourId: tourId,
            comment: comment,
            rating: selectedRating,
        };
        // Gửi dữ liệu qua API
        submitReviewToAPI(reviewData);
    });

    document.getElementById('starFilter').addEventListener('change', (e) => {
        const starFilter = e.target.value;
        loadReviews(1, 5, starFilter); // Reset về trang 1 khi lọc
    });
    function scrollToProductList() {
        const productList = document.getElementById('feedback'); // Phần tử danh sách sản phẩm
        if (productList) {
            productList.scrollIntoView({ behavior: 'smooth' }); // Cuộn mượt mà đến phần tử
        }
    }
    // Tải danh sách review
    async function loadReviews(page = 1, pageSize = 5, starFilter = '') {
        const tourId = document.getElementById('detailed_tour').dataset.tourId;
        try {
            // Fetch danh sách review từ API
            const response = await fetch(`/feedback/api/getFeedbackByTourId/${tourId}?page=${page}&pageSize=${pageSize}&starFilter=${starFilter}`);
            if (!response.ok) {
                throw new Error('Failed to fetch reviews');
            }

            const reviews = await response.json();
            console.log(reviews)
            // Làm trống danh sách review cũ
            reviewsList.innerHTML = '';
            const totalReviews = reviews.feedbackList.total || 0;

            if (reviews.feedbackList.feedbacks.length === 0) {
                reviewsList.innerHTML = `<p class="text-gray-500">No reviews yet. Be the first to leave a review!</p>`;
                return;
            }
            // Render danh sách review
            reviews.feedbackList.feedbacks.forEach(review => {
                const reviewItem = document.createElement('div');
                reviewItem.classList.add('review-item', 'p-4', 'border', 'rounded', 'shadow-sm');

                reviewItem.innerHTML = `
                    <div class="flex items-center mb-2">
                        ${renderStars(review.star)}
                    </div>
                    <p class="text-gray-700">${review.rate}</p>
                    <span class="text-sm text-gray-500">By User ${review.user_name || 'Anonymous'}</span>
                `;

                reviewsList.appendChild(reviewItem);
            });

            renderPagination(page, pageSize, totalReviews, starFilter);
            scrollToProductList()
        } catch (error) {
            console.error('Error loading reviews:', error);
            reviewsList.innerHTML = `<p class="text-red-500">Failed to load reviews. Please try again later.</p>`;
        }
    }

    function renderPagination(currentPage, pageSize, total, starFilter) {
        console.log(currentPage, pageSize, total, starFilter)
        const totalPages = Math.ceil(total / pageSize);

        // Lấy các phần tử DOM
        const previousPageButton = document.getElementById('previousPage');
        const nextPageButton = document.getElementById('nextPage');
        const pageNumbersContainer = document.getElementById('pageNumbers');

        // Cập nhật trạng thái nút phân trang
        previousPageButton.disabled = currentPage <= 1;
        nextPageButton.disabled = currentPage >= totalPages;

        // Hiển thị các nút trang số
        pageNumbersContainer.innerHTML = '';

        // Tạo các nút phân trang số, hạn chế chỉ hiển thị 5 nút xung quanh trang hiện tại (ví dụ: nếu có 10 trang, ta chỉ hiển thị 5 nút)
        let startPage = Math.max(1, currentPage - 2);  // Hiển thị 2 trang trước
        let endPage = Math.min(totalPages, currentPage + 2);  // Hiển thị 2 trang sau

        // Nếu trang hiện tại là gần trang đầu hoặc cuối, điều chỉnh phạm vi số trang
        if (currentPage <= 3) {
            endPage = Math.min(5, totalPages);
        } else if (currentPage >= totalPages - 2) {
            startPage = Math.max(totalPages - 4, 1);
        }

        // Tạo các nút trang số
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.innerText = i;
            if (i == currentPage) {
                pageButton.classList.add('active');
            }

            // Thêm sự kiện click
            pageButton.onclick = () => loadReviews(i, pageSize, starFilter);

            // Thêm nút trang vào container
            pageNumbersContainer.appendChild(pageButton);
        }

        // Đảm bảo các nút phân trang chuyển trang khi click
        previousPageButton.onclick = () => loadReviews(currentPage - 1, pageSize, starFilter);
        nextPageButton.onclick = () => loadReviews(currentPage + 1, pageSize, starFilter);
    }

    // Hàm render sao từ số sao (rating)
    function renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<span class="${i <= rating ? 'text-yellow-500' : 'text-gray-300'}">★</span>`;
        }
        return stars;
    }

    // Gọi loadReviews khi DOMContentLoaded
    loadReviews();
});