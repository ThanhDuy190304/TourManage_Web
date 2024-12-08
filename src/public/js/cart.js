// Update số lượng, tiền và tổng tiền
function updateQuantity(index,change, priceSpans, dishSelects, quantitySpans,dateItems) {
    const quantity = quantitySpans[index];
    const priceSpan = priceSpans[index];
    let currentQuantity = parseInt(quantity.innerText);

    currentQuantity += change;
    if (currentQuantity < 1) currentQuantity = 1;
    quantity.innerText = currentQuantity;

    const dateItem = dateItems[index];
    const schedualID = dateItem.getAttribute('data-schedual');

    const selectedOption = dishSelects[index];
    const price = selectedOption.getAttribute('data-price');
    priceSpan.innerText = `${(price * currentQuantity)} $`;

    updateTotalPrice()
    const productId = selectedOption.getAttribute('data-id');
    changeQuantityCartItem(productId, change, schedualID);
}

// Sau khi trnag web load thì lắng nghe
const increaseButtons = document.querySelectorAll('.increase');
    const decreaseButtons = document.querySelectorAll('.decrease');
    const deleteButtons = document.querySelectorAll('.delete');
    const quantitySpans = document.querySelectorAll('.quantity');
    const dateItems = document.querySelectorAll('.date');
    const priceSpans = document.querySelectorAll('.price');
    const dishSelects = document.querySelectorAll('.item_tour');
  
    increaseButtons.forEach((button, index) => {
      button.addEventListener('click', () => updateQuantity(index, 1, priceSpans, dishSelects, quantitySpans,dateItems));
    });
  
    decreaseButtons.forEach((button, index) => {
      button.addEventListener('click', () => updateQuantity(index, -1, priceSpans, dishSelects, quantitySpans,dateItems));
    });

    deleteButtons.forEach((button) => {
        button.addEventListener('click', async (e) => {
            const itemTour = e.target.closest('.item_tour');
            const productId = itemTour.getAttribute("data-id");

            const dateElement = itemTour.querySelector('.date');
            const schedualId = dateElement.getAttribute("data-schedual");
            await deleteCartItem(productId,schedualId);
        });
    });

document.getElementById('reserve').addEventListener('click', () => handleBooking())



