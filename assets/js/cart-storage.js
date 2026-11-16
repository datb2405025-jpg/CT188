
function getCartProducts() {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart === null) {
        return [];
    }

    try {
        const products = JSON.parse(savedCart);
        if (Array.isArray(products)) {
            return products;
        }
    } catch (error) {
        return [];
    }
    return [];
}

function saveCartProducts(products) {
    localStorage.setItem('cartItems', JSON.stringify(products));
}
