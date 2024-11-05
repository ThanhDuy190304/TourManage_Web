
function StoreId(button) {
    const id = button.value;
    localStorage.setItem("selectedId", id); // Lưu ID vào localStorage
    window.location.href = `/tour_detail/${id}`; // Chuyển đến tour_detail với ID
}