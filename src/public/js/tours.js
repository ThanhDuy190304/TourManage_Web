
function StoreId(button) {
    const id = button.value;
    const idlocation = button.dataset.name;
    window.location.href = `/tours/tour_detail/${id}/${idlocation}`; // Chuyển đến tour_detail với ID
}


document.addEventListener("DOMContentLoaded", function () {
    // Lấy tất cả các select dropdowns
    const locationSelect = document.getElementById("location");
    const priceSelect = document.getElementById("price");
    const rateSelect = document.getElementById("rate");
    const voucherSelect = document.getElementById("voucher");

    // Lấy container để hiển thị các lựa chọn
    const selectedFiltersContainer = document.getElementById("selected-filters");
    // Hàm khôi phục trạng thái filter từ URL
    function restoreFiltersFromURL() {
        const params = new URLSearchParams(window.location.search);

        // Lặp qua các tham số URL và khôi phục giá trị
        params.forEach((value, key) => {
            const select = document.querySelector(`select[name="${key}"]`);
            if (select) {
                select.value = value; // Đặt lại giá trị cho dropdown
                const label = select.options[select.selectedIndex]?.text;
                createFilterElement(key, value, label); // Tạo filter trong container
            }
        });
    }

    restoreFiltersFromURL();
    // Hàm tạo một thẻ cho lựa chọn
    function createFilterElement(name, value, label) {
        const filterElement = document.createElement("div");
        filterElement.classList.add("bg-gray-200", "px-4", "py-2", "rounded", "flex", "items-center", "gap-2");
        filterElement.textContent = label;

        // Thêm thuộc tính `data-name` và `data-value`
        filterElement.setAttribute("data-name", name); // Để truy vấn theo name
        filterElement.setAttribute("data-value", value); // Để lưu giá trị đã chọn

        // Thêm dấu "X" để xóa
        const closeButton = document.createElement("span");
        closeButton.textContent = "X";
        closeButton.classList.add("cursor-pointer", "text-red-600");
        closeButton.addEventListener("click", () => {
            // Xóa thẻ khi nhấn dấu "X"
            filterElement.remove();
            // Xóa giá trị đã chọn trong select
            const select = document.querySelector(`select[name="${name}"]`);
            select.value = ""; // Reset dropdown về giá trị mặc định
            applyFilters();
        });

        // Gắn closeButton vào `filterElement`
        filterElement.appendChild(closeButton);

        // Thêm `filterElement` vào container
        selectedFiltersContainer.appendChild(filterElement);
    }


    // Hàm xử lý sự kiện thay đổi lựa chọn
    function handleSelectionChange(select, name) {
        const selectedValue = select.value;
        const selectedLabel = select.options[select.selectedIndex]?.text;

        // Xóa các lựa chọn cũ trước khi tạo thẻ mới
        clearSelectedFilters(name);

        if (selectedValue) {
            // Tạo thẻ mới với giá trị vừa chọn
            createFilterElement(name, selectedValue, selectedLabel);
        }

        applyFilters();

    }

    // Hàm xóa các filter đã chọn trước đó
    function clearSelectedFilters(name) {
        // Lọc và xóa tất cả các thẻ có data-name trùng với name của dropdown
        const filters = selectedFiltersContainer.querySelectorAll(`[data-name="${name}"]`);
        filters.forEach(filter => filter.remove());
    }


    function applyFilters() {
        const filters = {};
        // Duyệt qua tất cả các thẻ filter trong `selected-filters`
        const selectedFilters = selectedFiltersContainer.querySelectorAll("[data-name]"); // Lấy tất cả thẻ có `data-name`
        selectedFilters.forEach(filter => {
            const name = filter.getAttribute("data-name");
            const value = filter.getAttribute("data-value");

            if (value) {
                filters[name] = value;
            }
        });

        const queryParams = new URLSearchParams(filters).toString();

        const newUrl = `/tours?${queryParams}`;
        window.location.href = newUrl;
    }

    // Lắng nghe sự thay đổi của các select
    locationSelect.addEventListener("change", function () {
        console.log("Location dropdown changed");

        handleSelectionChange(locationSelect, "location");
    });

    priceSelect.addEventListener("change", function () {
        handleSelectionChange(priceSelect, "price");
    });

    rateSelect.addEventListener("change", function () {
        handleSelectionChange(rateSelect, "rate");
    });

    voucherSelect.addEventListener("change", function () {
        handleSelectionChange(voucherSelect, "voucher");
    });


});

let currentPage = 1;
const itemsPerPage = 6;

function showPage(page) {
    const services = document.querySelectorAll('.tour');
    const totalPages = Math.ceil(services.length / itemsPerPage);
    if (totalPages == 0) {
        document.querySelector('.pagination > button:first-child').disabled = true;
        document.querySelector('.pagination > button:last-child').disabled = true;
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
