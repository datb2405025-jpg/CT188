/*
 * Trang chi tiết sách. Dữ liệu tĩnh theo các thẻ HTML trong productlist.html.
 * CT188 chương 4: mảng, DOM, sự kiện, query string và Web Storage.
 * Khi bổ sung sách, cập nhật dữ liệu tương ứng trong danh sách bên dưới.
 */
const detailBooks = [
    {
        "id": "1",
        "name": "Góc Nhỏ Có Nắng",
        "author": "Little Rainbow",
        "category": "Văn học",
        "price": 47000,
        "image": "./assets/images/productList_images/goc-nho-co-nang.webp"
    },
    {
        "id": "2",
        "name": "Nhà Giả Kim",
        "author": "Paulo Coelho",
        "category": "Văn học",
        "price": 79000,
        "image": "./assets/images/productList_images/nha-gia-kim.jpg"
    },
    {
        "id": "3",
        "name": "Tuổi Trẻ Đáng Giá Bao Nhiêu",
        "author": "Rosie Nguyễn",
        "category": "Kỹ năng sống",
        "price": 68000,
        "image": "./assets/images/productList_images/tuoi-tre-dang-gia-bao-nhieu.jpg"
    },
    {
        "id": "4",
        "name": "Đắc Nhân Tâm",
        "author": "Dale Carnegie",
        "category": "Kỹ năng sống",
        "price": 75000,
        "image": "./assets/images/productList_images/dac-nhan-tam.jpg"
    },
    {
        "id": "5",
        "name": "Đi Tìm Lẽ Sống",
        "author": "Viktor E. Frankl",
        "category": "Tâm lý",
        "price": 81000,
        "image": "./assets/images/productList_images/di-tim-le-song.jpeg"
    },
    {
        "id": "6",
        "name": "Cây Cam Ngọt Của Tôi",
        "author": "José Mauro de Vasconcelos",
        "category": "Văn học",
        "price": 84000,
        "image": "./assets/images/productList_images/cay-cam-ngot-cua-toi.jpeg"
    },
    {
        "id": "7",
        "name": "Muôn Kiếp Nhân Sinh",
        "author": "Nguyên Phong",
        "category": "Tâm lý",
        "price": 109000,
        "image": "./assets/images/productList_images/muon_kiep_nhan_sinh.jpeg"
    },
    {
        "id": "8",
        "name": "Bố Già",
        "author": "Mario Puzo",
        "category": "Văn học",
        "price": 101000,
        "image": "./assets/images/productList_images/bo-gia.jpeg"
    },
    {
        "id": "9",
        "name": "Mắt Biếc",
        "author": "Nguyễn Nhật Ánh",
        "category": "Văn học",
        "price": 72000,
        "image": "./assets/images/productList_images/mat-biec.jpg"
    },
    {
        "id": "10",
        "name": "Dế Mèn Phiêu Lưu Ký",
        "author": "Tô Hoài",
        "category": "Văn học",
        "price": 49000,
        "image": "./assets/images/productList_images/de-men-phieu-luu-ky.jpg"
    },
    {
        "id": "11",
        "name": "Sapiens: Lược Sử Loài Người",
        "author": "Yuval Noah Harari",
        "category": "Kinh tế",
        "price": 152000,
        "image": "./assets/images/productList_images/sapiens-luoc-su-loai-nguoi.png"
    },
    {
        "id": "12",
        "name": "Rừng xanh nước bạc",
        "author": "Nguyên Phong",
        "category": "Kinh tế",
        "price": 196200,
        "image": "./assets/images/productList_images/rung-xanh.webp"
    }
];
const selectedBookId = new URLSearchParams(location.search).get('id');
let selectedBook = null;
for (let i = 0; i < detailBooks.length; i++) {
    if (detailBooks[i].id === selectedBookId) {
        selectedBook = detailBooks[i];
        break;
    }
}
if (selectedBook) {
    document.getElementById('book-detail').hidden = false;
    const image = document.getElementById('book-image');
    image.src = selectedBook.image;
    image.alt = 'Bìa sách ' + selectedBook.name;
    document.getElementById('book-name').textContent = selectedBook.name;
    document.getElementById('book-author').textContent = selectedBook.author;
    document.getElementById('book-category').textContent = selectedBook.category;
    document.getElementById('book-price').textContent = selectedBook.price.toLocaleString('vi-VN') + ' đ';
    document.title = selectedBook.name + ' | Bookshelf';

    document.getElementById('book-add').addEventListener('click', function () {
        const quantityInput = document.getElementById('book-quantity');
        const quantity = Number(quantityInput.value);
        const notice = document.getElementById('book-notice');
        if (!isFinite(quantity) || quantity < 1 || Math.floor(quantity) !== quantity) {
            notice.textContent = 'Vui lòng nhập số lượng nguyên lớn hơn 0.';
            quantityInput.focus();
            return;
        }
        const products = getCartProducts();
        if (cartHasInvalidProducts) {
            notice.textContent = 'Hãy mở giỏ hàng để bỏ các sản phẩm lỗi trước khi thêm.';
            return;
        }
        let existing = null;
        for (let i = 0; i < products.length; i++) {
            if (products[i].id === selectedBook.id) existing = products[i];
        }
        if (existing) {
            existing.quantity += quantity;
        } else {
            products.push({
                id: selectedBook.id, name: selectedBook.name, title: selectedBook.name,
                author: selectedBook.author, image: selectedBook.image,
                price: selectedBook.price, quantity: quantity
            });
        }
        if (saveCartProducts(products)) {
            notice.textContent = 'Đã thêm ' + selectedBook.name + ' vào giỏ hàng.';
            updateHeaderCartCount();
        } else {
            notice.textContent = cartStorageMessage;
        }
    });
} else {
    document.getElementById('book-error').hidden = false;
}
