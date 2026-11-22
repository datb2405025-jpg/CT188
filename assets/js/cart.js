/**
 * cart.js - Hiển thị và xử lý giỏ hàng.
 * MSSV: B2408849 - Họ tên: Phan Quốc Hậu.
 * Tham khảo kiến thức: Vũ Duy Linh, CT188-BGR-phần 2.pdf, chương 4,
 * ví dụ 4.10 (Project 3), trang 143-145; DOM, sự kiện và kiểm tra form.
 * Header/footer dựa trên index.html; biểu tượng dùng Remix Icon 4.6.0.
 * https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.css
 */

// Chỉ mở giỏ hàng khi có tài khoản đăng nhập do login.js lưu.
// Đây là kiểm tra trạng thái trên trình duyệt của bài web tĩnh.
function requireCartLogin() {
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('currentUser'));
    } catch (error) {
        user = null;
    }
    if (!user || typeof user.name !== 'string' || user.name.trim() === '' ||
        typeof user.email !== 'string' || user.email.trim() === '') {
        document.querySelector('main.cart').hidden = true;
        document.getElementById('cart-success').style.display = 'none';
        window.location.replace('./login.html');
        return false;
    }
    return true;
}

// DANH SÁCH ẢNH SÁCH
// Ghép bìa sách với sản phẩm theo id có trong productlist.html.
const cartBookImages = [
    { "image": "./assets/images/productList_images/goc-nho-co-nang.webp", "id": "1" },
    { "image": "./assets/images/productList_images/nha-gia-kim.jpg", "id": "2" },
    { "image": "./assets/images/productList_images/tuoi-tre-dang-gia-bao-nhieu.jpg", "id": "3" },
    { "image": "./assets/images/productList_images/dac-nhan-tam.jpg", "id": "4" },
    { "image": "./assets/images/productList_images/di-tim-le-song.jpeg", "id": "5" },
    { "image": "./assets/images/productList_images/cay-cam-ngot-cua-toi.jpeg", "id": "6" },
    { "image": "./assets/images/productList_images/muon_kiep_nhan_sinh.jpeg", "id": "7" },
    { "image": "./assets/images/productList_images/bo-gia.jpeg", "id": "8" },
    { "image": "./assets/images/productList_images/mat-biec.jpg", "id": "9" },
    { "image": "./assets/images/productList_images/de-men-phieu-luu-ky.jpg", "id": "10" },
    { "image": "./assets/images/productList_images/sapiens-luoc-su-loai-nguoi.png", "id": "11" },
    { "image": "./assets/images/productList_images/rung-xanh.webp", "id": "12" }
];

// Lấy danh sách sản phẩm từ localStorage khi hiển thị giỏ hàng.
let cartProducts = [];

// TÌM CÁC PHẦN TỬ HTML
const cartBody = document.getElementById('cart-body');
const cartContent = document.getElementById('cart-content');
const cartEmpty = document.getElementById('cart-empty');
const cartCount = document.getElementById('cart-count');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotal = document.getElementById('cart-total');
const checkoutForm = document.getElementById('cart-checkout-form');
const fullNameInput = document.getElementById('cart-fullname');
const phoneInput = document.getElementById('cart-phone');
const addressInput = document.getElementById('cart-address');
const successMessage = document.getElementById('cart-success');
const closeSuccessButton = document.getElementById('cart-success-close');
const formError = document.getElementById('cart-form-error');
const dataError = document.getElementById('cart-data-error');
const repairButton = document.getElementById('cart-repair');

// HÀM HIỂN THỊ LỖI DỮ LIỆU
// Chỉ hiện nút bỏ sản phẩm lỗi khi dữ liệu có bản ghi không hợp lệ.
function showStorageMessage() {
    repairButton.style.display = cartHasInvalidProducts ? 'inline-block' : 'none';
    dataError.textContent = cartStorageMessage;
    if (cartStorageMessage === '') {
        dataError.style.display = 'none';
    } else {
        dataError.style.display = 'block';
    }
}

// Lưu lại các sản phẩm hợp lệ khi người dùng chọn bỏ dữ liệu lỗi.
repairButton.addEventListener('click', function () {
    if (saveCartProducts(cartProducts)) {
        showCart();
    } else {
        showStorageMessage();
    }
});

// Menu và trạng thái đăng nhập trong header dùng chung assets/js/home.js.

// ĐÓNG THÔNG BÁO THANH TOÁN
// Cho cuộn trang trở lại và trả focus về nút Thanh toán nếu hộp đang mở.
function clearCheckoutMessage() {
    const wasOpen = successMessage.style.display === 'flex';
    successMessage.style.display = 'none';
    document.body.style.overflow = '';
    if (wasOpen) {
        document.getElementById('cart-checkout').focus();
    }
}

