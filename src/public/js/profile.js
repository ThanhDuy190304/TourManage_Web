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
            changeProfilePicture(data.userProfile);
        } else {
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

function changeProfilePicture(userProfile) {
    // Lấy phần tử ảnh đại diện
    const profilePicture = document.getElementById('profilePicture');
    console.log(userProfile.avatar)
    
    console.log(profilePicture)
    // Đảm bảo userProfile.avatar chứa URL ảnh đại diện mới
    if (userProfile && userProfile.avatar) {
        profilePicture.src = userProfile.avatar;  // Cập nhật URL ảnh
    }
}

function displayUserProfile(userProfile) {
    const infoContainer = document.getElementById('infoContainer');
    infoContainer.innerHTML = `
                <div class="p-6 bg-white">
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
                        class="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-600"
                        onclick="enableEditModeProfile()">
                        Edit
                    </button>
                </div>
            `;
}

function enableEditModeProfile() {
    const infoContainer = document.getElementById('infoContainer');
    const fullname = document.getElementById('fullname').textContent;
    const email = document.getElementById('email').textContent;
    const birthdate = document.getElementById('birthdate').textContent;
    const contact = document.getElementById('contact').textContent;
    const address = document.getElementById('address').textContent;

    infoContainer.innerHTML = `
                <div class="p-6 bg-white">
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
                        class="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-600"
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

        // Hiển thị thông tin chính: reservationId, reservationDate, reservationStatus
        const bookingHeader = `
            <div class="flex justify-between items-center">
                <div>
                    <h3 class="text-xl font-medium">#${booking.reservationId}</h3>
                    <p class="text-gray-600">Date: ${booking.reservationDate}</p>
                    <p class="text-gray-500">Status: ${booking.reservationStatus}</p>
                </div>
                <button 
                    class="details-toggle px-4 py-2 bg-green-800 text-white rounded hover:bg-green-700"
                    data-id="${booking.reservationId}"
                >
                    View Details
                </button>
            </div>
        `;

        // Phần chứa chi tiết, ẩn ban đầu
        const bookingDetails = `
            <div class="details hidden mt-4 border-t pt-4">
                ${booking.details.map(detail => `
                <div class="details-item mt-2 p-2 border hover:bg-gray-100">
                    <a href="/tours/${detail.tourId}" class="block">
                        <img src="${detail.img}" alt="${detail.title}" class="w-16 h-16 rounded object-cover">
                        <p class="text-lg font-normal mt-2">Tour: ${detail.title}</p>
                        <p class="text-gray-600">Tour Date: ${detail.tourDate}</p>
                        <p class="text-gray-500">Quantity: ${detail.quantity}</p>
                        <p class="text-green-700 font-normal">Total Price: $${detail.totalPrice}</p>
                    </a>
                </div>
                `).join('')}
            </div>
        `;

        bookingItem.innerHTML = bookingHeader + bookingDetails;
        infoContainer.appendChild(bookingItem);
    });

    // Thêm sự kiện cho nút "View Details"
    const toggleButtons = document.querySelectorAll('.details-toggle');
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const bookingId = button.dataset.id;
            const details = button.parentElement.parentElement.querySelector('.details');
            if (details.classList.contains('hidden')) {
                details.classList.remove('hidden');
                button.textContent = 'Hide Details';
            } else {
                details.classList.add('hidden');
                button.textContent = 'View Details';
            }
        });
    });
}


async function fetchUserAccount() {
    try {
        const response = await fetch('/user/api/getAccount', {
            method: 'GET',
            credentials: 'same-origin',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user account');
        }
        else {
            const data = await response.json();
            displayUserAccount(data.userAccount);
        }
    } catch (error) {
        console.error('Error fetching user account:', error);
    }
}
function displayUserAccount(userAccount) {
    if (userAccount) {
        const infoContainer = document.getElementById('infoContainer');
        infoContainer.innerHTML = `
            <div class="p-6 bg-white">
                <h2 class="text-xl font-bold mb-4">Account Information</h2>
                <div class="mb-4">
                    <label class="font-medium">Username:</label>
                    <p id="username" class="text-gray-600">${userAccount.userName}</p>
                </div>
                <div class="mb-4">
                    <label class="font-medium">Email:</label>
                    <p id="createdAt" class="text-gray-600">${userAccount.email}</p>
                </div>
                 <button id="changePasswordBtn" class="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded">
                    Change Password
                </button>
                <div id="passwordForm" style="display: none; margin-top: 20px;">
                    <input id="currentPassword" type="password" placeholder="Current Password" 
                        class="border p-2 mb-4 w-full">
                    <input id="newPassword" type="password" placeholder="New Password" 
                        class="border p-2 mb-4 w-full">
                    <input id="confirmPassword" type="password" placeholder="Confirm New Password" 
                        class="border p-2 mb-4 w-full">
                    <button id="submitPasswordBtn" class="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded">
                        Submit
                    </button>
                </div>
            </div>
        `;
        document.getElementById('changePasswordBtn').addEventListener('click', () => {
            document.getElementById('passwordForm').style.display = 'block';
        });

        // Gán sự kiện cho nút Submit
        document.getElementById('submitPasswordBtn').addEventListener('click', () => {
            changePassword();
        });
    }
}

async function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value.trim();
    const newPassword = document.getElementById('newPassword').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    if (!currentPassword || !newPassword || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }
    if (newPassword !== confirmPassword) {
        alert('New Password and Confirm Password do not match.');
        return;
    }
    try {
        const response = await fetch('/user/api/changePassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });
        if (!response.ok) {
            const errorData = await response.json();
            alert(`Error: ${errorData.message || 'Failed to change password.'}`);
            return;
        }
        alert('Password changed successfully');
        document.getElementById('passwordForm').style.display = 'none';
    } catch (error) {
        console.error('Error changing password:', error);
    }

}

function showContent(contentType) {
    // Remove highlight from all tabs
    document.querySelectorAll('.flex-1 .p-5').forEach(tab => {
        tab.style.backgroundColor = '';  // Remove background color
        tab.style.color = '';  // Remove text color
    });

    // Highlight the clicked tab
    const activeTab = document.getElementById(contentType + 'Tab');
    activeTab.style.backgroundColor = '#2e6b23';
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


document.addEventListener('DOMContentLoaded', () => {
    const uploadDialog = document.getElementById('uploadDialog');
    const fileInput = document.getElementById('fileInput');
    const previewImage = document.getElementById('previewImage');
    const saveButton = document.getElementById('saveButton');
    const cancelButton = document.getElementById('cancelButton');
    const selectPictureButton = document.getElementById('selectPictureButton');
    const changePictureButton = document.getElementById('changePictureButton');
    
    // Hiển thị hộp thoại khi nhấn nút Thay đổi ảnh
    changePictureButton.addEventListener('click', () => {
        uploadDialog.classList.remove('hidden');
    });

    // Hiển thị ảnh được chọn trong input
    selectPictureButton.addEventListener('click', () => {
        fileInput.click();  // Mở trình chọn file khi nhấn nút Chọn ảnh
    });

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                previewImage.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Lưu ảnh khi ấn nút Save
    saveButton.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('profilePicture', file);
            console.log(formData)
            // Fetch API để gửi ảnh lên server
            const response = await fetch('/user/uploadProfilePicture', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (result.url) {
                alert('Ảnh đã được lưu thành công.');
                uploadDialog.classList.add('hidden');
            } else {
                alert('Lỗi khi lưu ảnh.');
            }
        } else {
            alert('Vui lòng chọn một ảnh.');
        }
    });

    // Đóng dialog khi ấn nút Cancel
    cancelButton.addEventListener('click', () => {
        uploadDialog.classList.add('hidden');
    });
});