// AUTHOR: NGUYEN TRAN GIA HUY B2509664

// Thao tác lấy dữ liệu từ cây DOM
const sortSelect = document.querySelector("#sort");
const productGrid = document.querySelector(".product-list__grid");

// khởi tạo mảng chứa sản phầm trong giỏ hàng
let updatedCartItems = [];

// Lấy tất cả phần từ có class là product-card
const productCards = Array.from(document.querySelectorAll(".product-card"));

// Lưu thứ tự ban đầu
const originalCards = [...productCards];

// Thức hiện sort theo tiêu chí
sortSelect.addEventListener("change", function () {
  const sortType = this.value;
  let sortCards = [...productCards];

  switch (sortType) {
    case "price-asc":
      sortCards.sort((a, b) => {
        const priceA = parseFloat(a.querySelector(".card-price").textContent);
        const priceB = parseFloat(b.querySelector(".card-price").textContent);
        return priceA - priceB;
      });
      break;
    case "price-desc":
      sortCards.sort((a, b) => {
        const priceA = parseFloat(a.querySelector(".card-price").textContent);
        const priceB = parseFloat(b.querySelector(".card-price").textContent);
        return priceB - priceA;
      });
      break;
    case "name-asc":
      sortCards.sort((a, b) => {
        const nameA = a.querySelector(".product-card__title").textContent.trim().toLowerCase();
        const nameB = b.querySelector(".product-card__title").textContent.trim().toLowerCase();
        return nameA.localeCompare(nameB);
      });
      break;
    case "name-desc":
      sortCards.sort((a, b) => {
        const nameA = a.querySelector(".product-card__title").textContent.trim().toLowerCase();
        const nameB = b.querySelector(".product-card__title").textContent.trim().toLowerCase();
        return nameB.localeCompare(nameA);
      });
      break;
    default:
      sortCards = [...originalCards];
      break;
  }

  sortCards.forEach((card) => {
    productGrid.appendChild(card); // Thêm vào mỗi phần tử của sortCards vào cuối productGrid nếu phần từ đã tồn tại thì sẽ di chuyển đến vị trí mới và không tạo bản sao
  });
});
// Nghiệp vụ giỏ hàng

// Hàm kiểm tra item có trong giỏ chưa
function isExistedInCart(item, cartItemArr) {
  let itemIndex = -1;
  for (let i = 0; i < cartItemArr.length; i++) {
    if (item.id === cartItemArr[i].id) {
      itemIndex = i;
      break;
    }
  }
  return itemIndex;
}



const orderSelectedProduct = (e) => {

  const buyClicked = e.target;

  if (typeof Storage !== undefined) {

    let newItem = {
      id: buyClicked.previousElementSibling.children[0].textContent,
      price: buyClicked.previousElementSibling.children[1].textContent,
      title: buyClicked.previousElementSibling.children[2].textContent,
      quantity: buyClicked.previousElementSibling.children[5].children[1].value,
    };


    if (JSON.parse(localStorage.getItem("cartItems")) === null) {
      updatedCartItems.push(newItem);
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      location.reload();
    }

    else {
      updatedCartItems = JSON.parse(localStorage.getItem("cartItems"));

      if (isExistedInCart(newItem, updatedCartItems) !== -1 /* (index = isExistedInCart(newItem, updatedCartItem)) !==-1 */) {
        updatedCartItems[isExistedInCart(newItem, updatedCartItems)].quantity++;
      }


      else {
        updatedCartItems.push(newItem);
        console.log(updatedCartItems)
      }
      localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      alert("thêm vào giỏ hàng thành công");
      location.reload();
    }
  }

  else {
    alert("local storage is not working in your browser");

  }
};

function addEvent2AllCartButtons() {
  const add2CartList = document.querySelectorAll(".product-card__add-button");
  for (let item = 0; item < add2CartList.length; item++) {
    add2CartList[item].addEventListener("click", orderSelectedProduct, false);
  }
}

// thay đổi số lượng sản phẩm cho vào giỏ hàng
const changeQuanity = (e) => {
  const changeButton = e.target
  const quantityInput = changeButton.parentElement.querySelector(".quantity");
  let quanityNumber = parseInt(quantityInput.value, 10)
  if (changeButton.textContent === "+") {
    quanityNumber++;
  }
  if (changeButton.textContent === "-") {
    if (quanityNumber > 1)
      quanityNumber--;
  }

  quantityInput.value = quanityNumber;
}


// thêm sự kiện cho hai button tăng và giảm 
function addEvent2QuanityButtons() {
  const plusButtons = document.querySelectorAll(".plusButton");
  const minusButtons = document.querySelectorAll(".minusButton");

  plusButtons.forEach((button) => {
    button.addEventListener("click", changeQuanity, false)
  })
  minusButtons.forEach((button) => {
    button.addEventListener("click", changeQuanity, false)
  })
}





function setPrice() {
  const oldPrices = document.querySelectorAll(".product-card__old-price")
  const currPrices = document.querySelectorAll(".product-card__current-price")

  oldPrices.forEach(item => {
    item.innerText = Number(item.innerText).toLocaleString("vi-VN", { style: "currency", currency: "VND" }, false)
  })

  currPrices.forEach(item => {
    item.innerText = Number(item.innerText).toLocaleString("vi-VN", { style: "currency", currency: "VND" }, false)
  })
}

function redirect2ShowCartPage() {
  const cartItems = JSON.parse(localStorage.getItem("cartItems"))
  let displayNumber = document.querySelector(".ri-shopping-cart-2-line");
  let numberOfItems = cartItems.length;
  if (numberOfItems !== 0) {
    displayNumber.textContent = numberOfItems;
  }
}



function setup() {
  addEvent2AllCartButtons();
  addEvent2QuanityButtons();
  redirect2ShowCartPage();
  setPrice()
}


window.addEventListener("load", setup, false);
