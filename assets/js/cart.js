/* ================================================================
TÁC GIẢ
        PHAN QUỐC HẬU
        B2408849

        ngày thực hiện:20/11/2026
        ngày update 1:22/11/2026
        ngày update 2:23/11/2026
        ngày update 3:25/11/2026
        ngày update 4:27/11/2026
================================================================
*/

/*
   cart.js - Hiển thị và xử lý giỏ hàng.
   Tham khảo kiến thức: Vũ Duy Linh, CT188-BGR-phần 2.pdf, chương 4,
   ví dụ 4.10 (Project 3), trang 143-145; DOM, sự kiện và kiểm tra form.
   Header/footer dựa trên index.html; biểu tượng dùng Remix Icon 4.6.0.
*/

// ================= 1. TÌM CÁC PHẦN TỬ HTML =================
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
const selectAllInput = document.getElementById('cart-select-all');
const removeSelectedButton = document.getElementById('cart-remove-selected');
const selectedCount = document.getElementById('cart-selected-count');

// ================= 2. DỮ LIỆU GIỎ HÀNG VÀ ẢNH SÁCH =================
// Lấy ảnh bìa theo id của sách trong productlist.html.
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
// Mảng lưu các sản phẩm đang được chọn, không lưu phần lựa chọn vào localStorage.
let selectedCartProducts = [];

// ================= 3. KIỂM TRA ĐĂNG NHẬP VÀ CÁC HÀM HỖ TRỢ =================
// Lấy tài khoản do login.js lưu để kiểm tra đăng nhập.
// Chỉ kiểm tra đăng nhập trên trình duyệt, chưa có máy chủ.
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

// HÀM HIỂN THỊ LỖI DỮ LIỆU
// Nếu dữ liệu giỏ hàng bị lỗi thì hiện thông báo và nút sửa.
function showStorageMessage() {
    repairButton.style.display = cartHasInvalidProducts ? 'inline-block' : 'none';
    dataError.textContent = cartStorageMessage;
    if (cartStorageMessage === '') {
        dataError.style.display = 'none';
    } else {
        dataError.style.display = 'block';
    }
}

// ĐÓNG THÔNG BÁO THANH TOÁN
// Cho cuộn trang lại và đưa con trỏ về nút thanh toán hoặc liên kết mua tiếp.
function clearCheckoutMessage() {
    const wasOpen = successMessage.style.display === 'flex';
    successMessage.style.display = 'none';
    document.body.style.overflow = '';
    if (wasOpen) {
        if (cartProducts.length === 0) {
            document.getElementById('cart-continue').focus();
        } else {
            document.getElementById('cart-checkout').focus();
        }
    }
}

// Định dạng số tiền theo tiếng Việt, ví dụ 79000 thành 79.000 đ.
function formatPrice(amount) {
    return amount.toLocaleString('vi-VN') + ' đ';
}

// Tạo ô td và thêm vào dòng tr. Trả về ô vừa tạo để dùng tiếp.
function createCell(row, text, className) {
    const cell = document.createElement('td');
    cell.textContent = text;
    cell.className = className;
    row.appendChild(cell);
    return cell;
}

// Tạo nút bấm, dùng label để mô tả nút cho trình đọc màn hình.
function createButton(parent, text, label) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    button.setAttribute('aria-label', label);
    parent.appendChild(button);
    return button;
}

// ================= 4. TÍNH TỔNG VÀ HIỂN THỊ SẢN PHẨM =================
function updateTotals() {
    clearCheckoutMessage();
    let quantity = 0;
    let selectedQuantity = 0;
    let total = 0;

    // Đếm số lượng sách trong giỏ và tính tiền những sản phẩm đã chọn.
    for (let i = 0; i < cartProducts.length; i++) {
        quantity += cartProducts[i].quantity;
        if (selectedCartProducts.indexOf(cartProducts[i]) !== -1) {
            selectedQuantity += cartProducts[i].quantity;
            total += cartProducts[i].price * cartProducts[i].quantity;
        }
    }

    // Cập nhật ô chọn tất cả. indeterminate hiện dấu gạch khi chỉ chọn một phần.
    selectAllInput.checked = cartProducts.length > 0 && selectedCartProducts.length === cartProducts.length;
    selectAllInput.indeterminate = selectedCartProducts.length > 0 && selectedCartProducts.length < cartProducts.length;
    selectAllInput.disabled = cartProducts.length === 0;
    removeSelectedButton.disabled = selectedCartProducts.length === 0;
    selectedCount.textContent = 'Đã chọn ' + selectedQuantity + ' sản phẩm';

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

// Chọn hoặc bỏ chọn toàn bộ sản phẩm, sau đó tính lại tổng tiền.
function selectAllProducts() {
    selectedCartProducts = [];
    if (selectAllInput.checked) {
        for (let i = 0; i < cartProducts.length; i++) {
            selectedCartProducts.push(cartProducts[i]);
        }
    }
    const checkboxes = cartBody.querySelectorAll('.cart__select-item');
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = selectAllInput.checked;
    }
    clearFormError();
    updateTotals();
}