closeSuccessButton.addEventListener('click', clearCheckoutMessage);
// Escape đóng hộp; Tab giữ focus ở nút Đóng trong hộp.
successMessage.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        clearCheckoutMessage();
    }
    if (event.key === 'Tab') {
        event.preventDefault();
        closeSuccessButton.focus();
    }
});

// Định dạng số tiền theo tiếng Việt, ví dụ 79000 thành 79.000 đ.
function formatPrice(amount) {
    return amount.toLocaleString('vi-VN') + ' đ';
}

// Tạo ô td, thêm chữ và đưa vào dòng tr; trả về ô để thêm các phần tử con.
function createCell(row, text, className) {
    const cell = document.createElement('td');
    cell.textContent = text;
    cell.className = className;
    row.appendChild(cell);
    return cell;
}

// Tạo nút tăng, giảm hoặc xóa; label mô tả nút cho trình đọc màn hình.
function createButton(parent, text, label) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    button.setAttribute('aria-label', label);
    parent.appendChild(button);
    return button;
}

// TÍNH TỔNG SỐ LƯỢNG VÀ TỔNG TIỀN
function updateTotals() {
    clearCheckoutMessage();
    let quantity = 0;
    let total = 0;

    // Duyệt các sản phẩm để cộng số lượng và tiền
    for (let i = 0; i < cartProducts.length; i++) {
        quantity += cartProducts[i].quantity;
        total += cartProducts[i].price * cartProducts[i].quantity;
    }

    // Hiện tổng số cuốn và tổng tiền lên trang
    cartCount.textContent = quantity + ' sản phẩm';
    cartSubtotal.textContent = formatPrice(total);
    cartTotal.textContent = formatPrice(total);

    // Nếu giỏ trống thì ẩn danh sách và form, hiện thông báo giỏ hàng trống
    if (cartProducts.length === 0) {
        cartContent.style.display = 'none';
        cartEmpty.style.display = 'block';
    } else {
        cartContent.style.display = 'block';
        cartEmpty.style.display = 'none';
    }
}

// HÀM TẠO DÒNG SẢN PHẨM
function addProductRow(product) {
    // Tạo dòng mới trong bảng
    const row = document.createElement('tr');
    // CỘT SẢN PHẨM
    const productCell = createCell(row, '', 'cart__product');
    // Tìm ảnh theo mã sách và thêm vào ô sản phẩm
    for (let i = 0; i < cartBookImages.length; i++) {
        if (cartBookImages[i].id === String(product.id)) {
            const cover = document.createElement('img');
            cover.className = 'cart__book-image';
            cover.src = cartBookImages[i].image;
            cover.alt = 'Bìa sách ' + product.name;
            productCell.appendChild(cover);
            break;
        }
    }

    // Thêm tên sách và tác giả
    const name = document.createElement('strong');
    name.className = 'cart__product-name';
    name.textContent = product.name;
    productCell.appendChild(name);

    const author = document.createElement('small');
    author.className = 'cart__author';
    author.textContent = product.author;
    productCell.appendChild(author);

    // CỘT ĐƠN GIÁ
    createCell(row, formatPrice(product.price), 'cart__price');

    // CỘT SỐ LƯỢNG
    const quantityCell = createCell(row, '', 'cart__quantity-cell');
    const controls = document.createElement('div');
    controls.className = 'cart__quantity-controls';
    quantityCell.appendChild(controls);

    // Thêm lần lượt nút giảm, số lượng và nút tăng
    const decrease = createButton(controls, '−', 'Giảm số lượng ' + product.name);
    const quantity = document.createElement('span');
    quantity.className = 'cart__quantity';
    controls.appendChild(quantity);
    const increase = createButton(controls, '+', 'Tăng số lượng ' + product.name);

    // CỘT THÀNH TIỀN
    const lineTotal = createCell(row, '', 'cart__line-total');
    // CỘT XÓA SẢN PHẨM
    const removeCell = createCell(row, '', 'cart__action');
    const remove = createButton(removeCell, 'Xóa', 'Xóa ' + product.name);
    remove.className = 'cart__remove';

    // Cập nhật dòng và tổng tiền; khóa nút giảm khi số lượng bằng 1.
    function updateRow() {
        quantity.textContent = product.quantity;
        // Thành tiền = đơn giá nhân số lượng
        lineTotal.textContent = formatPrice(product.price * product.quantity);
        // Số lượng bằng 1 thì khóa nút giảm
        decrease.disabled = product.quantity <= 1;
        updateTotals();
    }

    // GIẢM SỐ LƯỢNG
    decrease.addEventListener('click', function () {
        if (product.quantity > 1) {
            product.quantity--;
            // Lưu thất bại thì trả lại số lượng cũ.
            if (!saveCartProducts(cartProducts)) {
                product.quantity++;
                showStorageMessage();
                return;
            }
            showStorageMessage();
            updateRow();
            if (decrease.disabled) {
                increase.focus();
            }
        }
    });

    // TĂNG SỐ LƯỢNG
    increase.addEventListener('click', function () {
        product.quantity++;
        if (!saveCartProducts(cartProducts)) {
            product.quantity--;
            showStorageMessage();
            return;
        }
        showStorageMessage();
        updateRow();
    });

    // XÓA SẢN PHẨM
    // Xóa khỏi mảng, lưu dữ liệu thành công rồi mới xóa dòng trong bảng.
    remove.addEventListener('click', function () {
        const nextRow = row.nextElementSibling || row.previousElementSibling;
        for (let i = 0; i < cartProducts.length; i++) {
            if (cartProducts[i] === product) {
                cartProducts.splice(i, 1);
                if (!saveCartProducts(cartProducts)) {
                    // Chưa lưu được thì chèn sản phẩm lại đúng vị trí cũ
                    cartProducts.splice(i, 0, product);
                    showStorageMessage();
                    return;
                }
                showStorageMessage();
                break;
            }
        }
        // Xóa dòng trên giao diện sau khi đã lưu thành công
        cartBody.removeChild(row);
        updateTotals();

        // Sau khi xóa, đưa focus sang dòng kế bên hoặc liên kết mua tiếp
        if (nextRow) {
            nextRow.querySelector('.cart__remove').focus();
        } else {
            document.getElementById('cart-continue').focus();
        }
    });

    // Đưa dòng sản phẩm vào tbody rồi cập nhật số lượng và thành tiền
    cartBody.appendChild(row);
    updateRow();
}

