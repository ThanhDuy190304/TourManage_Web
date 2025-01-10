function confirmReservation() {
    const fullname = document.getElementById('user_fullname').value.trim();
    const contact = document.getElementById('user_contact').value.trim();

    if (!fullname) {
        alert('Please enter your full name.');
        return;
    }

    if (!contact) {
        alert('Please enter your contact information.');
        return;
    }

    const reservationDataArray = sessionStorage.getItem('reservationDataArray');
    if (!reservationDataArray) {
        alert('No reservation data available.');
        return;
    }

    // Hiển thị dialog chọn phương thức thanh toán
    const paymentDialog = document.getElementById('paymentDialog');
    paymentDialog.classList.remove('hidden');

    // Xử lý sự kiện cho các nút trong dialog
    const payByCashButton = document.getElementById('payByCash');
    const payOnlineButton = document.getElementById('payOnline');
    const closeDialogButton = document.getElementById('closeDialog');

    function submitPaymentMethod(byCash) {
        paymentDialog.classList.add('hidden');

        sessionStorage.setItem('returnTo', window.location.href);

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/reservation/api/confirm-reservation';

        // Gửi dữ liệu thông tin khách hàng
        const fullnameInput = document.createElement('input');
        fullnameInput.type = 'hidden';
        fullnameInput.name = 'userFullName';
        fullnameInput.value = fullname;
        form.appendChild(fullnameInput);

        const contactInput = document.createElement('input');
        contactInput.type = 'hidden';
        contactInput.name = 'userContact';
        contactInput.value = contact;
        form.appendChild(contactInput);

        // Gửi dữ liệu giỏ hàng
        const reservationDataInput = document.createElement('input');
        reservationDataInput.type = 'hidden';
        reservationDataInput.name = 'reservationDataArray';
        reservationDataInput.value = reservationDataArray;
        form.appendChild(reservationDataInput);
        // Gửi phương thức thanh toán
        const paymentMethodInput = document.createElement('input');
        paymentMethodInput.type = 'hidden';
        paymentMethodInput.name = 'payMethod';
        paymentMethodInput.value = byCash ? 'payByCash' : 'payOnline';
        form.appendChild(paymentMethodInput);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    }

    payByCashButton.addEventListener('click', () => submitPaymentMethod(true));
    payOnlineButton.addEventListener('click', () => submitPaymentMethod(false));
    closeDialogButton.addEventListener('click', () => paymentDialog.classList.add('hidden'));
}

document.addEventListener('DOMContentLoaded', () => {
    const confirmButton = document.getElementById('confirmButton');
    confirmButton.addEventListener('click', () => {
        confirmReservation();
    });
});