// Xóa các sản phẩm đã chọn, giữ lại những sản phẩm chưa chọn.
function removeSelectedProducts() {
    if (!requireCartLogin() || selectedCartProducts.length === 0) {
        return;
    }
    const remainingProducts = [];
    for (let i = 0; i < cartProducts.length; i++) {
        if (selectedCartProducts.indexOf(cartProducts[i]) === -1) {
            remainingProducts.push(cartProducts[i]);
        }
    }
    // Lưu giỏ hàng trước khi xóa trên giao diện. Nếu lưu lỗi thì giữ nguyên giỏ.
    if (!saveCartProducts(remainingProducts)) {
        showStorageMessage();
        return;
    }
    cartProducts = remainingProducts;
    selectedCartProducts = [];
    while (cartBody.firstChild) {
        cartBody.removeChild(cartBody.firstChild);
    }
    for (let i = 0; i < cartProducts.length; i++) {
        addProductRow(cartProducts[i]);
    }
    showStorageMessage();
    clearFormError();
    updateTotals();
    // Xóa xong thì đưa con trỏ về sản phẩm còn lại hoặc liên kết mua tiếp.
    if (cartProducts.length > 0) {
        cartBody.querySelector('.cart__select-item').focus();
    } else {
        document.getElementById('cart-continue').focus();
    }
}

