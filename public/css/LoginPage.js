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
function SignUp() {
    window.location.href = "/SignUpPage.html";
}
function flipContainer() {
    var container = document.querySelector('.container');
    container.classList.toggle('flipped');
    setTimeout(SignUp, 1000);
}
document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    if (!email) {
        alert("Please enter your email.");
        emailInput.focus();
        return false;
    }

    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        emailInput.focus();
        return false;
    }

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
    this.submit();
});
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}
let chk1 = document.querySelector("#chk1");
chk1.addEventListener("click", function () {
    chk1.style.display = "none";
    document.querySelector("#chk2").style.display = "block";
    const password = document.querySelector("#password");
    password.type = "text";
});
let chk2 = document.querySelector("#chk2");
chk2.addEventListener("click", function () {
    chk2.style.display = "none";
    document.querySelector("#chk1").style.display = "block";
    const password = document.querySelector("#password");
    password.type = "password";
});
function Landing() {
    window.location.href = "/LandingPage.html";
}