// KIỂM TRA THÔNG TIN ĐẶT HÀNG
// Hiện lỗi và đưa con trỏ đến ô cần sửa.
function showFormError(input, message) {
    formError.textContent = message;
    formError.style.display = 'block';
    input.focus();
}

checkoutForm.addEventListener('submit', function (event) {
    // Chặn gửi form để kiểm tra dữ liệu và hiện kết quả ngay trên trang.
    event.preventDefault();
    if (!requireCartLogin()) {
        return;
    }
    if (cartProducts.length > 0) {
        // Bỏ khoảng trắng thừa ở đầu và cuối các ô nhập
        fullNameInput.value = fullNameInput.value.trim();
        phoneInput.value = phoneInput.value.trim();
        addressInput.value = addressInput.value.trim();
        // Kiểm tra họ tên
        if (fullNameInput.value === '') {
            showFormError(fullNameInput, 'Vui lòng nhập họ và tên.');
            return;
        }
        // Bỏ khoảng trắng, cho phép dấu + ở đầu và từ 9 đến 15 chữ số.
        // Kiểm tra số điện thoại
        const phone = phoneInput.value.replace(/\s/g, '');
        if (!/^[+]?[0-9]{9,15}$/.test(phone)) {
            showFormError(phoneInput, 'Số điện thoại cần từ 9 đến 15 chữ số, có thể bắt đầu bằng dấu +.');
            return;
        }
        // Kiểm tra địa chỉ nhận hàng
        if (addressInput.value === '') {
            showFormError(addressInput, 'Vui lòng nhập địa chỉ nhận hàng.');
            return;
        }
        phoneInput.value = phone;
        formError.textContent = '';
        formError.style.display = 'none';
        // Thông tin hợp lệ: hiện hộp thành công và khóa cuộn trang nền.
        // Đây là thao tác thanh toán mô phỏng của bài thực hành web tĩnh.
        successMessage.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        closeSuccessButton.focus();
    }
});

// Xóa thông báo cũ khi người dùng sửa thông tin.
checkoutForm.addEventListener('input', function () {
    clearCheckoutMessage();
    formError.textContent = '';
    formError.style.display = 'none';
});

// HÀM HIỂN THỊ GIỎ HÀNG
// Đọc dữ liệu mới và xóa các dòng cũ trước khi tạo lại bảng.
function showCart() {
    if (!requireCartLogin()) {
        return;
    }
    document.querySelector('main.cart').hidden = false;
    cartProducts = getCartProducts();
    showStorageMessage();
    // Xóa các dòng cũ trong bảng
    while (cartBody.firstChild) {
        cartBody.removeChild(cartBody.firstChild);
    }
    // Tạo lại từng dòng từ danh sách vừa đọc
    for (let i = 0; i < cartProducts.length; i++) {
        addProductRow(cartProducts[i]);
    }
    updateTotals();
}

// Cập nhật khi mở trang hoặc quay lại bằng nút Back của trình duyệt.
window.addEventListener('pageshow', showCart);
// Đăng xuất ở tab khác thì đóng quyền xem giỏ hàng tại tab này.
window.addEventListener('storage', function (event) {
    if (event.key === 'currentUser' || event.key === null) {
        requireCartLogin();
    }
});

// HIỂN THỊ LẦN ĐẦU
showCart();
