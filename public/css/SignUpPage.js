let drop = document.querySelector("#icon>i");
drop.addEventListener("click", function () {
    let overlay = document.getElementById("overlay")
    overlay.style.display = overlay.style.display == "block" ? "none" : "block";
    let list = document.getElementById("menuList");
    list.style.display = list.style.display == "block" ? "none" : "block flex";
    list.style.top = drop.offsetTop + 20 + "px";
    list.style.left = drop.offsetLeft - 70 + "px";
});
let over = document.getElementById("overlay");
over.addEventListener("click", function (e) {
    document.getElementById("overlay").style.display = "none";
    document.getElementById("menuList").style.display = "none";
});
function Login() {
    window.location.href = "/LoginPage.html";
}
function flipContainer() {
    var container = document.querySelector('.container');
    container.classList.toggle('flipped');
    setTimeout(Login, 1000);
}
document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();
    const firstNameInput = document.getElementById("firstName");
    const lastNameInput = document.getElementById("lastName");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const passwordInput = document.getElementById("password");
    const confirm = document.getElementById("confirm");
    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const password = passwordInput.value.trim();
    const confirmPassword = confirm.value.trim();
    if (!isValidName(firstName)) {
        alert("Please enter a valid first name.");
        firstNameInput.focus();
        return false;
    }
    if (!isValidName(lastName)) {
        alert("Please enter a valid last name.");
        firstNameInput.focus();
        return false;
    }
    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        emailInput.focus();
        return false;
    }
    if (!isValidPhone(phone)) {
        alert("Please enter a valid phone number.");
        phoneInput.focus();
        return false;
    }
    if (password.length < 8) {
        alert("Password must be at least 8 characters long.");
        passwordInput.focus();
        return false;
    }
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        passwordInput.focus();
        return false;
    }
    this.submit();
});
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@gmail\.com$/i;
    return emailRegex.test(email);
}
function isValidName(name) {
    const nameRegex = /^[a-zA-Z]+$/;
    return nameRegex.test(name);
}
function isValidPhone(phone) {
    const phoneRegex = /^03\d{9}$/;
    return phoneRegex.test(phone);
}
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
function Landing() {
    window.location.href = "/LandingPage.html";
}