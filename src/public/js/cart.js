const userElement = document.getElementById('user-info');
const user = JSON.parse(userElement.getAttribute('data-user'));

const getCartItems = async () => {
  let cart
  if (!user) {
    cart = localStorage.getItem("cart");
    return cart ? JSON.parse(cart) : [];
  } else {
    try {
      response = await fetch(`/cart/getCartItemByUserID/${user.user_id}`); // Đường dẫn API để lấy sản phẩm
      if (!response.ok) throw new Error("Failed to fetch product data");
      cart = await response.json(); // Trả về dữ liệu sản phẩm
      return cart
    } catch (error) {
      console.error(`Khong lay duoc thong tin product`, error);
      return null;
    }
  }
};

async function updateCartItem(productId, quantity, price) {
  console.log(productId, quantity, price)
  if (!user) {
    // Không có user, cập nhật trong localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.map((item) => {
      if (item.tour_id === productId) {
        return { ...item, quantity, price }; // Cập nhật số lượng và giá
      }
      return item;
    });
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  } else {
    // Có user, cập nhật trong cơ sở dữ liệu
    try {
      await fetch(`/cart/updateCartItem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id,
          tour_id: productId,
          quantity,
          price,
        }),
      });
    } catch (error) {
      console.error("Error updating cart item:", error);
    }
  }
}

async function deleteCartItem(productId) {
  if (!user) {
    // Không có user, xóa trong localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.filter((item) => item.tour_id !== productId);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  } else {
    // Có user, xóa trong cơ sở dữ liệu
    try {
      await fetch(`/cart/deleteCartItem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.user_id,
          tour_id: productId,
        }),
      });
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  }
  await renderCartItems();
  await updateTotalPrice();
}