// HÀM TẠO DÒNG SẢN PHẨM
function addProductRow(product) {
    // Tạo dòng mới trong bảng
    const row = document.createElement('tr');
    // CỘT CHỌN: thêm checkbox để chọn sản phẩm cần thanh toán.
    const selectCell = createCell(row, '', 'cart__select-cell');
    const selectInput = document.createElement('input');
    selectInput.type = 'checkbox';
    selectInput.className = 'cart__select-item';
    selectInput.setAttribute('aria-label', 'Chọn ' + product.name);
    selectInput.checked = selectedCartProducts.indexOf(product) !== -1;
    selectCell.appendChild(selectInput);
    selectInput.addEventListener('change', function () {
        const index = selectedCartProducts.indexOf(product);
        if (selectInput.checked && index === -1) {
            selectedCartProducts.push(product);
        } else if (!selectInput.checked && index !== -1) {
            selectedCartProducts.splice(index, 1);
        }
        clearFormError();
        updateTotals();
    });
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

    // Cập nhật số lượng, thành tiền và tổng tiền sau khi thay đổi.
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
    // Xóa sản phẩm khỏi mảng rồi lưu lại giỏ hàng.
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
        // Bỏ sản phẩm vừa xóa khỏi mảng đang chọn.
        const selectedIndex = selectedCartProducts.indexOf(product);
        if (selectedIndex !== -1) {
            selectedCartProducts.splice(selectedIndex, 1);
        }
        // Xóa dòng trên giao diện sau khi đã lưu thành công
        cartBody.removeChild(row);
        updateTotals();

        // Xóa xong thì đưa con trỏ sang dòng kế bên hoặc liên kết mua tiếp.
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

// HÀM HIỂN THỊ GIỎ HÀNG
// Đọc lại giỏ hàng từ localStorage rồi hiển thị lên bảng.
function showCart() {
    if (!requireCartLogin()) {
        return;
    }
    document.querySelector('main.cart').hidden = false;
    cartProducts = getCartProducts();
    // Mặc định chọn tất cả khi mở hoặc tải lại trang giỏ hàng.
    selectedCartProducts = [];
    for (let i = 0; i < cartProducts.length; i++) {
        selectedCartProducts.push(cartProducts[i]);
    }
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

// ================= 5. KIỂM TRA THÔNG TIN ĐẶT HÀNG =================
// Hiện lỗi và đưa con trỏ đến ô cần sửa.
function showFormError(input, message) {
    formError.textContent = message;
    formError.style.display = 'block';
    input.focus();
}

function checkout(event) {
    // Dùng preventDefault để không tải lại trang khi bấm thanh toán.
    event.preventDefault();
    if (!requireCartLogin()) {
        return;
    }
    if (cartProducts.length > 0) {
        if (selectedCartProducts.length === 0) {
            showFormError(selectAllInput, 'Vui lòng chọn ít nhất một sản phẩm để thanh toán.');
            return;
        }
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
        // Chỉ xóa các sản phẩm được chọn, giữ những sách chưa thanh toán trong giỏ.
        const remainingProducts = [];
        for (let i = 0; i < cartProducts.length; i++) {
            if (selectedCartProducts.indexOf(cartProducts[i]) === -1) {
                remainingProducts.push(cartProducts[i]);
            }
        }
        // Nếu lưu lỗi thì giữ nguyên giỏ hàng và thông tin đã nhập.
        if (!saveCartProducts(remainingProducts)) {
            showStorageMessage();
            return;
        }

        cartProducts = remainingProducts;
        selectedCartProducts = [];
        while (cartBody.firstChild) {
            cartBody.removeChild(cartBody.firstChild);
        }
        // Bỏ chọn các sản phẩm còn lại sau khi thanh toán.
        for (let i = 0; i < cartProducts.length; i++) {
            addProductRow(cartProducts[i]);
        }
        showStorageMessage();
        updateTotals();

        // Dùng reset để xóa các ô thông tin người nhận.
        checkoutForm.reset();
        formError.textContent = '';
        formError.style.display = 'none';
        // Hiện thông báo thành công và tạm dừng cuộn trang.
        // Chỉ mô phỏng thanh toán, không chuyển tiền thật.
        successMessage.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        closeSuccessButton.focus();
    }
}

// Xóa lỗi cũ khi sửa thông tin người nhận.
function clearFormError() {
    clearCheckoutMessage();
    formError.textContent = '';
    formError.style.display = 'none';
}

// ================= 6. XỬ LÝ DỮ LIỆU LỖI VÀ PHÍM TRONG HỘP THÔNG BÁO =================
// Bấm sửa dữ liệu thì bỏ sản phẩm lỗi và lưu lại giỏ hàng.
function repairCart() {
    if (saveCartProducts(cartProducts)) {
        showCart();
    } else {
        showStorageMessage();
    }
}

// Bấm Escape để đóng thông báo, bấm Tab thì giữ con trỏ ở nút Đóng.
function handleSuccessKeydown(event) {
    if (event.key === 'Escape') {
        clearCheckoutMessage();
    }
    if (event.key === 'Tab') {
        event.preventDefault();
        closeSuccessButton.focus();
    }
}

// Đăng xuất ở tab khác thì chuyển về trang đăng nhập.
function handleLoginChange(event) {
    if (event.key === 'currentUser' || event.key === null) {
        requireCartLogin();
    }
}

// ================= 7. GẮN SỰ KIỆN VÀ HIỂN THỊ LẦN ĐẦU =================
// Menu và tên tài khoản trên header do home.js xử lý.
function setupCart() {
    selectAllInput.addEventListener('change', selectAllProducts);
    removeSelectedButton.addEventListener('click', removeSelectedProducts);
    repairButton.addEventListener('click', repairCart);
    closeSuccessButton.addEventListener('click', clearCheckoutMessage);
    successMessage.addEventListener('keydown', handleSuccessKeydown);
    checkoutForm.addEventListener('submit', checkout);
    checkoutForm.addEventListener('input', clearFormError);

    // Đọc lại giỏ khi quay về trang và kiểm tra đăng xuất ở tab khác.
    window.addEventListener('pageshow', showCart);
    window.addEventListener('storage', handleLoginChange);
    showCart();
}

setupCart();
