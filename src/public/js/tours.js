
function StoreId(button) {
    const id = button.value;
    const idlocation = button.dataset.name;
    window.location.href = `/tours/tour_detail/${id}/${idlocation}`; // Chuyển đến tour_detail với ID
}

// Load tìm kiếm trước đó
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInf');
    
    // Kiểm tra xem có giá trị tìm kiếm trong localStorage không
    const savedQuery = localStorage.getItem('searchQuery');
    if (savedQuery) {
        searchInput.value = savedQuery;  // Điền lại giá trị vào ô input
    }
    const savedState = localStorage.getItem('checkboxState');
    if (savedState) {
        const state = JSON.parse(savedState);
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');

        checkboxes.forEach(checkbox => {
            // Kiểm tra xem giá trị checkbox có trong danh sách đã lưu không
            if (state[checkbox.name] && state[checkbox.name].includes(checkbox.value)) {
                checkbox.checked = true;  // Đánh dấu checkbox đã chọn
            } else {
                checkbox.checked = false;  // Bỏ đánh dấu checkbox chưa chọn
            }
        });
    }
});

//Lưu tìm kiếm trước đó
const saveSearch = () => {
    const searchInput = document.getElementById('searchInf');
    localStorage.setItem('searchQuery', searchInput.value);
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const state = {};
    
    checkboxes.forEach(checkbox => {
        state[checkbox.name] = state[checkbox.name] || [];
        if (checkbox.checked) {
            state[checkbox.name].push(checkbox.value);
        }
    });

    // Lưu trạng thái vào localStorage
    localStorage.setItem('checkboxState', JSON.stringify(state));
};
document.getElementById('btnSearch').addEventListener('click', saveSearch);


// Tách danh sách tour thành nhiều trang

let currentPage = 1;
const itemsPerPage = 6;

function showPage(page) {
    const services = document.querySelectorAll('.tour');
    const totalPages = Math.ceil(services.length / itemsPerPage);
    if(totalPages==0) {document.querySelector('.pagination > button:first-child').disabled = true;
    document.querySelector('.pagination > button:last-child').disabled =true;
    }
    // Ensure the current page is within valid range
    if (page < 1) page = 1;
    if (page > totalPages) page = totalPages;

    // Hide all items
    services.forEach(service => service.style.display = 'none');

    // Calculate the start and end index for the current page
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;

    // Show items for the current page
    for (let i = startIndex; i < endIndex && i < services.length; i++) {
        services[i].style.display = 'flex';
    }

    // Update the current page and render page buttons
    currentPage = page;
    renderPageButtons(totalPages);
}

function renderPageButtons(totalPages) {
    const pageNumbersContainer = document.getElementById('pageNumbers');
    pageNumbersContainer.innerHTML = ''; // Clear previous buttons

    // Generate a button for each page number
    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.onclick = () => showPage(i);

        // Highlight the current page button
        if (i === currentPage) {
            pageButton.classList.add('active');
        }

        pageNumbersContainer.appendChild(pageButton);
    }

    // Disable/enable previous and next buttons based on the current page
    document.querySelector('.pagination > button:first-child').disabled = (currentPage === 1);
    document.querySelector('.pagination > button:last-child').disabled = (currentPage === totalPages);
}

function nextPage() {
    const services = document.querySelectorAll('.tour');
    const totalPages = Math.ceil(services.length / itemsPerPage);
    if (currentPage < totalPages) {
        showPage(currentPage + 1);
    }
}

function prevPage() {
    if (currentPage > 1) {
        showPage(currentPage - 1);
    }
}

// Initial display of the first page
showPage(currentPage);
