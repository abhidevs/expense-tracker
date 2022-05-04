declare var axios: any;
declare var Razorpay: any;

const signUpForm = document.getElementById("signupForm") as HTMLFormElement;
const loginContainer = document.getElementById("loginContainer");
const loginForm = document.getElementById("loginForm") as HTMLFormElement;
const resetPasswordForm = document.getElementById(
  "resetPasswordForm"
) as HTMLFormElement;
const resetPassContainer = document.getElementById("resetPassContainer");
const expenseContainer = document.getElementById("expenseContainer");
const allExpenseContainer = document.getElementById("allExpenseContainer");
const expenseForm = document.getElementById("expenseForm") as HTMLFormElement;
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
const rowsPerPage = document.getElementById("rowsPerPage") as HTMLInputElement;

const backendAPI = "http://localhost:3000/api";

interface PageData {
  currentPage: number;
  hasNextPage: boolean;
  nextPage: number;
  hasPreviousPage: boolean;
  previousPage: number;
  lastPage: number;
}

interface Expense {
  id: number;
  amount: number;
  category: string;
  desc: string;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  orderId: string;
  paymentId: string;
  signature: string;
}

// Configuring the authorization header
const userInfo = JSON.parse(localStorage.getItem("ET_Userinfo") as string);
if (userInfo && userInfo.token)
  axios.defaults.headers.common["authorization"] = `Bearer ${userInfo.token}`;

function showLightMode() {
  navbar?.classList.add("lightmode");
  welcomeUser?.classList.add("lightmode");
  expenseContainer?.classList.add("lightmode");
}

function showDarkMode() {
  navbar?.classList.add("darkmode");
  welcomeUser?.classList.add("darkmode");
  expenseContainer?.classList.add("darkmode");
}

signUpForm?.addEventListener("submit", (e: Event) => {
  e.preventDefault();
  const formData = new FormData(signUpForm);

  let name = formData.get("name");
  let email = formData.get("email");
  let phone = formData.get("phone");
  let password = formData.get("password");

  axios
    .post(`${backendAPI}/auth/register`, { name, email, phone, password })
    .then((res: any) => {
      signUpForm.reset();
      alert("Signed up successfully. Please login.");

      const url = window.location.href.split("/").slice(0, -1).join("/");
      window.location.replace(`${url}/login.html`);
    })
    .catch((err: any) => {
      alert(err.response.data.message);
      console.log(err.response);
    });
});

loginForm?.addEventListener("submit", (e: Event) => {
  e.preventDefault();
  const formData = new FormData(loginForm);

  let email = formData.get("email");
  let password = formData.get("password");

  axios
    .post(`${backendAPI}/auth/login`, { email, password })
    .then(({ data }: { data: any }) => {
      const { accessToken: token, isPremiumMember } = data;
      loginForm.reset();
      localStorage.setItem(
        "ET_Userinfo",
        JSON.stringify({ token, isPremiumMember })
      );
      alert("Logged in successfully");

      const url = window.location.href.split("/").slice(0, -1).join("/");
      window.location.replace(url);
    })
    .catch((err: any) => {
      alert(err.response.data.message);
      console.log(err.response);
    });
});

expenseForm?.addEventListener("submit", (e: Event) => {
  e.preventDefault();
  const formData = new FormData(expenseForm);

  let amount = formData.get("amount");
  let category = formData.get("category");
  let desc = formData.get("desc");

  axios
    .post(`${backendAPI}/user/expense`, { amount, category, desc })
    .then(({ data }: { data: any }) => {
      expenseForm.reset();
      alert("Expense saved successfully");
      console.log(data);
    })
    .catch((err: any) => {
      alert(err.response.data.message);
      console.log(err.response);
    });
});

