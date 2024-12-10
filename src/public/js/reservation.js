function confirmReservation() {
    const reservationDataArray = sessionStorage.getItem('reservationDataArray');
    if (!reservationDataArray) {
        alert('No reservation data available.');
        return;
    }
    sessionStorage.setItem('returnTo', window.location.href);
    // Tạo form để gửi dữ liệu
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/reservation/api/confirm-reservation';
    // Tạo input ẩn để gửi dữ liệu reservationDataArray
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'reservationDataArray';
    input.value = reservationDataArray;
    form.appendChild(input);
    // Gửi form
    document.body.appendChild(form);
    form.submit();
}

document.addEventListener('DOMContentLoaded', () => {
    const confirmButton = document.getElementById('confirmButton');
    confirmButton.addEventListener('click', () => {
        confirmReservation();
    });

});
