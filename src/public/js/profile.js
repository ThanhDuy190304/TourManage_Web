

async function fetchUserProfile() {
    try {
        const response = await fetch('/user/api/getProfile', {
            method: 'GET',
            credentials: 'same-origin'
        }); if (!response.ok) {
            throw new Error('Failed to fetch user profile');
        }
        const data = await response.json();
        if (data.success) {
            displayUserProfile(data.userProfile);
        } else {
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

function displayUserProfile(userProfile) {
    const infoContainer = document.getElementById('infoContainer');
    infoContainer.innerHTML = `
                <div class="p-6 bg-white shadow-md rounded-md">
                    <h2 class="text-xl font-bold mb-4">User Profile</h2>
                    <div class="mb-4">
                        <label class="font-medium">Full Name:</label>
                        <p id="fullname" class="text-gray-600">${userProfile.fullname}</p>
                    </div>
                    <div class="mb-4">
                        <label class="font-medium">Email:</label>
                        <p id="email" class="text-gray-600">${userProfile.email}</p>
                    </div>
                    <div class="mb-4">
                        <label class="font-medium">Birthdate:</label>
                        <p id="birthdate" class="text-gray-600">${userProfile.birthdate}</p>
                    </div>
                    <div class="mb-4">
                        <label class="font-medium">Contact:</label>
                        <p id="contact" class="text-gray-600">${userProfile.contact}</p>
                    </div>
                    <div class="mb-4">
                        <label class="font-medium">Address:</label>
                        <p id="address" class="text-gray-600">${userProfile.address}</p>
                    </div>
                    <button 
                        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onclick="enableEditMode()">
                        Edit
                    </button>
                </div>
            `;
}

function enableEditMode() {
    const infoContainer = document.getElementById('infoContainer');
    const fullname = document.getElementById('fullname').textContent;
    const email = document.getElementById('email').textContent;
    const birthdate = document.getElementById('birthdate').textContent;
    const contact = document.getElementById('contact').textContent;
    const address = document.getElementById('address').textContent;

    infoContainer.innerHTML = `
                <div class="p-6 bg-white shadow-md rounded-md">
                    <h2 class="text-xl font-bold mb-4">Edit Profile</h2>
                    <div class="mb-4">
                        <label class="font-medium">Full Name:</label>
                        <input id="editFullname" type="text" class="w-full p-2 border rounded-md" value="${fullname}" />
                    </div>
                    <div class="mb-4">
                        <label class="font-medium">Birthdate:</label>
                        <input id="editBirthdate" type="date" class="w-full p-2 border rounded-md" value="${birthdate}" />
                    </div>
                    <div class="mb-4">
                        <label class="font-medium">Contact:</label>
                        <input id="editContact" type="text" class="w-full p-2 border rounded-md" value="${contact}" />
                    </div>
                    <div class="mb-4">
                        <label class="font-medium">Address:</label>
                        <input id="editAddress" type="text" class="w-full p-2 border rounded-md" value="${address}" />
                    </div>
                    <button 
                        class="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                        onclick="saveProfile()">
                        Save
                    </button>
                    <button 
                        class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 ml-2"
                        onclick="fetchUserProfile()">
                        Cancel
                    </button>
                </div>
            `;
}

async function saveProfile() {
    // Lấy dữ liệu từ các trường input
    const fullname = document.getElementById('editFullname').value;
    const birthdate = document.getElementById('editBirthdate').value;
    const contact = document.getElementById('editContact').value;
    const address = document.getElementById('editAddress').value;

    // Verify user input
    if (!fullname) {
        alert('Full Name is required.');
        return;
    }

    if (!birthdate || isNaN(new Date(birthdate).getTime())) {
        alert('Invalid birthdate. Please select a valid date.');
        return;
    }

    const currentDate = new Date();
    const birthDateObj = new Date(birthdate);

    // Kiểm tra ngày nhập vào có nhỏ hơn ngày hiện tại
    if (birthDateObj >= currentDate) {
        alert('Birthdate must be in the past.');
        return;
    }

    // Kiểm tra người dùng có đủ 18 tuổi hay không
    const age = currentDate.getFullYear() - birthDateObj.getFullYear();

    if (age < 18) {
        alert('You must be at least 18 years old.');
        return;
    }

    if (!contact || !/^\d{10}$/.test(contact)) {
        alert('Invalid contact number. It should contain exactly 10 digits.');
        return;
    }

    if (!address) {
        alert('Address is required.');
        return;
    }

    try {
        // Gửi dữ liệu qua API
        const response = await fetch('/user/updateProfile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                fullname: fullname,
                birthdate: birthdate,
                contact: contact,
                address: address,
            }),
        });

        if (!response.ok) {
            alert('Update profile failed!');
            throw new Error('Failed to update profile');
        }

        alert('Profile updated successfully!');
        // Reload lại thông tin người dùng sau khi lưu thành công
        fetchUserProfile();
    } catch (error) {
        console.error('Error updating profile:', error);
    }
}

