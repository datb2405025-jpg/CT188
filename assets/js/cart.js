// Ảnh bìa sách có sẵn, đối chiếu theo mã sản phẩm.
const cartBookImages = [
    {"image": "./assets/images/productList_images/goc-nho-co-nang.webp", "id": "1"},
    {"image": "./assets/images/productList_images/nha-gia-kim.jpg", "id": "2"},
    {"image": "./assets/images/productList_images/tuoi-tre-dang-gia-bao-nhieu.jpg", "id": "3"},
    {"image": "./assets/images/productList_images/dac-nhan-tam.jpg", "id": "4"},
    {"image": "./assets/images/productList_images/di-tim-le-song.jpeg", "id": "5"},
    {"image": "./assets/images/productList_images/cay-cam-ngot-cua-toi.jpeg", "id": "6"},
    {"image": "./assets/images/productList_images/muon_kiep_nhan_sinh.jpeg", "id": "7"},
    {"image": "./assets/images/productList_images/bo-gia.jpeg", "id": "8"},
    {"image": "./assets/images/productList_images/mat-biec.jpg", "id": "9"},
    {"image": "./assets/images/productList_images/de-men-phieu-luu-ky.jpg", "id": "10"},
    {"image": "./assets/images/productList_images/sapiens-luoc-su-loai-nguoi.png", "id": "11"},
    {"image": "./assets/images/productList_images/rung-xanh.webp", "id": "12"}
];

// Đọc các sản phẩm được chọn từ trang danh sách sản phẩm.
let cartProducts = [];

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
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.getElementById('main-navigation');

function showStorageMessage() {
    repairButton.style.display = cartHasInvalidProducts ? 'inline-block' : 'none';
    dataError.textContent = cartStorageMessage;
    if (cartStorageMessage === '') {
        dataError.style.display = 'none';
    } else {
        dataError.style.display = 'block';
    }
}

// Giữ lại các sản phẩm hợp lệ, bỏ các bản ghi cũ thiếu dữ liệu.
repairButton.addEventListener('click', function () {
    if (saveCartProducts(cartProducts)) {
        showCart();
    } else {
        showStorageMessage();
    }
});

// Chương 4: sự kiện click và đổi lớp CSS.
menuButton.addEventListener('click', function () {
    if (navigation.classList.contains('is-open')) {
        navigation.classList.remove('is-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Mở menu');
        menuButton.innerHTML = '<i class="ri-menu-line" aria-hidden="true"></i>';
    } else {
        navigation.classList.add('is-open');
        menuButton.setAttribute('aria-expanded', 'true');
        menuButton.setAttribute('aria-label', 'Đóng menu');
        menuButton.innerHTML = '<i class="ri-close-line" aria-hidden="true"></i>';
    }
});

function clearCheckoutMessage() {
    const wasOpen = successMessage.style.display === 'flex';
    successMessage.style.display = 'none';
    document.body.style.overflow = '';
    if (wasOpen) {
        document.getElementById('cart-checkout').focus();
    }
}

closeSuccessButton.addEventListener('click', clearCheckoutMessage);
successMessage.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        clearCheckoutMessage();
    }
    if (event.key === 'Tab') {
        event.preventDefault();
        closeSuccessButton.focus();
    }
});

// Định dạng tiền theo ví dụ giỏ hàng trong chương 4.
function formatPrice(amount) {
    return amount.toLocaleString('vi-VN') + ' đ';
}

// Tạo ô trong bảng bằng createElement, textContent và appendChild.
function createCell(row, text, className) {
    const cell = document.createElement('td');
    cell.textContent = text;
    cell.className = className;
    row.appendChild(cell);
    return cell;
}

function createButton(parent, text, label) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = text;
    button.setAttribute('aria-label', label);
    parent.appendChild(button);
    return button;
}

function updateTotals() {
    clearCheckoutMessage();
    let quantity = 0;
    let total = 0;

    for (let i = 0; i < cartProducts.length; i++) {
        quantity += cartProducts[i].quantity;
        total += cartProducts[i].price * cartProducts[i].quantity;
    }

    cartCount.textContent = quantity + ' sản phẩm';
    cartSubtotal.textContent = formatPrice(total);
    cartTotal.textContent = formatPrice(total);

    if (cartProducts.length === 0) {
        cartContent.style.display = 'none';
        cartEmpty.style.display = 'block';
    } else {
        cartContent.style.display = 'block';
        cartEmpty.style.display = 'none';
    }
}

