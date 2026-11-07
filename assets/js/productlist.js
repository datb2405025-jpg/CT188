// AUTHOR: NGUYEN TRAN GIA HUY B2509664

// Thao tác lấy dữ liệu từ cây DOM
const sortSelect = document.querySelector("#sort");
const productGrid = document.querySelector(".product-list__grid");

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
