// AUTHOR: NGUYEN TRAN GIA HUY B2509664

// Thao tác lấy phần tử trên DOM
const sortSelect = document.querySelector("#sort");
const productGrid = document.querySelector(".product-list__grid");
const oldPriceElements = document.querySelectorAll(".product-card__old-price");
const currentPriceElements = document.querySelectorAll(".product-card__current-price");
const plusButtons = document.querySelectorAll(".plusButton");
const minusButtons = document.querySelectorAll(".minusButton");
const productCardElements = document.querySelectorAll(".product-card");
const categoryPill = document.querySelectorAll(".category-pill")
const addToCartButtons = document.querySelectorAll(".product-card__add-button");


// Trạng thái của trang web
let cartItems = [];
const productCards = Array.from(productCardElements);
let currentSortType = sortSelect.value;

// Lưu danh sách sản phẩm theo thứ tự ban đầu
const defaultProductCards = [...productCards];

const sortItems = () => {

  const sortType = document.querySelector(".product-list__sort-select")
  currentSortType = sortType.value;
  let sortedCards = [...productCards];

  switch (currentSortType) {
    case "price-asc":
      sortedCards.sort((cardA, cardB) => {
        const priceA = parseFloat(cardA.querySelector(".card-price").textContent);
        const priceB = parseFloat(cardB.querySelector(".card-price").textContent);
        return priceA - priceB;
      });
      break;
    case "price-desc":
      sortedCards.sort((cardA, cardB) => {
        const priceA = parseFloat(cardA.querySelector(".card-price").textContent);
        const priceB = parseFloat(cardB.querySelector(".card-price").textContent);
        return priceB - priceA;
      });
      break;
    case "name-asc":
      sortedCards.sort((cardA, cardB) => {
        const nameA = cardA.querySelector(".product-card__title").textContent.trim().toLowerCase();
        const nameB = cardB.querySelector(".product-card__title").textContent.trim().toLowerCase();
        return nameA.localeCompare(nameB);
      });
      break;
    case "name-desc":
      sortedCards.sort((cardA, cardB) => {
        const nameA = cardA.querySelector(".product-card__title").textContent.trim().toLowerCase();
        const nameB = cardB.querySelector(".product-card__title").textContent.trim().toLowerCase();
        return nameB.localeCompare(nameA);
      });
      break;
    default:
      sortedCards = [...defaultProductCards];
      break;
  }

  sortedCards.forEach((card) => {
    productGrid.appendChild(card); // Thêm mỗi phần tử vào cuối productGrid (nếu đã tồn tại sẽ di chuyển vị trí, không tạo bản sao)
  });
}

// Nghiệp vụ giỏ hàng

// Hàm kiểm tra item đã có trong giỏ hàng chưa (trả về index hoặc -1)
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

const addProductToCart = (e) => {
  const buyButton = e.currentTarget;

  if (typeof Storage !== "undefined") {
    const productInfoEl = buyButton.previousElementSibling;
    const newItem = {
      id: productInfoEl.children[0].textContent.trim(),
      price: productInfoEl.children[1].textContent.trim(),
      title: productInfoEl.querySelector(".product-card__title").textContent.trim(),
      quantity: productInfoEl.querySelector(".quantity").value,
    };

    const storedCart = JSON.parse(localStorage.getItem("cartItems"));
    if (storedCart === null) {
      cartItems.push(newItem);
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      location.reload();
    } else {
      cartItems = storedCart;
      const existingIndex = findCartItemIndex(newItem, cartItems);

      if (existingIndex !== -1) {
        const addedQuantity = parseInt(newItem.quantity, 10);
        const currentQuantity = parseInt(cartItems[existingIndex].quantity, 10);
        cartItems[existingIndex].quantity = JSON.stringify(addedQuantity + currentQuantity);
      } else {
        cartItems.push(newItem);
        console.log(cartItems);
      }
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      alert("thêm vào giỏ hàng thành công");
      location.reload();
    }
  } else {
    alert("local storage is not working in your browser");
  }
};

function addEventToCartButtons() {
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addProductToCart, false);
  });
}

// Thay đổi số lượng sản phẩm cho vào giỏ hàng
const changeQuantity = (e) => {
  const changeButton = e.target;
  const quantityInput = changeButton.parentElement.children[1];

  let quantity = parseInt(quantityInput.value, 10);
  const typeOfChange = changeButton.textContent.trim();
  if (typeOfChange === "-" && quantity > 1) {
    quantity--;
  }
  if (typeOfChange === "+") {
    quantity++;
  }
  quantityInput.value = quantity;
};

// Thêm sự kiện cho hai button tăng và giảm số lượng
function addEventToQuantityButtons() {
  plusButtons.forEach((button) => {
    button.addEventListener("click", changeQuantity, false);
  });
  minusButtons.forEach((button) => {
    button.addEventListener("click", changeQuantity, false);
  });
}

function formatPrices() {
  oldPriceElements.forEach((priceEl) => {
    priceEl.innerText = Number(priceEl.innerText).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  });

  currentPriceElements.forEach((priceEl) => {
    priceEl.innerText = Number(priceEl.innerText).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  });
}

function updateCartBadge() {
  const cartData = JSON.parse(localStorage.getItem("cartItems"));
  const cartBadge = document.querySelector(".ri-shopping-cart-2-line");
  if (cartData === null || !cartBadge) return;
  const numberOfItems = cartData.length;
  if (numberOfItems !== 0) {
    cartBadge.textContent = numberOfItems;
  }
}

// Thực hiện sắp xếp theo tiêu chí
sortSelect.addEventListener("change", sortItems, false);


function setup() {
  addEventToCartButtons();
  addEventToQuantityButtons();
  updateCartBadge();
  formatPrices();
  updateCartBadge();
}

window.addEventListener("load", setup, false);