buyPremium?.addEventListener("click", (e: Event) => {
  axios
    .post(`${backendAPI}/user/payment/order`, {
      params: {
        amount: 100000,
        currency: "INR",
        receipt: "su001",
        payment_capture: "1",
      },
    })
    .then(({ data }: { data: any }) => {
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
        handler: function (response: any) {
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
    .catch((err: any) => {
      alert(err.response.data.message);
      console.log(err);
    });
});

logoutBtn?.addEventListener("click", (e: Event) => {
  localStorage.removeItem("ET_Userinfo");
  const url = window.location.href.split("/").slice(0, -1).join("/");
  window.location.replace(`${url}/login.html`);
});

forgotPassword?.addEventListener("click", () => {
  if (loginContainer) loginContainer.style.display = "none";
  if (resetPassContainer) resetPassContainer.style.display = "flex";
});

resetPasswordForm?.addEventListener("submit", (e: Event) => {
  e.preventDefault();
  const formData = new FormData(resetPasswordForm);
  let email = formData.get("email");

  axios
    .post(`${backendAPI}/auth/forgotpassword`, { email })
    .then(({ data }: { data: any }) => {
      resetPasswordForm.reset();
      alert(data.message);
      console.log(data);
    })
    .catch((err: any) => {
      alert(err.response.data.message);
      console.log(err.response);
    });
});

downloadAsFile?.addEventListener("click", (e: Event) => {
  axios
    .get(`${backendAPI}/user/expense/downloadfile`)
    .then(({ data }: { data: any }) => {
      console.log(data);

      let a = document.createElement("a");
      a.href = data.fileURL;
      a.click();
    })
    .catch((err: any) => {
      alert(err.response.data.message);
      console.log(err.response);
    });
});

rowsPerPage?.addEventListener("change", (e: Event) => {
  const userInfo = JSON.parse(localStorage.getItem("ET_Userinfo") as string);
  localStorage.setItem(
    "ET_Userinfo",
    JSON.stringify({
      ...userInfo,
      rowsPerPage: (e.target as HTMLInputElement).value,
    })
  );

  const url = window.location.href.split("/").slice(0, -1).join("/");
  window.location.replace(`${url}/allexpenses.html`);
});

function verifyOrder(order: Order) {
  axios
    .post(`${backendAPI}/user/payment/verify`, { order })
    .then(
      ({
        data: { message, success },
      }: {
        data: { message: string; success: boolean };
      }) => {
        if (success) alert(message);
        console.log(message);
        localStorage.setItem(
          "ET_Userinfo",
          JSON.stringify({ ...userInfo, isPremiumMember: true })
        );
        showDarkMode();
        if (buyPremium) buyPremium.style.display = "none";
      }
    )
    .catch((err: any) => {
      alert(err.response?.data?.message);
      console.log(err);
    });
}

const locationArr = window.location.href.split("/");
const page = locationArr[locationArr.length - 1];
if (page === "index.html" || page === "") {
  window.addEventListener("DOMContentLoaded", paintHomePage);
} else if (page.includes("allexpenses.html")) {
  loadExpenses();
  window.addEventListener("DOMContentLoaded", paintHomePage);
  rowsPerPage.value = userInfo.rowsPerPage || 10;
}

function paintHomePage() {
  if (userInfo && userInfo.token) {
    if (logoutBtn) logoutBtn.style.display = "block";

    if (
      page.includes("allexpenses.html") &&
      userInfo &&
      userInfo.isPremiumMember
    ) {
      if (allExpenseContainer) allExpenseContainer.style.display = "flex";
    } else if (page === "index.html" || page === "") {
      if (expenseContainer) expenseContainer.style.display = "flex";
    }
  } else {
    if (navLoginBtn) navLoginBtn.style.display = "block";
    if (welcomeUser) welcomeUser.style.display = "flex";
  }

  if (userInfo && userInfo.isPremiumMember) {
    showDarkMode();
    if (navAllExpenses) navAllExpenses.style.display = "block";
  } else {
    showLightMode();
    if (buyPremium) buyPremium.style.display = "block";
  }
}

function loadExpenses() {
  const objUrlParams = new URLSearchParams(window.location.search);
  const currentPage = objUrlParams.get("page") || 1;
  const perPage =
    JSON.parse(localStorage.getItem("ET_Userinfo") as string).rowsPerPage || 10;

  axios
    .get(
      `${backendAPI}/user/expense/all?page=${currentPage}&perpage=${perPage}`
    )
    .then(
      ({
        data: { expenses, ...rest },
      }: {
        data: { expenses: Array<Expense> };
      }) => {
        const pageData = rest as PageData;
        console.log({ expenses, pageData });
        populateExpenses(expenses);
        showPagination(pageData);
      }
    )
    .catch((err: any) => {
      alert(err.response?.data?.message);
      console.log(err);
    });
}

function populateExpenses(expenses: Array<Expense>) {
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

    allExpenses?.children[0].appendChild(item);
  });
}

function showPagination({
  currentPage,
  hasNextPage,
  nextPage,
  hasPreviousPage,
  previousPage,
  lastPage,
}: PageData) {
  let innerHTML = ``;

  if (currentPage !== 1 && previousPage !== 1)
    innerHTML += `<a href='?page=1'>1</a>`;
  if (hasPreviousPage)
    innerHTML += `<a href='?page=${previousPage}'>${previousPage}</a>`;
  innerHTML += `<a href='#' class='active'>${currentPage}</a>`;
  if (hasNextPage) innerHTML += `<a href='?page=${nextPage}'>${nextPage}</a>`;
  if (lastPage !== currentPage && lastPage !== nextPage)
    innerHTML += `<a href='?page=${lastPage}'>${lastPage}</a>`;

  if (pagination) pagination.innerHTML = innerHTML;
}
