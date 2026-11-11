//Người thực hiện: Lê Tiến Đạt//
// ====================================
// THÔNG BÁO TOASTIFY
// ====================================
let currentToast = null;
const showToast = (message, color) => {
    // Nếu Toastify chưa được tải thì dùng alert
    if (typeof Toastify !== "function") {
        alert(message);
        return;
    }
    if (currentToast) {
        currentToast.hideToast();
    }
    currentToast = Toastify({
        text: message,
        duration: 4000,
        gravity: "top",
        position: "right",
        offset: {
            x: 5,
            y: 90
        },
        style: {
            background: color,
            color: "#ffffff",
            borderRadius: "8px"
        }
    });
    currentToast.showToast();
};
const showSuccess = (message) => {
    showToast(message, "#22c55e");
};
const showError = (message) => {
    showToast(message, "#ef4444");
};
// ====================================
// LẤY CÁC PHẦN TỬ HTML
// ====================================
const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");
const wrapper = document.querySelector(".wrapper");
const title = document.querySelector(".form-header .title");
const switchLogin = document.getElementById("switch-log");
// Lưu ý: HTML cần dùng đúng ID này.
// Nếu HTML đang viết swicth-reg thì đổi thành swicth-reg ở dòng dưới.
const switchRegister = document.getElementById("swicth-reg");
// Hiện form đăng ký, ẩn form đăng nhập
const registerFunction = () => {
    loginForm.classList.add("hidden-form");
    registerForm.classList.remove("hidden-form");
    registerForm.classList.add("show-form");
    wrapper.classList.remove("login-mode");
    wrapper.classList.add("register-mode");
    title.textContent = "Đăng ký";
};
// Hiện form đăng nhập, ẩn form đăng ký
const loginFunction = () => {
    registerForm.classList.add("hidden-form");
    registerForm.classList.remove("show-form");
    loginForm.classList.remove("hidden-form");
    wrapper.classList.remove("register-mode");
    wrapper.classList.add("login-mode");
    title.textContent = "Đăng nhập";
};
// Nhấn Đăng ký ngay
if (switchRegister) {
    switchRegister.addEventListener("click", (event) => {
        event.preventDefault();
        registerFunction();
    });
}
// Nhấn Đăng nhập ngay
if (switchLogin) {
    switchLogin.addEventListener("click", (event) => {
        event.preventDefault();
        loginFunction();
    });
}
// ====================================
// LỜI CHÀO THEO THỜI GIAN
// ====================================
const setGreeting = () => {
    const greetingElement = document.getElementById("greeting");
    if (!greetingElement) return;
    const hour = new Date().getHours();
    let greeting = "";
    let gradient = "";
    if (hour >= 5 && hour < 12) {
        greeting = "Bookshelf chúc bạn có một buổi sáng vui vẻ ☀️";
        gradient = "linear-gradient(135deg, #f97316, #fbbf24)";
    } else if (hour >= 12 && hour < 18) {
        greeting = "Bookshelf chúc bạn có một buổi chiều vui vẻ 🌤️";
        gradient = "linear-gradient(135deg, #f97316, #ef4444)";
    } else if (hour >= 18 && hour < 23) {
        greeting = "Bookshelf chúc bạn có một buổi tối vui vẻ 🌙";
        gradient = "linear-gradient(135deg, #3b82f6, #60a5fa)";
    } else {
        greeting = "Bookshelf chúc bạn ngủ ngon 💤";
        gradient = "linear-gradient(135deg, #6366f1, #111827)";
    }
    greetingElement.textContent = greeting;
    greetingElement.style.background = gradient;
};
setGreeting();
setInterval(setGreeting, 60000);
// ====================================
// HIỂN THỊ / ẨN MẬT KHẨU
// ====================================
const passwordInputs = document.querySelectorAll(".password-input");
passwordInputs.forEach((input) => {
    // Tìm icon con mắt trong cùng vùng chứa input
    const eye = input.parentElement.querySelector(".toggle");
    // Nếu không có icon thì bỏ qua
    if (!eye) return;
    // Chỉ hiện icon khi người dùng nhập mật khẩu
    input.addEventListener("input", () => {
        if (input.value.length > 0) {
            eye.style.opacity = "1";
            eye.style.visibility = "visible";
        } else {
            eye.style.opacity = "0";
            eye.style.visibility = "hidden";
            input.type = "password";
            eye.classList.remove("ri-eye-fill");
            eye.classList.add("ri-eye-off-fill");
        }
    });
});
// Sự kiện bấm icon con mắt
const toggles = document.querySelectorAll(".toggle");
toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
        const input = toggle.parentElement.querySelector(".password-input");
        if (!input) return;
        if (input.type === "password") {
            input.type = "text";
            toggle.classList.remove("ri-eye-off-fill");
            toggle.classList.add("ri-eye-fill");
        } else {
            input.type = "password";
            toggle.classList.remove("ri-eye-fill");
            toggle.classList.add("ri-eye-off-fill");
        }
    });
});
// ====================================
// KIỂM TRA DỮ LIỆU
// ====================================
// Kiểm tra email
const emailRegex = /^[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+(?:com|vn)$/i;
// Kiểm tra số điện thoại Việt Nam
const phoneRegex = /^0[35789][0-9]{8}$/;
// Hàm xóa viền đỏ khi nhập đúng
const removeError = (input, condition) => {
    if (!input) return;
    input.addEventListener("input", () => {
        if (condition()) {
            input.parentElement.classList.remove("error-input");
        }
    });
};
// ====================================
// XỬ LÝ FORM ĐĂNG KÝ
// ====================================
if (registerForm) {
    // Lấy các ô nhập liệu theo đúng ID trong HTML
    const nameInput = document.getElementById("name-reg");
    const emailInput = document.getElementById("mail-reg");
    const phoneInput = document.getElementById("phone-reg");
    const passwordInput = document.getElementById("pass-reg");
    const confirmPasswordInput = document.getElementById("confirmPass");
    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();
        // Kiểm tra các phần tử có tồn tại không
        if (
            !nameInput ||
            !emailInput ||
            !phoneInput ||
            !passwordInput ||
            !confirmPasswordInput
        ) {
            showError("Không tìm thấy các trường nhập liệu trong HTML.");
            return;
        }
        // Lấy dữ liệu người dùng nhập
        const name = nameInput.value.trim();
        const email = emailInput.value.trim().toLowerCase();
        const phone = phoneInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        // Kiểm tra bỏ trống
        if (
            !name ||
            !email ||
            !phone ||
            !password ||
            !confirmPassword
        ) {
            showError("Vui lòng nhập đầy đủ thông tin.");
            [
                nameInput,
                emailInput,
                phoneInput,
                passwordInput,
                confirmPasswordInput
            ].forEach((input) => {
                if (!input.value.trim()) {
                    input.parentElement.classList.add("error-input");
                }
            });
            return;
        }
        // Kiểm tra email
        if (!emailRegex.test(email)) {
            showError("Email không đúng định dạng.");
            emailInput.parentElement.classList.add("error-input");
            return;
        }
        // Kiểm tra số điện thoại
        if (!phoneRegex.test(phone)) {
            showError("Số điện thoại không hợp lệ.");
            phoneInput.parentElement.classList.add("error-input");
            return;
        }
        // Kiểm tra độ dài mật khẩu
        if (password.length < 8) {
            showError("Mật khẩu phải có ít nhất 8 ký tự.");
            passwordInput.parentElement.classList.add("error-input");
            return;
        }
        // Kiểm tra xác nhận mật khẩu
        if (password !== confirmPassword) {
            showError("Mật khẩu xác nhận không chính xác.");
            confirmPasswordInput.parentElement.classList.add("error-input");
            return;
        }
        // Lấy danh sách tài khoản
        let users = [];
        try {
            users = JSON.parse(localStorage.getItem("users")) || [];
        } catch (error) {
            users = [];
        }
        // Kiểm tra email đã tồn tại
        const isExist = users.some((user) => user.email === email);
        if (isExist || email === "test@gmail.com") {
            showError("Email này đã được sử dụng.");
            emailInput.parentElement.classList.add("error-input");
            return;
        }
        // Tạo ID mới
        const id = users.length > 0
            ? Math.max(...users.map(user => Number(user.id) || 0)) + 1
            : 1;
        // Tạo tài khoản mới
        const user = {
            id: id,
            name: name,
            email: email,
            phone: phone,
            password: password
        };
        // Lưu tài khoản vào localStorage
        users.push(user);
        localStorage.setItem("users", JSON.stringify(users));
        // Thông báo thành công
        showSuccess("Đăng ký tài khoản thành công!");
        // Xóa dữ liệu form
        registerForm.reset();
        // Chuyển về đăng nhập
        loginFunction();
        // Điền sẵn email vừa đăng ký
        const loginEmail = document.getElementById("login-email");
        if (loginEmail) {
            loginEmail.value = email;
        }
    });
    // Tự động xóa lỗi khi nhập đúng
    removeError(nameInput, () => nameInput.value.trim().length > 0);
    removeError(emailInput, () => emailRegex.test(emailInput.value.trim()));
    removeError(phoneInput, () => phoneRegex.test(phoneInput.value.trim()));
    removeError(passwordInput, () => passwordInput.value.length >= 8);
    removeError(
        confirmPasswordInput,
        () =>
            confirmPasswordInput.value === passwordInput.value &&
            passwordInput.value.length >= 8
    );
}
// ====================================
// XỬ LÝ FORM ĐĂNG NHẬP
// ====================================
if (loginForm) {
    // Tài khoản thử nghiệm
    const testUser = {
        id: 999,
        name: "test",
        email: "test@gmail.com",
        password: "12345678"
    };
// Lưu tài khoản thử nghiệm
    localStorage.setItem("testUser", JSON.stringify(testUser));
    // Lấy các ô nhập liệu
    const emailLogInput = document.getElementById("login-email");
    const passwordLogInput = document.getElementById("log-pass");
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!emailLogInput || !passwordLogInput) {
            showError("Không tìm thấy ô nhập email hoặc mật khẩu.");
            return;
        }
        // Lấy dữ liệu
        const email = emailLogInput.value.trim().toLowerCase();
        const password = passwordLogInput.value.trim();
        // Kiểm tra bỏ trống
        if (!email || !password) {
            showError("Vui lòng nhập email và mật khẩu.");
            if (!email) {
                emailLogInput.parentElement.classList.add("error-input");
            }
           if (!password) {
                passwordLogInput.parentElement.classList.add("error-input");
            }
            return;
        }
        // Kiểm tra tài khoản thử nghiệm
        if (
            email === testUser.email &&
            password === testUser.password
        ) {
            localStorage.setItem(
                "currentUser",
                JSON.stringify(testUser)
            );
            localStorage.setItem(
                "toastMessage",
                "Chào mừng test đến với Bookshelf!"
            );
            window.location.href = "./index.html";
            return;
        }
        // Kiểm tra định dạng email
        if (!emailRegex.test(email)) {
            showError("Email không đúng định dạng.");
            emailLogInput.parentElement.classList.add("error-input");
            return;
        }
        // Lấy danh sách tài khoản đã đăng ký
        let users = [];
        try {
            users = JSON.parse(localStorage.getItem("users")) || [];
        } catch (error) {
            users = [];
        }
        // Tìm tài khoản phù hợp
        const user = users.find((item) => {
            return (
                item.email === email &&
                item.password === password
            );
        });
        // Nếu không tìm thấy tài khoản
        if (!user) {
            showError("Sai tài khoản hoặc mật khẩu. Vui lòng thử lại.");
            return;
        }
        // Lưu thông tin người dùng đang đăng nhập
        const currentUser = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone
        };
        localStorage.setItem(
            "currentUser",
            JSON.stringify(currentUser)
        );
        // Lưu thông báo chào mừng
        localStorage.setItem(
            "toastMessage",
            `Chào mừng ${user.name} đến với Bookshelf! 🎉`
        );
        // Xóa form
        loginForm.reset();
        // Chuyển về trang chủ
        window.location.href = "./index.html";
    });
    // Tự động xóa lỗi khi nhập lại
    removeError(
        emailLogInput,
        () => emailRegex.test(emailLogInput.value.trim())
    );
    removeError(
        passwordLogInput,
        () => passwordLogInput.value.length >= 8
    );
}