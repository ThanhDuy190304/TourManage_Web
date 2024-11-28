function showContent(contentType) {

    const contentProfile = document.getElementById('contentProfile');
    let filePath = '';

    // Chọn đường dẫn dựa trên contentType
    if (contentType === 'profile') {
        filePath = '/profile/editProfile';
    } else if (contentType === 'booking') {
        filePath = '';
    }

    // Sử dụng fetch để lấy nội dung HTML và hiển thị vào #contentProfile
    fetch(filePath)
        .then(response => response.text())
        .then(html => {
            contentProfile.innerHTML = html;
        })
        .catch(error => {
            console.error('Lỗi khi tải nội dung:', error);
            contentProfile.innerHTML = '<p>Không thể tải nội dung.</p>';
        });
}