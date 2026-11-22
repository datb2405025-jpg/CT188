/*
 * Header/footer và điều hướng chung cho Bookshelf.
 * Tham khảo CT188-BGR phần 2: DOM, sự kiện, JSON và Web Storage.
 * Nội dung header/footer thống nhất từ index.html của dự án.
 */
document.getElementById('site-header').innerHTML = `
      <div class="home-container header-inner">
        <a class="brand" href="index.html" aria-label="Bookshelf - Trang chủ">
          <img
            alt="Logo Bookshelf"
            class="brand-logo"
            src="assets/images/Bookshelf.png"
          />
        </a>
        <button class="menu-toggle" type="button" aria-label="Mở menu" aria-expanded="false" aria-controls="main-navigation">
          <i class="ri-menu-line"></i>
        </button>
        <nav class="main-navigation" id="main-navigation" aria-label="Điều hướng chính">
          <a class="nav-link" href="index.html">Trang chủ</a>
          <a class="nav-link" href="productlist.html">Sản phẩm</a>
          <a class="nav-link" href="about.html">Giới thiệu</a>
        </nav>
        <div class="header-actions">
          <a id="account-link" class="header-action" href="login.html">
            <i class="ri-user-line"></i>
            <span>Đăng nhập</span>
          </a>
          <a class="cart-action" href="cart.html">
            <i class="ri-shopping-bag-3-line"></i>
            <span>Giỏ hàng (<span id="site-cart-count" aria-live="polite">0</span>)</span>
          </a>
          <button class="site-logout" id="site-logout" type="button" hidden>Đăng xuất</button>
        </div>
      </div>
    `;
document.getElementById('footer').innerHTML = `
      <div class="footer-line"></div>
      <div class="home-container footer-content">
        <div class="footer-item footer-bookshelf">
          <div class="footer-brand">
            <img alt="Logo Bookshelf" src="assets/images/logo-footer.png" />
          </div>
          <p class="footer-text">
            Lan tỏa tri thức <br />
            nuôi dưỡng đam mê.
          </p>
          <p class="footer-slogan">Mỗi trang sách, một chân trời mới.</p>
          <div class="footer-title-underline">
            <h2 class="footer-title">Tìm hiểu nhiều hơn</h2>
            <span class="footer-underline"></span>
          </div>
          <div class="footer-social">
            <a href="#" title="Facebook (chưa cập nhật liên kết)"
              ><i class="ri-facebook-fill"></i
            ></a>
            <a href="#" title="Instagram (chưa cập nhật liên kết)"
              ><i class="ri-instagram-fill"></i
            ></a>
            <a href="#" title="TikTok (chưa cập nhật liên kết)"
              ><i class="ri-tiktok-fill"></i
            ></a>
            <a href="#" title="Twitter (chưa cập nhật liên kết)"
              ><i class="ri-twitter-fill"></i
            ></a>
          </div>
        </div>
        <div class="footer-item footer-about">
          <div class="footer-title-underline">
            <h2 class="footer-title">BOOKSHELF VIỆT NAM</h2>
            <span class="footer-underline"></span>
          </div>
          <ul class="footer-links">
            <li>
              <a href="index.html"
                ><i class="ri-arrow-right-s-line"></i> BOOKSHELF</a
              >
            </li>
            <li>
              <a href="#"><i class="ri-arrow-right-s-line"></i> Tuyển dụng</a>
            </li>
            <li>
              <a href="#"><i class="ri-arrow-right-s-line"></i> Điều khoản</a>
            </li>
            <li>
              <a href="#"
                ><i class="ri-arrow-right-s-line"></i> Chính sách bảo mật</a
              >
            </li>
            <li>
              <a href="#"><i class="ri-arrow-right-s-line"></i> Flash Sale</a>
            </li>
          </ul>
        </div>
        <div class="footer-item footer-contact">
          <div class="footer-title-underline">
            <h2 class="footer-title">LIÊN HỆ BOOKSHELF</h2>
            <span class="footer-underline"></span>
          </div>
          <ul class="footer-links">
            <li>
              <span class="footer-detail"
                ><i class="ri-map-pin-fill"></i
                ><span
                  >97 Đường 3/2, P. Xuân Khánh, Q. Ninh Kiều, TP. Cần Thơ</span
                ></span
              >
            </li>
            <li>
              <a href="tel:0979797970"
                ><i class="ri-phone-fill"></i><span>0979 797 970</span></a
              >
            </li>
            <li>
              <a href="mailto:cskh@bookshelf.com.vn"
                ><i class="ri-mail-line"></i
                ><span>cskh@bookshelf.com.vn</span></a
              >
            </li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>
          © 2026
          <img alt="" src="assets/images/logo-footer.png" />
          Bookshelf · Thực hiện bởi Nhóm 6 – CT188.
        </p>
      </div>
    `;

