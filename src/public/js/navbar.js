// nav.js

const registeredUserButton = document.getElementById('registeredUser_btn');
const registeredUserDropdownMenu = document.getElementById('registeredUser_menu');

// Xử lý sự kiện click cho nút tìm kiếm
const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');

// Xử lý sự kiện click cho nút menu toggle
document.getElementById("menu-toggle").addEventListener("click", function () {
    const navList = document.querySelector(".nav-list");
    const menuIcon = document.querySelector(".menu-icon");

    // Toggle hiển thị danh sách
    navList.classList.toggle("show");

    // Đổi icon giữa list-button và exit-button
    if (navList.classList.contains("show")) {
        menuIcon.src = "/img/exit-button.png"; // Đổi sang icon exit
    } else {
        menuIcon.src = "/img/list-button.png"; // Đổi về icon list
    }
});



// Hàm xử lý tìm kiếm
function handleSearch() {
    const query = searchInput.value.trim(); // Lấy giá trị từ input và loại bỏ khoảng trắng dư thừa
    if (query) {
        // Nếu có giá trị tìm kiếm, chuyển hướng đến trang với query string
        console.log(query);
        window.location.href = `/tours?query=${encodeURIComponent(query)}`;
    } else {
        // Nếu không có giá trị tìm kiếm, có thể hiển thị cảnh báo hoặc không làm gì
        alert("Please enter a search term.");
    }
}

if (searchButton) {
    // Lắng nghe sự kiện click trên nút tìm kiếm
    searchButton.addEventListener('click', handleSearch);
}

// Lắng nghe sự kiện "Enter" khi người dùng gõ trong input
searchInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        handleSearch(); // Gọi hàm xử lý tìm kiếm nếu nhấn Enter
    }
});


function closeMenu() {
    registeredUserDropdownMenu.classList.add('hidden');
}

registeredUserButton.addEventListener('click', (event) => {
    // Ngừng sự kiện click tiếp tục để tránh nó lan ra ngoài
    event.stopPropagation();

    // Nếu menu đang ẩn thì hiển thị, nếu đang hiển thị thì ẩn
    registeredUserDropdownMenu.classList.toggle('hidden');
});

// Đóng menu khi nhấn ra ngoài dropdown
document.addEventListener('click', (event) => {
    // Nếu click vào bên ngoài dropdown và button, đóng menu
    if (!userButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
        closeMenu();
    }
});

