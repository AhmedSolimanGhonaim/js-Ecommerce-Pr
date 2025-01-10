const form = document.forms[0];
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const userEmail = document.getElementById("email").value;
    const userPassword = document.getElementById("password").value;
    if (emailRegex.test(userEmail) && userPassword.length >= 8) {
        console.log("Email:", userEmail);
        console.log("Password:", userPassword);
    } else {

        // const error = document.createElement("div");

        // error.textContent = "Invalid email or password";


     }


});


