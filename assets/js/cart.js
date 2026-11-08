const cartContent = document.querySelector('#cart__content');
const cartItems = document.querySelector('#cart__table--body');
const cartCount = document.querySelector('#cart__count');
const cartEmpty = document.querySelector('#cart__empty');
const subtotal = cartContent.querySelector('.sum-price');
const grandTotal = cartContent.querySelector('.summary-total');
const currency = new Intl.NumberFormat('vi-VN');

function formatPrice(amount) {
    return `${currency.format(amount)} đ`;
}

function updateCart() {
    let itemCount = 0;
    let total = 0;

    for (const item of cartItems.children) {
        const quantity = Number(item.querySelector('.cart__quantity').textContent);
        const lineTotal = Number(item.dataset.price) * quantity;

        item.querySelector('.cart__col--total-value').textContent = formatPrice(lineTotal);
        item.querySelector('[data-action="decrease"]').disabled = quantity <= 1;
        itemCount += quantity;
        total += lineTotal;
    }

    cartCount.textContent = `${itemCount} sản phẩm`;
    subtotal.textContent = formatPrice(total);
    grandTotal.textContent = formatPrice(total);
    cartContent.hidden = itemCount === 0;
    cartEmpty.hidden = itemCount > 0;
}

cartItems.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-action]');
    if (!button || button.disabled) return;

    const item = button.closest('.cart__item');
    const action = button.dataset.action;

    if (action === 'remove') {
        const nextItem = item.nextElementSibling || item.previousElementSibling;
        item.remove();
        updateCart();

        const nextFocus = nextItem
            ? nextItem.querySelector('[data-action="remove"]')
            : cartEmpty.querySelector('a');
        nextFocus.focus();
        return;
    }

    const quantity = item.querySelector('.cart__quantity');
    const change = action === 'increase' ? 1 : -1;
    quantity.textContent = Number(quantity.textContent) + change;
    updateCart();

    if (button.disabled) {
        item.querySelector('[data-action="increase"]').focus();
    }
});

updateCart();
