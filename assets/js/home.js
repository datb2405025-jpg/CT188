/* =========================================================
    Tên: Võ Minh Tấn
    Ngày thực hiện:15/11/2026
    MSSV:B2405054
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  // Mở/đóng menu trên màn hình nhỏ.
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#main-navigation");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", function () {
      const isOpen = navigation.classList.toggle("is-open");
      menuButton.innerHTML = isOpen
        ? '<i class="ri-close-line"></i>'
        : '<i class="ri-menu-line"></i>';
    });
  }

  // Tìm kiếm trực tiếp trên những thẻ sách HTML đã có sẵn.
  const searchInput = document.querySelector("#book-search");
  const bookCards = Array.from(
    document.querySelectorAll("#book-grid .book-card"),
  );
  const resultText = document.querySelector("#search-result");
  const emptyMessage = document.querySelector("#empty-search");

  function removeVietnameseDau(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/\s+/g, " ")
      .trim();
  }

  if (searchInput && bookCards.length > 0) {
    searchInput.addEventListener("input", function () {
      const keyword = removeVietnameseDau(searchInput.value.trim());
      let visibleCount = 0;

      bookCards.forEach(function (card) {
        const searchableText = removeVietnameseDau(
          (card.dataset.search || "") + " " + card.textContent,
        );
        const isMatched = searchableText.includes(keyword);
        card.hidden = !isMatched;
        if (isMatched) visibleCount += 1;
      });

      if (resultText) {
        resultText.textContent = keyword
          ? "Tìm thấy " + visibleCount + " kết quả"
          : "Hiển thị " + visibleCount + " gợi ý sách";
      }

      if (emptyMessage) {
        emptyMessage.hidden = visibleCount !== 0;
      }
    });
  }
});
// Bổ sung header hiển thị sau khi đăng nhập
const loginLink = document.getElementById("header-login");
const userBox = document.getElementById("header-user");
const userNameEl = document.getElementById("header-user-name");
const logoutBtn = document.getElementById("header-logout");

if (loginLink && userBox && userNameEl && logoutBtn) {
  const userName = localStorage.getItem("userName");

  if (userName) {
    loginLink.style.display = "none";
    userBox.style.display = "flex";
    userNameEl.textContent = userName;
  }

  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("userName");
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  });
}
