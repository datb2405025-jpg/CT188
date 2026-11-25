/* ================================================================
TÁC GIẢ
        PHAN QUỐC HẬU
        B2408849

        ngày thực hiện:25/11/2026
        ngày update 1:25/11/2026
================================================================
*/
/* CT188-BGR phần 2: DOM, sự kiện submit/input và kiểm tra form.
   Form chỉ mô phỏng trên trình duyệt, không gửi email hoặc gọi API. */

// ================= 1. TÌM CÁC PHẦN TỬ HTML =================
const contactForm = document.getElementById('contact-form');
const contactName = document.getElementById('contact-name');
const contactEmail = document.getElementById('contact-email');
const contactContent = document.getElementById('contact-content');
const contactMessage = document.getElementById('contact-message');

// ================= 2. HIỂN THỊ LỖI Ở FORM VÀ ĐƯA CON TRỎ ĐẾN Ô CẦN SỬA =================
function showContactError(input, message) {
    contactMessage.textContent = message;
    contactMessage.classList.remove('is-success');
    contactMessage.style.display = 'block';
    // Đánh dấu ô sai cho CSS tô viền và hỗ trợ trình đọc màn hình.
    input.setAttribute('aria-invalid', 'true');
    input.focus();
}

// Xóa thông báo và đánh dấu lỗi cũ khi người dùng sửa nội dung.
function clearContactMessage() {
    contactMessage.textContent = '';
    contactMessage.style.display = 'none';
    contactMessage.classList.remove('is-success');
    contactName.removeAttribute('aria-invalid');
    contactEmail.removeAttribute('aria-invalid');
    contactContent.removeAttribute('aria-invalid');
}

// ================= 3. KIỂM TRA DỮ LIỆU VÀ HIỂN THỊ PHẢN HỒI MÔ PHỎNG =================
function submitContact(event) {
    // Giữ lại trang hiện tại để báo kết quả bằng DOM.
    event.preventDefault();
    clearContactMessage();

    contactName.value = contactName.value.trim();
    contactEmail.value = contactEmail.value.trim();
    contactContent.value = contactContent.value.trim();

    if (contactName.value === '') {
        showContactError(contactName, 'Vui lòng nhập họ và tên.');
        return;
    }

    // checkValidity dùng quy tắc của input type="email" và required.
    // Kiểm tra dựa trên thuộc tính required và type="email" của ô HTML, không dùng API bên ngoài.
    if (!contactEmail.checkValidity()) {
        showContactError(contactEmail, 'Vui lòng nhập địa chỉ email hợp lệ.');
        return;
    }

    if (contactContent.value === '') {
        showContactError(contactContent, 'Vui lòng nhập nội dung góp ý.');
        return;
    }

    // Giữ nội dung để người dùng có thể sao chép sang email nếu cần.
    // Hiện kết quả góp ý mô phỏng sau khi thông tin đã hợp lệ.
    contactMessage.textContent = 'Góp ý thành công!';
    // Thêm lớp CSS màu xanh rồi hiện thông báo ngay dưới form.
    contactMessage.classList.add('is-success');
    contactMessage.style.display = 'block';
}

// ================= 4. GẮN SỰ KIỆN CHO FORM =================
contactForm.addEventListener('submit', submitContact);
contactForm.addEventListener('input', clearContactMessage);
