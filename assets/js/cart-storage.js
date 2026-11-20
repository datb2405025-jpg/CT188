/**
 * cart-storage.js - Đọc và lưu giỏ hàng trong localStorage.
 * MSSV: B2408849 - Họ tên: Phan Quốc Hậu.
 * Tham khảo: CT188-BGR-phần 2.pdf, chương 4, ví dụ 4.10, trang 143-145.
 */

// TRẠNG THÁI LỖI DỮ LIỆU
// cart.js dùng hai biến này để hiện thông báo và nút bỏ sản phẩm lỗi.
let cartStorageMessage = '';
let cartHasInvalidProducts = false;

// HÀM ĐỌC GIỎ HÀNG
// Khóa cartItems dùng chung với trang sản phẩm; chưa có dữ liệu thì trả về [].
function getCartProducts() {
    cartStorageMessage = '';
    cartHasInvalidProducts = false;
    try {
        const savedCart = localStorage.getItem('cartItems');
        // Chưa lưu giỏ hàng thì trả về mảng rỗng
        if (savedCart === null) {
            return [];
        }
        // Chuyển chuỗi JSON đã lưu về mảng sản phẩm.
        const products = JSON.parse(savedCart);
        if (Array.isArray(products)) {
            const validProducts = [];
            // Kiểm tra từng sản phẩm đã lưu
            for (let i = 0; i < products.length; i++) {
                const product = products[i];
                // Dữ liệu của một sản phẩm phải là đối tượng
                if (!product || typeof product !== 'object') {
                    cartHasInvalidProducts = true;
                    cartStorageMessage = 'Một số sản phẩm thiếu thông tin. Hãy thêm lại từ danh sách sản phẩm.';
                    continue;
                }
                // Đọc được cả phiên bản dùng name lẫn phiên bản dùng title.
                let name = product.name || product.title;
                // Chuyển về số để tính toán, tránh cộng thành chuỗi.
                const quantity = Number(product.quantity);
                let price = Number(product.price);
                if (typeof product.price === 'string' && product.price.indexOf('-') === -1) {
                    // Ví dụ '79.000 đ' được chuyển về 79000.
                    price = Number(product.price.replace(/[^0-9]/g, ''));
                }
                // Bỏ sản phẩm thiếu tên/mã, sai giá hoặc số lượng không nguyên dương.
                if (typeof name !== 'string' || name.trim() === '' ||
                    product.id === undefined || product.id === null ||
                    !isFinite(quantity) || quantity < 1 || Math.floor(quantity) !== quantity ||
                    !isFinite(price) || price <= 0) {
                    cartHasInvalidProducts = true;
                    cartStorageMessage = 'Một số sản phẩm thiếu thông tin. Hãy thêm lại từ danh sách sản phẩm.';
                    continue;
                }
                name = name.trim();
                // Thêm sản phẩm hợp lệ vào mảng kết quả, giữ cả name và title cho dữ liệu cũ
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
        // Bắt lỗi JSON hoặc lỗi trình duyệt chặn đọc localStorage.
        cartHasInvalidProducts = error.name === 'SyntaxError';
        cartStorageMessage = 'Không đọc được giỏ hàng đã lưu. Hãy kiểm tra quyền lưu trữ của trình duyệt.';
        return [];
    }
    return [];
}

// HÀM LƯU GIỎ HÀNG
// Trả về true nếu lưu được, false để cart.js khôi phục thao tác vừa thực hiện.
function saveCartProducts(products) {
    try {
        // Chuyển mảng thành chuỗi JSON vì localStorage lưu dữ liệu dạng chuỗi.
        localStorage.setItem('cartItems', JSON.stringify(products));
        cartStorageMessage = '';
        cartHasInvalidProducts = false;
        // Báo cho cart.js biết đã lưu thành công
        return true;
    } catch (error) {
        cartStorageMessage = 'Chưa lưu được thay đổi. Hãy kiểm tra quyền lưu trữ của trình duyệt và thử lại.';
        // Báo thất bại để cart.js khôi phục thao tác vừa làm
        return false;
    }
}
