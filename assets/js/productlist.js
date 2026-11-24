// Tác giả: Nguyễn Trần Gia Huy
// MSSV: B2509664
// Tài liệu tham khảo: CT188-BGR-phần 2 (Biên soạn Vũ Duy Linh)

// THAO TÁC LẤY CÁC PHẦN TỬ HTML
const productGrid = document.querySelector(".product-list__grid");

const oldPriceElements = document.querySelectorAll(".product-card__old-price");
const currentPriceElements = document.querySelectorAll(".product-card__current-price");

const plusButtons = document.querySelectorAll(".plusButton");
const minusButtons = document.querySelectorAll(".minusButton");

const productCardElements = document.querySelectorAll(".product-card");
const addToCartButtons = document.querySelectorAll(".product-card__add-button");

const sortSelect = document.querySelector(".product-list__sort-select");

const categoryBtns = document.querySelectorAll(".category-pill");

// Mảng chứa các products
let cartItems = [];

// HÀM KIỂM TRA ITEM ĐÃ CÓ TRONG GIỎ HÀNG CHƯA (TRẢ VỀ INDEX HOẶC -1)
function findCartItemIndex(item, cartList) {
  let itemIndex = -1;
  for (let i = 0; i < cartList.length; i++) {
    if (item.id === cartList[i].id) {
      itemIndex = i;
      break;
    }
  }
  return itemIndex;
}
// HÀM XỬ LÝ NGHIỆP VỤ KHI ẤN VÀO "THÊM VÀO GIỎ HÀNG"
const addProductToCart = (e) => {
  const buyButton = e.currentTarget;

  // Trường hợp storage đã được tạo
  if (typeof Storage !== "undefined") {
    const productInfoEl = buyButton.previousElementSibling;

    // khởi tạo đối tượng qua việc lấy thông tin từ các cây DOM
    const newItem = {
      id: productInfoEl.children[0].textContent.trim(),
      price: productInfoEl.children[1].textContent.trim(),
      title: productInfoEl.children[2].textContent.trim(),
      quantity: productInfoEl.children[7].children[1].value,
    };

    // Do data được lưu trong localStorage là string nên cần phải parse sang đối tượng
    const storedCart = JSON.parse(localStorage.getItem("cartItems"));

    // Nếu storedCard rỗng do danh sách chưa được lưu vào localStorage, thì thêm sản phẩm vào danh sách sản phẩm rồi thêm vào localStorage với key là "cartItems"
    // Ngược lại, nếu đã tồn tại thì kiểm tra tiếp xem sản phẩm có tồn tại trong danh sách không
    // Nếu tồn tại thì chỉ cần tăng số lượng còn không thì thêm sản phẩm mới vào danh sách sản phẩm, rồi thêm vào localStorage với key là "cartItems"
    if (storedCart === null) {
      cartItems.push(newItem);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } else {
      cartItems = storedCart;
      const existingIndex = findCartItemIndex(newItem, cartItems);

      if (existingIndex !== -1) {
        const addedQuantity = parseInt(newItem.quantity, 10);
        const currentQuantity = parseInt(cartItems[existingIndex].quantity, 10);
        cartItems[existingIndex].quantity = JSON.stringify(addedQuantity + currentQuantity);
      } else {
        cartItems.push(newItem);
      }
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      alert("thêm vào giỏ hàng thành công");
    }
  }
  // Trường hợp storage chưa được tạo thì in ra cảnh báo
  else {
    alert("local storage is not working in your browser");
  }
};

// HÀM NHẬN CALLBACK
function addEventToCartButtons() {
  // Thêm hàm nhận callback cho từng button add cart
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addProductToCart, false);
  });
}

// ĐỊNH DẠNG GIÁ TIỀN THEO ĐỊNH DẠNG VND
function formatPrices() {
  oldPriceElements.forEach((priceEl) => {
    priceEl.innerText = Number(priceEl.innerText).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  });

  currentPriceElements.forEach((priceEl) => {
    priceEl.innerText = Number(priceEl.innerText).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  });
}

