fetch('/json/Service.json')
    .then(response => response.json())
    .then(data => {
        // Giả sử data có đúng 3 nhà hàng
        const restaurants = data;
        const btns = document.getElementsByClassName('btn')
        const images = document.getElementsByClassName('img')
        const names = document.getElementsByClassName('name')
        const prices = document.getElementsByClassName('price')
        const descs = document.getElementsByClassName('desc')

        restaurants.forEach((res, index) => {
            btns[index].value = res.id;
            images[index].src = res.image;
            names[index].textContent = res.name;
            prices[index].textContent = res.price;
            descs[index].textContent = res.description;
        });
    })
    .catch(error => console.error('Có lỗi xảy ra khi lấy dữ liệu:', error));

function StoreId(button) {
    const id = button.value;
    localStorage.setItem("selectedId", id); // Lưu ID vào localStorage
    window.location.href = `/tour_detail/${id}`; // Chuyển đến tour_detail với ID
}