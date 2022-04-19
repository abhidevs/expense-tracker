const signUpForm = document.getElementById("signupForm");

signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(signUpForm);

  let name = formData.get("name");
  let email = formData.get("email");
  let phone = formData.get("phone");
  let password = formData.get("password");

  console.log({ name, email, phone, password });
  signUpForm.reset();
});