// HÀM SẮP XẾP THỨ TỰ CÁC PHẨM THEO TIÊU CHÍ
const sortItems = () => {
  // tạo một bản sao dưới dạng array để sử dụng sort() để sắp xếp, đồng thời để lưu trữ bản sao của thứ tự trên cây DOM ban đầu
  let productCards = Array.from(productCardElements);

  const sortSelected = sortSelect.value;

  // sử dụng switch case để chia các trường hợp sắp xếp
  switch (sortSelected) {
    case "price-asc":
      productCards.sort((cardA, cardB) => {
        const priceA = parseFloat(cardA.querySelector(".card-price").textContent);
        const priceB = parseFloat(cardB.querySelector(".card-price").textContent);
        return priceA - priceB;
      });
      break;
    case "price-desc":
      productCards.sort((cardA, cardB) => {
        const priceA = parseFloat(cardA.querySelector(".card-price").textContent);
        const priceB = parseFloat(cardB.querySelector(".card-price").textContent);
        return priceB - priceA;
      });
      break;
    case "name-asc":
      productCards.sort((cardA, cardB) => {
        const nameA = cardA.querySelector(".product-card__title").textContent.trim().toLowerCase();
        const nameB = cardB.querySelector(".product-card__title").textContent.trim().toLowerCase();
        return nameA.localeCompare(nameB);
      });
      break;
    case "name-desc":
      productCards.sort((cardA, cardB) => {
        const nameA = cardA.querySelector(".product-card__title").textContent.trim().toLowerCase();
        const nameB = cardB.querySelector(".product-card__title").textContent.trim().toLowerCase();
        return nameB.localeCompare(nameA);
      });
      break;
    default:
      // Chọn lại mặc định thì thứ tự ban đầu từ cây DOM
      break;
  }

  // Sau khi sắp xếp thì append ngược lại vào product Grid để áp dụng thứ tự đã sắp xếp
  productCards.forEach((card) => {
    productGrid.appendChild(card); // Thêm mỗi phần tử vào cuối productGrid (nếu đã tồn tại sẽ di chuyển vị trí, không tạo bản sao)
  });
};

// THỰC HIỆN SẮP XẾP THEO TIÊU CHÍ
sortSelect.addEventListener("change", sortItems, false);

// THAY ĐỔI SỐ LƯỢNG SẢN PHẨM CHO VÀO GIỎ HÀNG
const changeQuantity = (e) => {
  const changeButton = e.target;
  const quantityInput = changeButton.parentElement.children[1];

  // Do value của quanity là string nên phải parse sang int để thực hiện phép tính
  let quantity = parseInt(quantityInput.value, 10);

  const typeOfChange = changeButton.textContent.trim();

  // nếu button nhấp vào có content là "-" thì giảm số lượng nhập, nếu số lượng là 1 thì không trừ tiếp để tránh số lượng âm hoặc bằng 0
  if (typeOfChange === "-" && quantity > 1) {
    quantity--;
  }
  // nếu button nhấp vào có content là "+" thì tăng số lượng nhập
  if (typeOfChange === "+") {
    quantity++;
  }
  quantityInput.value = quantity;
};

// THÊM SỰ KIỆN CHO HAI BUTTON TĂNG VÀ GIẢM SỐ LƯỢNG
function addEventToQuantityButtons() {
  plusButtons.forEach((button) => {
    button.addEventListener("click", changeQuantity, false);
  });
  minusButtons.forEach((button) => {
    button.addEventListener("click", changeQuantity, false);
  });
}

// LỌC SẢN PHẨM THEO THỂ LOẠI
const sortByCategory = (e) => {
  const categoryValue = e.currentTarget.textContent;
  let products = productCardElements;

  products.forEach((product) => {
    let productCategory = product.children[1].children[3].textContent;

    if (categoryValue === "Tất cả") {
      // nếu chọn tất cả thì tắt các thuộc tính hidden cho toàn bộ phần tử
      product.classList.remove("hidden");
    } else {
      if (productCategory === categoryValue) {
        product.classList.remove("hidden");
      } else {
        // ẩn các phần tử không thỏa mãn categoryValue
        product.classList.add("hidden");
      }
    }
  });

  // chuyển các buttons về trạng thái unactive
  categoryBtns.forEach((btn) => {
    btn.setAttribute("class", "category-pill");
  });

  // chuyển trạng thái button vừa click thành active
  e.currentTarget.setAttribute("class", "category-pill active");
};

// GẮN SỰ KIỆN VÀO CÁC NÚT CATEGORIES
function addEventToCategoryButton() {
  categoryBtns.forEach((categoryBtn) => {
    categoryBtn.addEventListener("click", sortByCategory, false);
  });
}

// HÀM GỌI CÙNG LÚC CÁC PHƯƠNG THỨC ĐÃ ĐƯỢC ĐỊNH NGHĨA
function setup() {
  addEventToCartButtons();
  addEventToQuantityButtons();
  formatPrices();
  addEventToCategoryButton();
}

// thực thi setup sau khi trang web được load
window.addEventListener("load", setup, false);