async function fetchUserBookingHistory() {
    try {
        const response = await fetch('/user/api/getBookingHistory', {
            method: 'GET',
            credentials: 'same-origin',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch booking history');
        }

        const data = await response.json();
        if (data.success) {
            displayBookingHistory(data.bookingHistory); // Gọi hàm để hiển thị lịch sử đặt hàng
        } else {
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Error fetching booking history:', error);
    }
}

function displayBookingHistory(bookings) {
    const infoContainer = document.getElementById('infoContainer'); // Giả sử bạn có phần tử này trong HTML để chứa danh sách

    infoContainer.innerHTML = '';
    if (bookings.length === 0) {
        infoContainer.innerHTML = `
        <div class="text-center text-gray-600 mt-8">
            <p class="text-lg">You have not made any bookings yet.</p>
        </div>
    `;
        return;
    }
    bookings.forEach(booking => {
        const bookingItem = document.createElement('div');
        bookingItem.classList.add('booking-item', 'p-4', 'mb-4', 'border', 'rounded-md', 'shadow-md');

        // Hiển thị thông tin chính: reservationId và reservationDate
        const bookingHeader = `
            <div class="flex justify-between">
                <h3 class="text-xl font-medium">#${booking.reservationId}</h3>
                <p class="text-gray-600">${booking.reservationDate}</p>
            </div>
        `;
        const bookingDetails = booking.details.map(detail => {
            return `
            <div class="details-item mt-2 p-2 border-t hover:bg-gray-100 cursor-pointer">
                <a href="/tours/${detail.tourId}" class="block">
                    <p class="text-lg font-normal">Tour: ${detail.title}</p>
                    <p class="text-gray-600">Tour Date: ${detail.tourDate}</p>
                    <p class="text-gray-500">Quantity: ${detail.quantity}</p>
                    <p class="text-green-700 font-normal">Total Price: $${detail.totalPrice}</p>
                </a>
            </div>
            `;
        }).join('');

        bookingItem.innerHTML = bookingHeader + bookingDetails;
        infoContainer.appendChild(bookingItem);
    });
}


function showContent(contentType) {
    // Remove highlight from all tabs
    document.querySelectorAll('.flex-1 .p-5').forEach(tab => {
        tab.style.backgroundColor = '';  // Remove background color
        tab.style.color = '';  // Remove text color
    });

    // Highlight the clicked tab
    const activeTab = document.getElementById(contentType + 'Tab');
    activeTab.style.backgroundColor = '#36802d';
    activeTab.style.color = 'white';

    // Handle content display based on the selected tab
    if (contentType === 'profile') {
        fetchUserProfile();
    } else if (contentType === 'account') {
        fetchUserAccount();
    } else if (contentType === 'bookingHistory') {
        fetchUserBookingHistory();
    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    // Set initial active tab to profile
    const profileTab = document.getElementById('profileTab');
    profileTab.style.backgroundColor = '#36802d';
    profileTab.style.color = 'white';

    showContent('profile');  // Show profile content by default
});
