// Chương 4: mảng đối tượng, JSON và Web Storage.
let cartStorageMessage = '';
let cartHasInvalidProducts = false;

function getCartProducts() {
    cartStorageMessage = '';
    cartHasInvalidProducts = false;
    try {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart === null) {
            return [];
        }
        const products = JSON.parse(savedCart);
        if (Array.isArray(products)) {
            const validProducts = [];
            for (let i = 0; i < products.length; i++) {
                const product = products[i];
                if (!product || typeof product !== 'object') {
                    cartHasInvalidProducts = true;
                    cartStorageMessage = 'Một số sản phẩm thiếu thông tin. Hãy thêm lại từ danh sách sản phẩm.';
                    continue;
                }
                // Hỗ trợ cả dữ liệu cũ dùng name và productlist dùng title.
                let name = product.name || product.title;
                const quantity = Number(product.quantity);
                let price = Number(product.price);
                if (typeof product.price === 'string' && product.price.indexOf('-') === -1) {
                    price = Number(product.price.replace(/[^0-9]/g, ''));
                }
                if (typeof name !== 'string' || name.trim() === '' ||
                    product.id === undefined || product.id === null ||
                    !isFinite(quantity) || quantity < 1 || Math.floor(quantity) !== quantity ||
                    !isFinite(price) || price <= 0) {
                    cartHasInvalidProducts = true;
                    cartStorageMessage = 'Một số sản phẩm thiếu thông tin. Hãy thêm lại từ danh sách sản phẩm.';
                    continue;
                }
                name = name.trim();
                validProducts.push({
                    id: String(product.id),
                    name: name,
                    title: name,
                    author: typeof product.author === 'string' ? product.author : '',
                    price: price,
                    quantity: quantity
                });
            }
            return validProducts;
        }
        cartStorageMessage = 'Giỏ hàng đã lưu không đúng định dạng. Hãy thêm lại sản phẩm.';
        cartHasInvalidProducts = true;
    } catch (error) {
        cartHasInvalidProducts = error.name === 'SyntaxError';
        cartStorageMessage = 'Không đọc được giỏ hàng đã lưu. Hãy kiểm tra quyền lưu trữ của trình duyệt.';
        return [];
    }
    return [];
}

function saveCartProducts(products) {
    try {
        localStorage.setItem('cartItems', JSON.stringify(products));
        cartStorageMessage = '';
        cartHasInvalidProducts = false;
        return true;
    } catch (error) {
        cartStorageMessage = 'Chưa lưu được thay đổi. Hãy kiểm tra quyền lưu trữ của trình duyệt và thử lại.';
        return false;
    }
}
