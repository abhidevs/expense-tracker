"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
const signUpForm = document.getElementById("signupForm");
const loginContainer = document.getElementById("loginContainer");
const loginForm = document.getElementById("loginForm");
const resetPasswordForm = document.getElementById("resetPasswordForm");
const resetPassContainer = document.getElementById("resetPassContainer");
const expenseContainer = document.getElementById("expenseContainer");
const allExpenseContainer = document.getElementById("allExpenseContainer");
const expenseForm = document.getElementById("expenseForm");
const welcomeUser = document.getElementById("welcomeUser");
const navbar = document.getElementById("navbar");
const navLoginBtn = document.getElementById("navLoginBtn");
const buyPremium = document.getElementById("buyPremium");
const logoutBtn = document.getElementById("logoutBtn");
const navAllExpenses = document.getElementById("navAllExpenses");
const allExpenses = document.getElementById("allExpenses");
const downloadAsFile = document.getElementById("downloadAsFile");
const forgotPassword = document.getElementById("forgotPassword");
const pagination = document.getElementById("pagination");
const rowsPerPage = document.getElementById("rowsPerPage");
const backendAPI = "http://localhost:3000/api";
// Configuring the authorization header
const userInfo = JSON.parse(localStorage.getItem("ET_Userinfo"));
if (userInfo && userInfo.token)
    axios.defaults.headers.common["authorization"] = `Bearer ${userInfo.token}`;
