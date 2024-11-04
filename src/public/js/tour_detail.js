const id = localStorage.getItem("selectedId"); // Lấy ID từ localStorage
  if (id) {
    console.log("ID cần tìm thông tin:", id);
    // Thực hiện xử lý tiếp theo
  }

  fetch('../json/Service.json')
    .then(response => response.json())
    .then(data => {
        // Giả sử data có đúng 3 nhà hàng
        const restaurants = data;
        const image= document.getElementById('main_img')
        const name= document.getElementById('main_name')
        const desc= document.getElementById('main_desc')
        const price= document.getElementById('main_price')
        const detail= document.getElementById('main_detail')
        const map= document.getElementById('map')
        restaurants.forEach((res,index) => {
          if (res.id===id){
            image.src=res.image;
            name.innerText = res.name;
            price.innerText = res.price;
            desc.innerText = res.description;
            detail.innerText = res.detail;
            map.innerText=`Home > Tour > ${res.name}`
          }
        });
    })
    .catch(error => console.error('Có lỗi xảy ra khi lấy dữ liệu:', error));