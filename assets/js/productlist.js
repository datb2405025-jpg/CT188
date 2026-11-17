// AUTHOR: NGUYEN TRAN GIA HUY B2509664


const productGrid = document.querySelector(".product-list__grid");

const oldPriceElements = document.querySelectorAll(".product-card__old-price");
const currentPriceElements = document.querySelectorAll(".product-card__current-price");

const plusButtons = document.querySelectorAll(".plusButton");
const minusButtons = document.querySelectorAll(".minusButton");

const productCardElements = document.querySelectorAll(".product-card");
const addToCartButtons = document.querySelectorAll(".product-card__add-button");

const sortSelect = document.querySelector(".product-list__sort-select")
const categoryPill = document.querySelectorAll(".category-pill")

const categories = document.querySelector(".product-list__categories")
const categoryBtns = document.querySelectorAll(".category-pill")



// Mảng chứa các products
let cartItems = [];


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
// Hàm xử lý nghiệp vụ khi ấn vào "thêm vào giỏ hàng"
const addProductToCart = (e) => {
  const buyButton = e.currentTarget;

  if (typeof Storage !== "undefined") {
    const productInfoEl = buyButton.previousElementSibling;

    // khởi tạo đối tượng qua việc lấy thông tin từ các cây DOM
    const newItem = {
      id: productInfoEl.children[0].textContent.trim(),
      price: productInfoEl.children[1].textContent.trim(),
<<<<<<< HEAD
      title: productInfoEl.querySelector(".product-card__title").textContent.trim(),
      quantity: productInfoEl.querySelector(".quantity").value,
=======
      title: productInfoEl.children[2].textContent.trim(),
      quantity: productInfoEl.children[7].children[1].value,
>>>>>>> b968beb (update productList)
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
      }
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      alert("thêm vào giỏ hàng thành công");
      location.reload();
    }
  } else {
    alert("local storage is not working in your browser");
  }
};


// Hàm nhận callback
function addEventToCartButtons() {
  // Thêm hàm nhận callback cho từng button add cart
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", addProductToCart, false);
  });
}

// Định dạng giá tiền theo định dạng VND
function formatPrices() {
  oldPriceElements.forEach((priceEl) => {
    priceEl.innerText = Number(priceEl.innerText).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  });

  currentPriceElements.forEach((priceEl) => {
    priceEl.innerText = Number(priceEl.innerText).toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  });
}


// Hàm sắp xếp thứ tự các phẩm theo tiêu chí 
const sortItems = () => {

  // chuyển các collection sang array để sử lý qua sort()
  let productCards = Array.from(productCardElements);

  const sortSelected = sortSelect.value;

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
      // Chọn lại mặc định thì reload webpage để trả về giá trị ban đầu, phần này có thể dùng sao chép sâu để lưu trạng thái ban đầu để không cần reload lại page,
      location.reload();
      break;
  }

  productCards.forEach((card) => {
    productGrid.appendChild(card); // Thêm mỗi phần tử vào cuối productGrid (nếu đã tồn tại sẽ di chuyển vị trí, không tạo bản sao)
  });
}

// Thực hiện sắp xếp theo tiêu chí
sortSelect.addEventListener("change", sortItems, false);


// Thay đổi số lượng sản phẩm cho vào giỏ hàng
const changeQuantity = (e) => {
  const changeButton = e.target;
  const quantityInput = changeButton.parentElement.children[1];


  // Do value ccủa quanity là string nên phải parse sang int để thực hiện phép tính
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


function updateCartBadge() {
  const cartData = JSON.parse(localStorage.getItem("cartItems"));
  const cartBadge = document.querySelector(".ri-shopping-cart-2-line");
  if (cartData === null || !cartBadge) return;
  const numberOfItems = cartData.length;
  if (numberOfItems !== 0) {
    cartBadge.textContent = numberOfItems;
  }
}


const sortByCategory = (e) => {
  const categoryValue = e.currentTarget.textContent;
  let products = productCardElements;

  products.forEach(product => {
    let productCategory = product.children[1].children[3].textContent

    if (categoryValue === "Tất cả") {
      // nếu chọn tất cả thì tắt các thuộc tính hidden cho toàn bộ phần tử 
      product.hidden = false;
    }

    else {
      if (productCategory === categoryValue) {
        product.hidden = false;

      } else {
        // ẩn các phần tử không thỏa mãn categoryValue 
        product.hidden = true;
      }
    }
  })

  // chuyển các buttons về trạng thái unactive 

  categoryBtns.forEach(btn => {
    btn.setAttribute("class", "category-pill")
  })

  // chuyển trạng thái button vừa click thành active 
  e.currentTarget.setAttribute("class", "category-pill active")

}

function addEventToCategoryButton() {
  categoryBtns.forEach(categoryBtn => {
    categoryBtn.addEventListener("click", sortByCategory, false)
  })
}



function setup() {
  addEventToCartButtons();
  addEventToQuantityButtons();
  updateCartBadge();
  formatPrices();
  updateCartBadge();
  addEventToCategoryButton();
}

window.addEventListener("load", setup, false);