const fetchTourDates = async (tourId) => {
  try {
    const response = await fetch(`/tours/getAvailableDates/${tourId}`); // Đường dẫn API lấy các ngày có sẵn từ bảng detailedtour
    if (!response.ok) throw new Error("Failed to fetch tour dates");
    const tourDates = await response.json(); // Trả về mảng các ngày tour có sẵn
    console.log(tourDates)
    const tourDateSelect = document.getElementById(`tour-date-select-${tourId}`);
    tourDateSelect.innerHTML = "<option value=''>Select a date</option>"; // Xóa tất cả các lựa chọn cũ
    // Thêm các lựa chọn ngày vào select
    tourDates.forEach(date => {
      const option = document.createElement('option');
      option.value = date.detail_tour_id;
      option.textContent = date.tour_date;
      tourDateSelect.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching tour dates:", error);
  }
}

async function fetchSelectedTours() {
  const checkboxes = document.querySelectorAll('input[type="checkbox"]');
  const selectedTours = [];

  for (const checkbox of checkboxes) {
    if (checkbox.checked) {
      const itemTour = checkbox.closest('.item_tour'); // Lấy sản phẩm từ DOM
      const tourId = itemTour.getAttribute('data-id');
      const quantityElement = itemTour.querySelector('.quantity');
      const quantity = parseInt(quantityElement.innerText) || 1; // Lấy số lượng
      const nameTour = itemTour.querySelector('h2').innerText; // Lấy tên tour
      const priceTour = itemTour.querySelector('.price').innerText;
      // Fetch tour date từ cơ sở dữ liệu nếu cần
      const selectElement = itemTour.querySelector('select'); // Lấy thẻ <select>
      const detailTourId = selectElement.value;
      const tourDate = selectElement.options[selectElement.selectedIndex + 1].textContent;
      console.log(selectElement.selectedIndex)
      selectedTours.push({
        tour_id: tourId,
        name_tour: nameTour,
        tour_date: tourDate,
        quantity: quantity,
        detail_tour_id: detailTourId,
        price: priceTour
      });
      let response
      let nextRID, nextRDID
      try {
        response = await fetch(`/cart/getNextRID`); // Đường dẫn API để lấy sản phẩm
        if (!response.ok) throw new Error("Failed to fetch product data");
        nextRID = await response.json(); // Trả về dữ liệu sản phẩm
      } catch (error) {
        console.error(`Khong lay dc next CI ID`, error);
        return null;
      }

      try {
        response = await fetch(`/cart/getNextRDID`); // Đường dẫn API để lấy sản phẩm
        if (!response.ok) throw new Error("Failed to fetch product data");
        nextRDID = await response.json(); // Trả về dữ liệu sản phẩm
      } catch (error) {
        console.error(`Khong lay dc next CI ID`, error);
        return null;
      }
      console.log(nextRDID)
      try {
        response = await fetch('/cart/addReservationDetail', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reservationID: nextRID[0].next_reservationID,  // Mã chi nhánh
            detailReservationID: nextRDID[0].next_reservation_detail_ID,
            userID: user.user_id,
            tourID: tourId,
            quantity: quantity,
            price: priceTour,
          }),
        });
        if (response.ok) {
          console.log('Order submitted successfully!');
          // Xử lý phản hồi từ server nếu cần
        } else {
          console.error('Error submitting order');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }

  sessionStorage.setItem('reservationData', JSON.stringify(selectedTours));
  window.location.href = '#!';
}

// Hàm lấy thông tin sản phẩm từ cơ sở dữ liệu (qua API)
const fetchProductDetails = async (productId) => {
  try {
    const response = await fetch(`/tours/getTourbyID/${productId}`); // Đường dẫn API để lấy sản phẩm
    if (!response.ok) throw new Error("Failed to fetch product data");
    return await response.json(); // Trả về dữ liệu sản phẩm
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    return null;
  }
};

// Hàm render thông tin sản phẩm ra giao diện
const renderCartItems = async () => {
  const cartContainer = document.getElementById("cart-items"); // Phần tử HTML để render sản phẩm
  const cartIds = await getCartItems(); // Lấy danh sách ID từ localStorage
  console.log(cartIds)
  if (cartIds.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cartContainer.innerHTML = ""; // Xóa nội dung cũ
  cartIds.forEach(async (car) => {
    const product = await fetchProductDetails(car.tour_id);
    if (product) {
      // Tạo HTML cho từng sản phẩm
      const productHTML = `
        <!-- Cart -->
        <div class="bg-white p-6 rounded-lg shadow-md item_tour" data-id="${product[0].tour_id}" data-price=${product[0].prices}>
          <div class="flex items-start">
            <!-- Product Image -->
            <input onchange="updateTotalPrice()" type="checkbox" class="mr-4">
            <img src="${product[0].img_url}" alt="Product" class="w-20 h-20 object-cover rounded">
    
            <!-- Product Info -->
            <div class="ml-4 flex-1">
              <h2 class="font-semibold text-lg">${product[0].title}</h2>
              <p class="text-sm text-gray-500">Rate: ${product[0].rate} <i class="fa-solid fa-star"></i></p>
            </div>
            <select id="tour-date-select-${car.tour_id}">
              <option value="">Select a date</option>
              <!-- Các lựa chọn ngày sẽ được thêm vào ở đây -->
            </select>
            <!-- Price and Quantity -->
            <div class="ml-auto text-right">
              <div class="text-red-500 font-semibold text-xl price">${car.price}</div>
              <div class="flex items-center mt-4">
              <div class="flex items-start mr-4">
                <!-- Các phần tử khác -->
                <button class="delete px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Xóa</button>
              </div>
                <button class="decrease px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">-</button>
                <span class="quantity mx-2 w-12 text-center border rounded">${car.quantity}</span>
                <button class="increase px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
              </div>
            </div>
          </div>
        </div>
        `;
      cartContainer.innerHTML += productHTML; // Thêm sản phẩm vào danh sách
      await fetchTourDates(car.tour_id);
      console.log(car.tour_id)
    }
  })
  setTimeout(() => {
    const increaseButtons = document.querySelectorAll('.increase');
    const decreaseButtons = document.querySelectorAll('.decrease');
    const quantitySpans = document.querySelectorAll('.quantity');
    const priceSpans = document.querySelectorAll('.price');
    const dishSelects = document.querySelectorAll('.item_tour');

    increaseButtons.forEach((button, index) => {
      button.addEventListener('click', () => updateQuantity(index, 1, priceSpans, dishSelects, quantitySpans));
    });

    decreaseButtons.forEach((button, index) => {
      button.addEventListener('click', () => updateQuantity(index, -1, priceSpans, dishSelects, quantitySpans));
    });

    cartContainer.addEventListener('click', async (event) => {
      if (event.target.classList.contains('delete')) {
        const productId = event.target.closest('.item_tour').getAttribute("data-id");
        await deleteCartItem(productId);
      }
    });

    document.getElementById('reserve').addEventListener('click', async () => {
      const selectedTours = await fetchSelectedTours();
    })
  }, 3000); // Đợi 100ms để đảm bảo DOM được cập nhật hoàn toàn
};

// Gọi hàm render khi trang được tải
document.addEventListener("DOMContentLoaded", async () => {
  await renderCartItems();
  await updateTotalPrice()
});

function updateQuantity(index, change, priceSpans, dishSelects, quantitySpans) {
  const quantity = quantitySpans[index];
  const priceSpan = priceSpans[index];
  let currentQuantity = parseInt(quantity.innerText);

  currentQuantity += change;
  if (currentQuantity < 1) currentQuantity = 1;
  quantity.innerText = currentQuantity;
  const selectedOption = dishSelects[index];
  const price = selectedOption.getAttribute('data-price');
  priceSpan.innerText = `${(price * currentQuantity)} $`;

  updateTotalPrice()
  const productId = selectedOption.getAttribute('data-id');
  updateCartItem(productId, currentQuantity, price * currentQuantity);
}

function updateTotalPrice() {
  const priceElements = document.querySelectorAll('.price'); // Lấy tất cả các phần tử .price
  const checkboxes = document.querySelectorAll('input[type="checkbox"]'); // Lấy tất cả các checkbox được chọn
  let total = 0;

  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      const priceElement = priceElements[index]; // Lấy phần tử giá tương ứng với checkbox đã chọn
      const priceText = priceElement.innerText.replace(' $', '').replace(',', ''); // Loại bỏ đơn vị $ và dấu phẩy
      const price = parseInt(priceText) || 0; // Chuyển đổi sang số nguyên
      total += price;
    }
  });

  // Hiển thị tổng giá
  const totalPriceElement = document.getElementById('totalPrice');
  totalPriceElement.innerText = `${total.toLocaleString()} $`; // Định dạng số với dấu phẩy
}