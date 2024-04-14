let chk1 = document.querySelector("#chk1");
chk1.addEventListener("click", function () {
    chk1.style.display = "none";
    document.querySelector("#chk2").style.display = "block";
    let password = document.querySelector("#password");
    password.type = "text";
    password = document.querySelector("#confirm");
    password.type = "text";

});
let chk2 = document.querySelector("#chk2");
chk2.addEventListener("click", function () {
    chk2.style.display = "none";
    document.querySelector("#chk1").style.display = "block";
    let password = document.querySelector("#password");
    password.type = "password";
    password = document.querySelector("#confirm");
    password.type = "password";
});
function validateForm() {
    const passwordInput = document.getElementById("password");
    const confirmInput = document.getElementById("confirm");
    let password = passwordInput.value.trim();
    let confirm = confirmInput.value.trim();
    if (!password) {
        alert("Please enter your password.");
        passwordInput.focus();
        return false;
    }
    if (password.length < 8) {
        alert("Password must be at least 8 characters long.");
        passwordInput.focus();
        return false;
    }
    if (!confirm) {
        alert("Please confirm password.");
        confirmInput.focus();
        return false;
    }
    if (password !== confirm) {
        alert("Passwords do not match.");
        confirmInput.focus();
        return false;
    }
    alert("Password Reset.");
}
function Landing() {
    window.location.href = "/views/LandingPage.html";
}