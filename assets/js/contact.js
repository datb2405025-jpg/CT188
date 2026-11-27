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

// ================= 2. HÀM HIỂN THỊ LỖI =================
function showContactError(input, message) {
    contactMessage.textContent = message;
    contactMessage.classList.remove('is-success');
    contactMessage.style.display = 'block';
    // Thêm aria-invalid để tô viền ô bị lỗi và báo cho trình đọc màn hình.
    input.setAttribute('aria-invalid', 'true');
    input.focus();
}

// Xóa thông báo và viền lỗi khi người dùng nhập lại.
function clearContactMessage() {
    contactMessage.textContent = '';
    contactMessage.style.display = 'none';
    contactMessage.classList.remove('is-success');
    contactName.removeAttribute('aria-invalid');
    contactEmail.removeAttribute('aria-invalid');
    contactContent.removeAttribute('aria-invalid');
}

// ================= 3. KIỂM TRA THÔNG TIN GÓP Ý =================
function submitContact(event) {
    // Dùng preventDefault để không tải lại trang khi bấm gửi.
    event.preventDefault();
    clearContactMessage();

    contactName.value = contactName.value.trim();
    contactEmail.value = contactEmail.value.trim();
    contactContent.value = contactContent.value.trim();

    if (contactName.value === '') {
        showContactError(contactName, 'Vui lòng nhập họ và tên.');
        return;
    }

    // Dùng checkValidity để kiểm tra ô email có trống hoặc sai định dạng không.
    // Quy tắc kiểm tra lấy từ required và type="email" trong HTML.
    if (!contactEmail.checkValidity()) {
        showContactError(contactEmail, 'Vui lòng nhập địa chỉ email hợp lệ.');
        return;
    }

    if (contactContent.value === '') {
        showContactError(contactContent, 'Vui lòng nhập nội dung góp ý.');
        return;
    }

    // Giữ lại nội dung đã nhập sau khi góp ý.
    // Thông tin hợp lệ thì báo thành công, chưa gửi dữ liệu đi.
    contactMessage.textContent = 'Góp ý thành công!';
    // Thêm lớp is-success để đổi màu rồi hiện thông báo.
    contactMessage.classList.add('is-success');
    contactMessage.style.display = 'block';
}

// ================= 4. GẮN SỰ KIỆN CHO FORM =================
contactForm.addEventListener('submit', submitContact);
contactForm.addEventListener('input', clearContactMessage);