// Sử dụng Ajax khi xóa đi một item
const renderCartItems = async () => {
    const cart = JSON.parse(localStorage.getItem('cartDataArray'));

    const cartContainer = document.getElementById("cart-items"); // Phần tử HTML để render sản phẩm
    let data

    const response = await fetch(`/cart/ajaxCartItems?cartDataArray=${JSON.stringify(cart)}`); // Yêu cầu bất đồng bộ
    if (!response) {
        throw new Error('Lỗi mạng: ' + response.status);
    }
    data = await response.json(); // Chuyển đổi phản hồi thành JSON
    console.log("Fetched data:", data);

    if (data.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }
  
    cartContainer.innerHTML = ""; // Xóa nội dung cũ
    data.forEach(async (car)=>{
      if (car) {
        // Tạo HTML cho từng sản phẩm
        const productHTML = `
        <div class="bg-white p-6 rounded-lg shadow-md item_tour" data-id="${car.tourId}" data-price="${car.prices}">
            <div class="flex items-start">
                <!-- Product Image -->
                <input onchange="updateTotalPrice()" type="checkbox" class="mr-4">
                <img src="${car.firstImage}" alt="Product" class="w-20 h-20 object-cover rounded">
                <!-- Product Info -->
                <div class="ml-4 flex-1">
                    <h2 class="font-semibold text-lg">${car.title}</h2>
                    <p class="text-sm text-gray-500">Rate: ${car.rate} <i class="fa-solid fa-star"></i></p>
                    <p class="voucher text-sm text-gray-500">Voucher: ${car.voucher} %</p>
                </div>

                <div class="tour-date mt-2">
                    <p class="date text-sm text-gray-500" data-schedual=${car.scheduleId}>Tour Date: ${car.tourDate}</p>
                </div>

                <!-- Price and Quantity -->
                <div class="ml-auto text-right">
                    <div class="text-red-500 font-semibold text-xl price">${car.prices}</div>
                    <div class="flex items-center mt-4">
                        <div class="flex items-start mr-4">
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
      }
    })
    setTimeout(() => {
        const increaseButtons = document.querySelectorAll('.increase');
        const decreaseButtons = document.querySelectorAll('.decrease');
        const deleteButtons = document.querySelectorAll('.delete');
        const quantitySpans = document.querySelectorAll('.quantity');
        const dateItems = document.querySelectorAll('.date');
        const priceSpans = document.querySelectorAll('.price');
        const dishSelects = document.querySelectorAll('.item_tour');
      
        increaseButtons.forEach((button, index) => {
          button.addEventListener('click', () => updateQuantity(index, 1, priceSpans, dishSelects, quantitySpans,dateItems));
        });
      
        decreaseButtons.forEach((button, index) => {
          button.addEventListener('click', () => updateQuantity(index, -1, priceSpans, dishSelects, quantitySpans,dateItems));
        });
    
        deleteButtons.forEach((button) => {
            button.addEventListener('click', async (e) => {
                const itemTour = e.target.closest('.item_tour');
                const productId = itemTour.getAttribute("data-id");
    
                const dateElement = itemTour.querySelector('.date');
                const schedualId = dateElement.getAttribute("data-schedual");
                await deleteCartItem(productId,schedualId);
            });
        });
    }, 1000);
};

//Xử lý đặt
async function handleBooking(){
    
    const selectedItems = []; // Mảng chứa các đối tượng đã chọn
    const cartItems = document.querySelectorAll('.item_tour');

    cartItems.forEach((item) => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        if (checkbox.checked) {
            const tourId = item.getAttribute('data-id');
            const price = parseFloat(item.getAttribute('data-price'));
            const title = item.querySelector('h2').innerText;
            const tourDate = item.querySelector('.date').innerText.replace('Tour Date: ', '').trim();
            const scheduleId = item.querySelector('.date').getAttribute('data-schedual');
            const voucher = parseFloat(item.querySelector('.voucher').innerText.replace('Voucher: ', '').replace('%', '').trim());
            const quantity = parseInt(item.querySelector('.quantity').innerText);

            selectedItems.push({
                tourId: tourId,
                title: title,
                prices: price,
                tourDate: tourDate,
                quantity: quantity,
                scheduleId: scheduleId,
                voucher: voucher
            });
        }
    });

    console.log(selectedItems);
}


// Thay đổi số lượng một sản phẩm trong giỏ hàng
async function changeQuantityCartItem(tourId, quantity,scheduleId) {
    try {
        const response = await fetch('/cart/api/changeQuantityCartItems', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tourId: tourId, scheduleId: scheduleId, quantity: quantity })
        });

        if (response.status === 200) {
            console.log("Change successfully!");
        } 
        else if (response.status === 401) {
            const cart = JSON.parse(localStorage.getItem('cartDataArray'));
            console.log(cart)
            const updatedCart = cart.map((item) => {
                if (item.tourId === tourId) {
                return {tourId: item.tourId,scheduleId: item.scheduleId, quantity: `${Number(item.quantity) + Number(quantity)}`}; // Cập nhật số lượng và giá
                }
                return item;
            });
            localStorage.setItem("cartDataArray", JSON.stringify(updatedCart));

        }
    } catch (error) {
        console.error("Error change quatity to cart:", error);
    }
}

// Xóa một sản phẩm khỏi giỏ hàng
async function deleteCartItem(tourId, scheduleId) {
    try {
        const response = await fetch('/cart/api/deleteCartItems', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tourId: tourId, scheduleId: scheduleId})
        });

        if (response.status === 200) {
            console.log("Delete successfully!");
        } 
        else if (response.status === 401) {
            const cart = JSON.parse(localStorage.getItem("cartDataArray")) || [];
            const updatedCart = cart.filter((item) => item.tourId !== tourId);
            localStorage.setItem("cartDataArray", JSON.stringify(updatedCart));
        }
    } catch (error) {
        console.error("Error delete item to cart:", error);
    }
    renderCartItems();
  }

  // Update Tổng tiền
  function updateTotalPrice() {
    const priceElements = document.querySelectorAll('.price'); // Lấy tất cả các phần tử .price
    const checkboxes = document.querySelectorAll('input[type="checkbox"]'); // Lấy tất cả các checkbox được chọn
    let total = 0;
  
    checkboxes.forEach((checkbox, index) => {
      if(checkbox.checked){
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