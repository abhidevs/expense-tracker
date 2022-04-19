const signUpForm = document.getElementById("signupForm");

const backendAPI = "http://localhost:3000/api";

signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(signUpForm);

  let name = formData.get("name");
  let email = formData.get("email");
  let phone = formData.get("phone");
  let password = formData.get("password");

  axios
    .post(`${backendAPI}/auth/register`, { name, email, phone, password })
    .then((res) => {
      alert("Registered successfully");
      console.log(res.data);
    })
    .catch((err) => {
      alert(err.response.data.message);
      console.log(err.response);
    });

  signUpForm.reset();
});
