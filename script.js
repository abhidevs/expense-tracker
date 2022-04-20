const signUpForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

const backendAPI = "http://localhost:3000/api";

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
      alert("Signed up successfully");
      console.log(res.data);
    })
    .catch((err) => {
      alert(err.response.data.message);
      console.log(err.response);
    });

  signUpForm.reset();
});

loginForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(loginForm);

  let email = formData.get("email");
  let password = formData.get("password");

  axios
    .post(`${backendAPI}/auth/login`, { email, password })
    .then((res) => {
      alert("Logged in successfully");
      console.log(res.data);
    })
    .catch((err) => {
      // alert(err.response.data.message);
      alert("Something went wrong");
      console.log(err.response);
    });

  loginForm.reset();
});
