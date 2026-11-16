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
            saveCartProducts(cartProducts);
            updateRow();
            if (decrease.disabled) {
                increase.focus();
            }
        }
    });

    increase.addEventListener('click', function () {
        product.quantity++;
        saveCartProducts(cartProducts);
        updateRow();
    });

    remove.addEventListener('click', function () {
        const nextRow = row.nextElementSibling || row.previousElementSibling;
        for (let i = 0; i < cartProducts.length; i++) {
            if (cartProducts[i] === product) {
                cartProducts.splice(i, 1);
                break;
            }
        }
        cartBody.removeChild(row);
        saveCartProducts(cartProducts);
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
checkoutForm.addEventListener('submit', function (event) {
    event.preventDefault();
    if (cartProducts.length > 0) {
        fullNameInput.value = fullNameInput.value.trim();
        phoneInput.value = phoneInput.value.trim();
        addressInput.value = addressInput.value.trim();
        if (!checkoutForm.reportValidity()) {
            return;
        }
        successMessage.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        closeSuccessButton.focus();
    }
});

checkoutForm.addEventListener('input', clearCheckoutMessage);

function showCart() {
    cartProducts = getCartProducts();
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