function addProductRow(product) {
    const row = document.createElement('tr');
    const productCell = createCell(row, '', 'cart__product');
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


    const name = document.createElement('strong');
    name.className = 'cart__product-name';
    name.textContent = product.name;
    productCell.appendChild(name);

    const author = document.createElement('small');
    author.className = 'cart__author';
    author.textContent = product.author;
    productCell.appendChild(author);

    createCell(row, formatPrice(product.price), 'cart__price');

    const quantityCell = createCell(row, '', 'cart__quantity-cell');
    const controls = document.createElement('div');
    controls.className = 'cart__quantity-controls';
    quantityCell.appendChild(controls);

    const decrease = createButton(controls, '−', 'Giảm số lượng ' + product.name);
    const quantity = document.createElement('span');
    quantity.className = 'cart__quantity';
    controls.appendChild(quantity);
    const increase = createButton(controls, '+', 'Tăng số lượng ' + product.name);

    const lineTotal = createCell(row, '', 'cart__line-total');
    const removeCell = createCell(row, '', 'cart__action');
    const remove = createButton(removeCell, 'Xóa', 'Xóa ' + product.name);
    remove.className = 'cart__remove';

    function updateRow() {
        quantity.textContent = product.quantity;
        lineTotal.textContent = formatPrice(product.price * product.quantity);
        decrease.disabled = product.quantity <= 1;
        updateTotals();
    }

    decrease.addEventListener('click', function () {
        if (product.quantity > 1) {
            product.quantity--;
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

    remove.addEventListener('click', function () {
        const nextRow = row.nextElementSibling || row.previousElementSibling;
        for (let i = 0; i < cartProducts.length; i++) {
            if (cartProducts[i] === product) {
                cartProducts.splice(i, 1);
                if (!saveCartProducts(cartProducts)) {
                    cartProducts.splice(i, 0, product);
                    showStorageMessage();
                    return;
                }
                showStorageMessage();
                break;
            }
        }
        cartBody.removeChild(row);
        updateTotals();

        if (nextRow) {
            nextRow.querySelector('.cart__remove').focus();
        } else {
            document.getElementById('cart-continue').focus();
        }
    });

    cartBody.appendChild(row);
    updateRow();
}

// Thông báo thành công cho thao tác thanh toán mẫu sau khi kiểm tra form.
function showFormError(input, message) {
    formError.textContent = message;
    formError.style.display = 'block';
    input.focus();
}

checkoutForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (cartProducts.length > 0) {
        fullNameInput.value = fullNameInput.value.trim();
        phoneInput.value = phoneInput.value.trim();
        addressInput.value = addressInput.value.trim();
        if (fullNameInput.value === '') {
            showFormError(fullNameInput, 'Vui lòng nhập họ và tên.');
            return;
        }
        // Kiểm tra chuỗi và biểu thức chính quy theo ví dụ form chương 4.
        const phone = phoneInput.value.replace(/\s/g, '');
        if (!/^[+]?[0-9]{9,15}$/.test(phone)) {
            showFormError(phoneInput, 'Số điện thoại cần từ 9 đến 15 chữ số, có thể bắt đầu bằng dấu +.');
            return;
        }
        if (addressInput.value === '') {
            showFormError(addressInput, 'Vui lòng nhập địa chỉ nhận hàng.');
            return;
        }
        phoneInput.value = phone;
        formError.textContent = '';
        formError.style.display = 'none';
        successMessage.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        closeSuccessButton.focus();
    }
});

checkoutForm.addEventListener('input', function () {
    clearCheckoutMessage();
    formError.textContent = '';
    formError.style.display = 'none';
});

function showCart() {
    cartProducts = getCartProducts();
    showStorageMessage();
    while (cartBody.firstChild) {
        cartBody.removeChild(cartBody.firstChild);
    }
    for (let i = 0; i < cartProducts.length; i++) {
        addProductRow(cartProducts[i]);
    }
    updateTotals();
}

// pageshow cập nhật cả khi quay lại trang bằng nút Back của trình duyệt.
window.addEventListener('pageshow', showCart);
showCart();