// Đánh dấu trang hiện tại theo tên file trong địa chỉ.
const currentPage = location.pathname.split('/').pop() || 'index.html';
const siteLinks = document.querySelectorAll('#site-header a');
siteLinks.forEach(function (link) {
    if (link.getAttribute('href') === currentPage) {
        link.setAttribute('aria-current', 'page');
        if (link.classList.contains('nav-link')) {
            link.classList.add('active');
        }
    }
});

const siteMenuButton = document.querySelector('#site-header .menu-toggle');
const siteNavigation = document.getElementById('main-navigation');
siteMenuButton.addEventListener('click', function () {
    const isOpen = siteNavigation.classList.toggle('is-open');
    siteMenuButton.setAttribute('aria-expanded', String(isOpen));
    siteMenuButton.setAttribute('aria-label', isOpen ? 'Đóng menu' : 'Mở menu');
    siteMenuButton.innerHTML = isOpen
        ? '<i class="ri-close-line" aria-hidden="true"></i>'
        : '<i class="ri-menu-line" aria-hidden="true"></i>';
});

// Cộng số cuốn thay vì số loại sách. Lỗi dữ liệu được xử lý tại trang cart.
function updateHeaderCartCount() {
    let quantity = 0;
    try {
        const items = JSON.parse(localStorage.getItem('cartItems')) || [];
        if (Array.isArray(items)) {
            items.forEach(function (item) {
                if (item && Number(item.quantity) > 0 && isFinite(Number(item.quantity))) {
                    quantity += Number(item.quantity);
                }
            });
        }
    } catch (error) {
        quantity = 0;
    }
    document.getElementById('site-cart-count').textContent = quantity;
    document.querySelector('#site-header .cart-action').setAttribute('aria-label', 'Giỏ hàng, ' + quantity + ' sản phẩm');
}

function updateHeaderAccount() {
    const link = document.getElementById('account-link');
    const logout = document.getElementById('site-logout');
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('currentUser'));
    } catch (error) {
        user = null;
    }
    link.querySelector('span').textContent = user && user.name ? user.name : 'Đăng nhập';
    link.setAttribute('aria-label', user && user.name ? 'Tài khoản ' + user.name : 'Đăng nhập');
    logout.hidden = !(user && user.name);
}

document.getElementById('site-logout').addEventListener('click', function () {
    localStorage.removeItem('currentUser');
    updateHeaderAccount();
});

// Cập nhật cả khi quay lại trang bằng Back hoặc thay đổi giỏ ở tab khác.
window.addEventListener('pageshow', function () {
    updateHeaderCartCount();
    updateHeaderAccount();
});
window.addEventListener('storage', function () {
    updateHeaderCartCount();
    updateHeaderAccount();
});
updateHeaderCartCount();
updateHeaderAccount();


// Các liên kết mẫu chưa có nội dung giữ tại chỗ, tránh nhảy lên đầu trang.
document.querySelectorAll('#footer a[href="#"]').forEach(function (link) {
    link.setAttribute('aria-disabled', 'true');
    link.addEventListener('click', function (event) {
        event.preventDefault();
    });
});
