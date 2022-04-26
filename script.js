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
const forgotPassword = document.getElementById("forgotPassword");

const backendAPI = "http://localhost:3000/api";

// Configuring the authorization header
const userInfo = JSON.parse(localStorage.getItem("ET_Userinfo"));
if (userInfo && userInfo.token)
  axios.defaults.headers.common["authorization"] = `Bearer ${userInfo.token}`;

function showLightMode() {
  navbar.classList.add("lightmode");
  welcomeUser?.classList.add("lightmode");
  expenseContainer.classList.add("lightmode");
}

function showDarkMode() {
  navbar.classList.add("darkmode");
  welcomeUser?.classList.add("darkmode");
  expenseContainer.classList.add("darkmode");
}

signUpForm?.addEventListener("submit", (e) => {
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

loginForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(loginForm);

  let email = formData.get("email");
  let password = formData.get("password");

  axios
    .post(`${backendAPI}/auth/login`, { email, password })
    .then(({ data: { accessToken: token, isPremiumMember } }) => {
      loginForm.reset();
      localStorage.setItem(
        "ET_Userinfo",
        JSON.stringify({ token, isPremiumMember })
      );
      alert("Logged in successfully");

      const url = window.location.href.split("/").slice(0, -1).join("/");
      window.location.replace(url);
    })
    .catch((err) => {
      alert(err.response.data.message);
      console.log(err.response);
    });
});

expenseForm?.addEventListener("submit", (e) => {
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

buyPremium?.addEventListener("click", (e) => {
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
      const { amount, id } = data?.order;

      let options = {
        key: "rzp_test_PwBQKIuzWk42Av", // Enter the Key ID generated from the Dashboard
        amount: amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Expense Tracker",
        description: "Get Premium Features",
        image: "https://example.com/your_logo",
        order_id: id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
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

logoutBtn?.addEventListener("click", (e) => {
  localStorage.removeItem("ET_Userinfo");
  const url = window.location.href.split("/").slice(0, -1).join("/");
  window.location.replace(`${url}/login.html`);
});

forgotPassword?.addEventListener("click", () => {
  loginContainer.style.display = "none";
  resetPassContainer.style.display = "flex";
});

resetPasswordForm?.addEventListener("submit", (e) => {
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

function verifyOrder(order) {
  axios
    .post(`${backendAPI}/user/payment/verify`, { order })
    .then(({ data: { message, success } }) => {
      if (success) alert(message);
      console.log(message);
      localStorage.setItem(
        "ET_Userinfo",
        JSON.stringify({ ...userInfo, isPremiumMember: true })
      );
      showDarkMode();
      buyPremium.style.display = "none";
    })
    .catch((err) => {
      alert(err.response?.data?.message);
      console.log(err);
    });
}

const page = window.location.href.split("/").at(-1);
if (page === "index.html" || page === "" || page === "allexpenses.html") {
  window.addEventListener("DOMContentLoaded", paintHomePage);
}

function paintHomePage() {
  if (userInfo && userInfo.token) {
    logoutBtn.style.display = "block";
    if (page === "allexpenses.html" && userInfo && userInfo.isPremiumMember)
      allExpenseContainer.style.display = "flex";
    else if (page === "index.html" || page === "")
      expenseContainer.style.display = "flex";
  } else {
    navLoginBtn.style.display = "block";
    welcomeUser.style.display = "flex";
  }

  if (userInfo && userInfo.isPremiumMember) {
    showDarkMode();
    navAllExpenses.style.display = "block";
  } else {
    showLightMode();
    buyPremium.style.display = "block";
  }
}