function showLightMode() {
    navbar === null || navbar === void 0 ? void 0 : navbar.classList.add("lightmode");
    welcomeUser === null || welcomeUser === void 0 ? void 0 : welcomeUser.classList.add("lightmode");
    expenseContainer === null || expenseContainer === void 0 ? void 0 : expenseContainer.classList.add("lightmode");
}
function showDarkMode() {
    navbar === null || navbar === void 0 ? void 0 : navbar.classList.add("darkmode");
    welcomeUser === null || welcomeUser === void 0 ? void 0 : welcomeUser.classList.add("darkmode");
    expenseContainer === null || expenseContainer === void 0 ? void 0 : expenseContainer.classList.add("darkmode");
}
signUpForm === null || signUpForm === void 0 ? void 0 : signUpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(signUpForm);
    let name = formData.get("name");
    let email = formData.get("email");
    let phone = formData.get("phone");
    let password = formData.get("password");
    axios
        .post(`${backendAPI}/auth/register`, { name, email, phone, password })
        .then((res) => {
        signUpForm.reset();
        alert("Signed up successfully. Please login.");
        const url = window.location.href.split("/").slice(0, -1).join("/");
        window.location.replace(`${url}/login.html`);
    })
        .catch((err) => {
        alert(err.response.data.message);
        console.log(err.response);
    });
});
loginForm === null || loginForm === void 0 ? void 0 : loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(loginForm);
    let email = formData.get("email");
    let password = formData.get("password");
    axios
        .post(`${backendAPI}/auth/login`, { email, password })
        .then(({ data }) => {
        const { accessToken: token, isPremiumMember } = data;
        loginForm.reset();
        localStorage.setItem("ET_Userinfo", JSON.stringify({ token, isPremiumMember }));
        alert("Logged in successfully");
        const url = window.location.href.split("/").slice(0, -1).join("/");
        window.location.replace(url);
    })
        .catch((err) => {
        alert(err.response.data.message);
        console.log(err.response);
    });
});
expenseForm === null || expenseForm === void 0 ? void 0 : expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(expenseForm);
    let amount = formData.get("amount");
    let category = formData.get("category");
    let desc = formData.get("desc");
    axios
        .post(`${backendAPI}/user/expense`, { amount, category, desc })
        .then(({ data }) => {
        expenseForm.reset();
        alert("Expense saved successfully");
        console.log(data);
    })
        .catch((err) => {
        alert(err.response.data.message);
        console.log(err.response);
    });
});
buyPremium === null || buyPremium === void 0 ? void 0 : buyPremium.addEventListener("click", (e) => {
    axios
        .post(`${backendAPI}/user/payment/order`, {
        params: {
            amount: 100000,
            currency: "INR",
            receipt: "su001",
            payment_capture: "1",
        },
    })
        .then(({ data }) => {
        console.log(data);
        const { amount, id } = data === null || data === void 0 ? void 0 : data.order;
        let options = {
            key: "rzp_test_PwBQKIuzWk42Av",
            amount: amount,
            currency: "INR",
            name: "Expense Tracker",
            description: "Get Premium Features",
            image: "https://example.com/your_logo",
            order_id: id,
            handler: function (response) {
                verifyOrder({
                    orderId: response.razorpay_order_id,
                    paymentId: response.razorpay_payment_id,
                    signature: response.razorpay_signature,
                });
            },
            theme: "#227254",
        };
        const rzp1 = new Razorpay(options);
        rzp1.open();
    })
        .catch((err) => {
        alert(err.response.data.message);
        console.log(err);
    });
});
logoutBtn === null || logoutBtn === void 0 ? void 0 : logoutBtn.addEventListener("click", (e) => {
    localStorage.removeItem("ET_Userinfo");
    const url = window.location.href.split("/").slice(0, -1).join("/");
    window.location.replace(`${url}/login.html`);
});
forgotPassword === null || forgotPassword === void 0 ? void 0 : forgotPassword.addEventListener("click", () => {
    if (loginContainer)
        loginContainer.style.display = "none";
    if (resetPassContainer)
        resetPassContainer.style.display = "flex";
});
resetPasswordForm === null || resetPasswordForm === void 0 ? void 0 : resetPasswordForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(resetPasswordForm);
    let email = formData.get("email");
    axios
        .post(`${backendAPI}/auth/forgotpassword`, { email })
        .then(({ data }) => {
        resetPasswordForm.reset();
        alert(data.message);
        console.log(data);
    })
        .catch((err) => {
        alert(err.response.data.message);
        console.log(err.response);
    });
});
downloadAsFile === null || downloadAsFile === void 0 ? void 0 : downloadAsFile.addEventListener("click", (e) => {
    axios
        .get(`${backendAPI}/user/expense/downloadfile`)
        .then(({ data }) => {
        console.log(data);
        let a = document.createElement("a");
        a.href = data.fileURL;
        a.click();
    })
        .catch((err) => {
        alert(err.response.data.message);
        console.log(err.response);
    });
});
rowsPerPage === null || rowsPerPage === void 0 ? void 0 : rowsPerPage.addEventListener("change", (e) => {
    const userInfo = JSON.parse(localStorage.getItem("ET_Userinfo"));
    localStorage.setItem("ET_Userinfo", JSON.stringify(Object.assign(Object.assign({}, userInfo), { rowsPerPage: e.target.value })));
    const url = window.location.href.split("/").slice(0, -1).join("/");
    window.location.replace(`${url}/allexpenses.html`);
});
function verifyOrder(order) {
    axios
        .post(`${backendAPI}/user/payment/verify`, { order })
        .then(({ data: { message, success }, }) => {
        if (success)
            alert(message);
        console.log(message);
        localStorage.setItem("ET_Userinfo", JSON.stringify(Object.assign(Object.assign({}, userInfo), { isPremiumMember: true })));
        showDarkMode();
        if (buyPremium)
            buyPremium.style.display = "none";
    })
        .catch((err) => {
        var _a, _b;
        alert((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message);
        console.log(err);
    });
}
const locationArr = window.location.href.split("/");
const page = locationArr[locationArr.length - 1];
if (page === "index.html" || page === "") {
    window.addEventListener("DOMContentLoaded", paintHomePage);
}
else if (page.includes("allexpenses.html")) {
    loadExpenses();
    window.addEventListener("DOMContentLoaded", paintHomePage);
    rowsPerPage.value = userInfo.rowsPerPage || 10;
}
function paintHomePage() {
    if (userInfo && userInfo.token) {
        if (logoutBtn)
            logoutBtn.style.display = "block";
        if (page.includes("allexpenses.html") &&
            userInfo &&
            userInfo.isPremiumMember) {
            if (allExpenseContainer)
                allExpenseContainer.style.display = "flex";
        }
        else if (page === "index.html" || page === "") {
            if (expenseContainer)
                expenseContainer.style.display = "flex";
        }
    }
    else {
        if (navLoginBtn)
            navLoginBtn.style.display = "block";
        if (welcomeUser)
            welcomeUser.style.display = "flex";
    }
    if (userInfo && userInfo.isPremiumMember) {
        showDarkMode();
        if (navAllExpenses)
            navAllExpenses.style.display = "block";
    }
    else {
        showLightMode();
        if (buyPremium)
            buyPremium.style.display = "block";
    }
}
function loadExpenses() {
    const objUrlParams = new URLSearchParams(window.location.search);
    const currentPage = objUrlParams.get("page") || 1;
    const perPage = JSON.parse(localStorage.getItem("ET_Userinfo")).rowsPerPage || 10;
    axios
        .get(`${backendAPI}/user/expense/all?page=${currentPage}&perpage=${perPage}`)
        .then((_a) => {
        var _b = _a.data, { expenses } = _b, rest = __rest(_b, ["expenses"]);
        const pageData = rest;
        console.log({ expenses, pageData });
        populateExpenses(expenses);
        showPagination(pageData);
    })
        .catch((err) => {
        var _a, _b;
        alert((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message);
        console.log(err);
    });
}
function populateExpenses(expenses) {
    expenses.forEach((ex) => {
        const item = document.createElement("tr");
        item.className = "expense";
        const creationDate = new Date(ex.createdAt).toLocaleDateString();
        item.innerHTML = `
      <td>${creationDate}</td>
      <td>${ex.desc}</td>
      <td>${ex.category}</td>
      <td>${ex.amount}</td>
    `;
        allExpenses === null || allExpenses === void 0 ? void 0 : allExpenses.children[0].appendChild(item);
    });
}
function showPagination({ currentPage, hasNextPage, nextPage, hasPreviousPage, previousPage, lastPage, }) {
    let innerHTML = ``;
    if (currentPage !== 1 && previousPage !== 1)
        innerHTML += `<a href='?page=1'>1</a>`;
    if (hasPreviousPage)
        innerHTML += `<a href='?page=${previousPage}'>${previousPage}</a>`;
    innerHTML += `<a href='#' class='active'>${currentPage}</a>`;
    if (hasNextPage)
        innerHTML += `<a href='?page=${nextPage}'>${nextPage}</a>`;
    if (lastPage !== currentPage && lastPage !== nextPage)
        innerHTML += `<a href='?page=${lastPage}'>${lastPage}</a>`;
    if (pagination)
        pagination.innerHTML = innerHTML;
}
