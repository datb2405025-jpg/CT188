/* =========================================================

   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  // Mở/đóng menu trên màn hình nhỏ.
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#main-navigation");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", function () {
      const isOpen = navigation.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Đóng menu" : "Mở menu");
      menuButton.innerHTML = isOpen
        ? '<i class="ri-close-line" aria-hidden="true"></i>'
        : '<i class="ri-menu-line" aria-hidden="true"></i>';
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
      .replace(/đ/g, "d");
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
