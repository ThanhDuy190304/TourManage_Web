function StoreId(button) {
    const id = button.value;
    window.location.href = `/tours/${id}`; // Chuyển đến tour_detail với ID
}

let currentPage = 1;
let totalpage;

function scrollToProductList() {
    const productList = document.getElementById('divide'); // Phần tử danh sách sản phẩm
    if (productList) {
        productList.scrollIntoView({ behavior: 'smooth' }); // Cuộn mượt mà đến phần tử
    }
}


// Lấy container để hiển thị các lựa chọn
const selectedFiltersContainer = document.getElementById("selected-filters");

// Hàm khôi phục trạng thái filter từ URL
function restoreFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get("query");
    if (searchParam) {
        const searchInput = document.getElementById("searchInput");
        if (searchInput) {
            searchInput.value = searchParam;  // Đặt giá trị tìm kiếm vào ô input
        }
    }
    // Lặp qua các tham số URL và khôi phục giá trị
    params.forEach((value, key) => {
        const radio = document.querySelector(`input[name="${key}"][value="${value}"]`);
        if (radio) {
            radio.checked = true; // Đánh dấu radio button đã chọn
            const label = radio.nextElementSibling?.textContent;
            createFilterElement(key, value, label); // Tạo filter trong container
        }
    });
    currentPage = params.get("page") || 1;
}

// Hàm tạo một thẻ cho lựa chọn
function createFilterElement(name, value, label) {
    const filterElement = document.createElement("div");
    filterElement.classList.add("bg-emerald-800", "text-white", "px-4", "py-2", "rounded", "flex", "items-center", "gap-2");
    filterElement.textContent = label;

    // Thêm thuộc tính `data-name` và `data-value`
    filterElement.setAttribute("data-name", name);
    filterElement.setAttribute("data-value", value);

    // Thêm dấu "X" để xóa
    const closeButton = document.createElement("span");
    closeButton.textContent = "X";
    closeButton.classList.add("cursor-pointer", "text-red-400");
    closeButton.addEventListener("click", () => {
        // Xóa thẻ khi nhấn dấu "X"
        filterElement.remove();
        currentPage = 1;
        // Xóa giá trị đã chọn trong radio
        const radio = document.querySelector(`input[name="${name}"][value="${value}"]`);
        if (radio) {
            radio.checked = false; // Hủy chọn radio button
        }
        applyFilters();
    });

    // Gắn closeButton vào `filterElement`
    filterElement.appendChild(closeButton);

    // Thêm `filterElement` vào container
    selectedFiltersContainer.appendChild(filterElement);
}

// Hàm xử lý sự kiện thay đổi lựa chọn
function handleSelectionChange(name, value, label) {
    // Xóa các lựa chọn cũ trước khi tạo thẻ mới
    clearSelectedFilters(name);

    if (value) {
        // Tạo thẻ mới với giá trị vừa chọn
        createFilterElement(name, value, label);
    }
    applyFilters();
}

// Hàm xóa các filter đã chọn trước đó
function clearSelectedFilters(name) {
    // Lọc và xóa tất cả các thẻ có data-name trùng với name của radio
    const filters = selectedFiltersContainer.querySelectorAll(`[data-name="${name}"]`);
    filters.forEach(filter => filter.remove());
}

// Áp dụng filter và lấy nội dung để render ra
function applyFilters() {
    const filters = {};
    // Duyệt qua tất cả các thẻ filter trong `selected-filters`
    const selectedFilters = selectedFiltersContainer.querySelectorAll("[data-name]");
    selectedFilters.forEach(filter => {
        const name = filter.getAttribute("data-name");
        const value = filter.getAttribute("data-value");

        if (value) {
            filters[name] = value;
        }
    });
    const searchInput = document.getElementById("searchInput");
    if (searchInput && searchInput.value) {
        filters["query"] = searchInput.value;  // Thêm giá trị tìm kiếm vào filters
    }
    filters["page"] = currentPage;

    // Tạo query parameters từ bộ lọc (filters)
    const queryParams = new URLSearchParams(filters).toString();
    fetch(`/tours/api?${queryParams}`) // Yêu cầu bất đồng bộ
        .then(response => {
            if (!response.ok) {
                throw new Error('Lỗi mạng: ' + response.status);
            }
            return response.json(); // Chuyển đổi phản hồi thành JSON
        })
        .then(data => {
            // Hiển thị nội dung HTML trả về từ server
            renderHTML(data.html);

            // Hiển thị các nút phân trang
            renderPageButtons(data.totalPages);
            totalpage = data.totalPages;
            // Cập nhật URL trên trình duyệt mà không tải lại trang
            updateURL(queryParams);
        })
        .catch(error => {
            console.error('Lỗi:', error);
        });
    scrollToProductList()
}

// Render ra List những tour
function renderHTML(html) {
    const tourList = document.getElementById('showTours');
    tourList.innerHTML = html;  // Thay thế nội dung hiện tại bằng HTML mới
}

// Update URL người dùng thay đổi
function updateURL(queryParams) {
    const newURL = `${window.location.pathname}?${queryParams}`;
    history.pushState(null, '', newURL);  // Cập nhật URL mà không làm tải lại trang
}

// Hàm hiển thị các nút phân trang
function renderPageButtons(totalPages) {
    console.log(currentPage)
    const pageNumbersContainer = document.getElementById('pageNumbers');
    pageNumbersContainer.innerHTML = ''; // Xóa các nút phân trang hiện tại

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.innerText = i;
        pageButton.onclick = () => {
            currentPage = i;
            applyFilters(); // Gọi AJAX khi nhấn vào số trang
        }

        if (i == currentPage) {
            pageButton.classList.add('active');
        }

        pageNumbersContainer.appendChild(pageButton);
    }
    // Cập nhật trạng thái nút Previous và Next
    document.getElementById('prev-page').disabled = currentPage === 1;
    document.getElementById('next-page').disabled = currentPage === totalPages;
}


function nextPage() {
    if (currentPage < totalpage) {
        currentPage++;
        applyFilters();
    }
}

// Hàm quay lại trang trước
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        applyFilters();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const locationRadios = document.querySelectorAll('input[name="location"]');
    const priceRadios = document.querySelectorAll('input[name="price"]');
    const rateRadios = document.querySelectorAll('input[name="rate"]');
    const voucherRadios = document.querySelectorAll('input[name="voucher"]');
    // Lắng nghe sự thay đổi của các radio buttons
    locationRadios.forEach(radio => {
        radio.addEventListener("change", function () {
            const selectedLabel = radio.nextElementSibling?.textContent;
            currentPage = 1;
            handleSelectionChange("location", radio.value, selectedLabel);
        });
    });

    priceRadios.forEach(radio => {
        radio.addEventListener("change", function () {
            const selectedLabel = radio.nextElementSibling?.textContent;
            currentPage = 1;
            handleSelectionChange("price", radio.value, selectedLabel);
        });
    });

    rateRadios.forEach(radio => {
        radio.addEventListener("change", function () {
            const selectedLabel = radio.nextElementSibling?.textContent;
            currentPage = 1;
            handleSelectionChange("rate", radio.value, selectedLabel);
        });
    });

    voucherRadios.forEach(radio => {
        radio.addEventListener("change", function () {
            const selectedLabel = radio.nextElementSibling?.textContent;
            currentPage = 1;
            handleSelectionChange("voucher", radio.value, selectedLabel);
        });
    });
    restoreFiltersFromURL();
    applyFilters();
});

