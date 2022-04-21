const signUpForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");
const expenseContainer = document.getElementById("expenseContainer");
const expenseForm = document.getElementById("expenseForm");
const welcomeUser = document.getElementById("welcomeUser");

const backendAPI = "http://localhost:3000/api";

// Configuring the authorization header
const accessToken = JSON.parse(localStorage.getItem("ET_Token"));
if (accessToken)
  axios.defaults.headers.common["authorization"] = `Bearer ${accessToken}`;

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
    .then((res) => {
      loginForm.reset();
      localStorage.setItem("ET_Token", JSON.stringify(res.data.accessToken));
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

const page = window.location.href.split("/").at(-1);
if (page === "index.html" || page === "") {
  window.addEventListener("DOMContentLoaded", paintHomePage);
}

function paintHomePage() {
  const accessToken = localStorage.getItem("ET_Token");
  if (accessToken) expenseContainer.style.display = "flex";
  else welcomeUser.style.display = "flex";
}
