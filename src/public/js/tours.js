// Ấn vào để đến trang chi tiết của tour
function StoreId(button) {
    const id = button.value;
    window.location.href = `/tours/${id}`; // Chuyển đến tour_detail với ID
}

let currentPage = 1;
let totalpage;

const minPrice = document.getElementById('min-price');
const maxPrice = document.getElementById('max-price');
const minPriceLabel = document.getElementById('min-price-label');
const maxPriceLabel = document.getElementById('max-price-label');
const sliderRange = document.getElementById('slider-range');

// Mỗi lần ấn filter, chuyển trang di chuyển lên đầu
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

    // Khôi phục giá trị minPrice và maxPrice
    const minPriceParam = params.get("minPrice");
    const maxPriceParam = params.get("maxPrice");
    if (minPriceParam) {
        const minPrice = document.getElementById("min-price");
        if (minPrice) {
            minPrice.value = minPriceParam; // Đặt giá trị minPrice
        }
    }
    if (maxPriceParam) {
        const maxPrice = document.getElementById("max-price");
        if (maxPrice) {
            maxPrice.value = maxPriceParam; // Đặt giá trị maxPrice
        }
    }

    // Cập nhật lại thanh slider
    updateSlider();

    const sortParam = params.get("sort"); // Lấy giá trị sort từ URL
    if (sortParam) {
        const sortSelect = document.getElementById("sortSelect");
        console.log(sortSelect)
        if (sortSelect) {
            // Chọn option có value khớp với `sortParam`
            const optionToSelect = Array.from(sortSelect.options).find(option => option.value === sortParam);
            if (optionToSelect) {
                sortSelect.value = sortParam; // Gán đúng giá trị value
            }
        }
    }

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
    // Thêm giá trị minPrice và maxPrice
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');
    if (minPrice && minPrice.value) {
        filters["minPrice"] = minPrice.value; // Giá trị minPrice
    }
    if (maxPrice && maxPrice.value) {
        filters["maxPrice"] = maxPrice.value; // Giá trị maxPrice
    }
    // Thêm giá trị sắp xếp
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect && sortSelect.value) {
        filters["sort"] = sortSelect.value; // Giá trị sắp xếp
    }
    console.log(filters)
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
            renderHTML(data.paginatedTours);

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
function renderHTML(paginatedTours) {
    const tourList = document.getElementById('showTours');
    let html = '';
            if (paginatedTours.length === 0) {
                html = '<p>No tours available</p>';
            }
            paginatedTours.forEach(tour => {
                html += `
                <a href="/tours/${tour.tour_id}" class="w-80 md:w-96 lg:w-80 mx-auto">
                    <div
                        class="flex flex-col justify-between bg-white rounded-lg shadow-lg overflow-hidden w-80 md:w-96 lg:w-80 h-96 tour transition-transform duration-300 ease-in-out hover:scale-105 mx-auto">
                        <div>
                            <!-- Giảm kích thước hình ảnh -->
                            <img src="${tour.img_url}" alt="" class="img w-full h-36 object-cover">
                            <div class="p-4">
                                <div class="flex justify-between mt-4 h-16">
                                    <h3 class="name text-lg font-semibold">${tour.title}</h3>
                                    <p class="price text-gray-600">$${tour.prices}</p>
                                </div>
                                <p class="text-gray-600 w-full overflow-hidden text-ellipsis line-clamp-2">
                                ${tour.brief}
                                </p>
                            </div>
                        </div>
                        <div class="flex justify-between px-4">
                            <div class="flex">
                                <i class="fa-solid fa-star text-yellow-500"></i>
                                <i class="fa-solid fa-star text-yellow-500"></i>
                                <i class="fa-solid fa-star text-yellow-500"></i>
                                <i class="fa-solid fa-star text-yellow-500"></i>
                                <i class="fa-solid fa-star text-yellow-500"></i>
                            </div>
                            <button type="button"
                                class="self-end mb-4 px-4 py-2 bg-green-900 text-white rounded-full hover:bg-green-950 btn"
                                value="${tour.tour_id}" onclick="StoreId(this)">View
                                Detail</button>
                        </div>
                    </div>
                </a>
                `;
            });
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
    const sortSelect = document.getElementById('sortSelect');
    
    if (sortSelect) {
        sortSelect.addEventListener("change", function () {
            applyFilters();
        });
    }

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

    minPrice.addEventListener('input', ()=>{
        currentPage = 1;
        updateSlider()
    });
    maxPrice.addEventListener('input', ()=>{
        currentPage = 1;
        updateSlider()
    });

    restoreFiltersFromURL();
    const totalPages = parseInt(document.querySelector('.pagination').getAttribute('value')) || 1;
    totalpage=totalPages
    renderPageButtons(totalPages)
});

function updateSlider() {
    const min = parseInt(minPrice.value);
    const max = parseInt(maxPrice.value);

    // Prevent overlap
    if (min >= max) {
        if (this.id === 'min-price') {
            minPrice.value = max - 10000;
        } else {
            maxPrice.value = min + 10000;
        }
    }
    // Update labels
    minPriceLabel.textContent = `${minPrice.value} vnd`;
    maxPriceLabel.textContent = `${maxPrice.value} vnd`;

    // Update range highlight
    const percentMin = (minPrice.value / maxPrice.max) * 100;
    const percentMax = (maxPrice.value / maxPrice.max) * 100;
    sliderRange.style.left = `${percentMin}%`;
    sliderRange.style.right = `${100 - percentMax}%`;
    applyFilters()
}