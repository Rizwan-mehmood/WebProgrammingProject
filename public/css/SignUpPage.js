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
    let flag = false;
    if (!isValidName(firstName)) {
        document.getElementById('validFName').style.display = 'block';
        firstNameInput.focus();
        flag = true;
    }
    if (!isValidName(lastName)) {
        document.getElementById('validLName').style.display = 'block';
        lastNameInput.focus();
        flag = true;
    }
    if (!isValidEmail(email)) {
        document.getElementById('validEmail').style.display = 'block';
        emailInput.focus();
        flag = true;
    }
    if (!isValidPhone(phone)) {
        document.getElementById('validPhone').style.display = 'block';
        phoneInput.focus();
        flag = true;
    }
    if (password.length < 8) {
        document.getElementById('validPassword').style.display = 'block';
        passwordInput.focus();
        flag = true;
    }
    if (password !== confirmPassword) {
        document.getElementById('validConfPassword').style.display = 'block';
        confirm.focus();
        flag = true;
    }
    if (flag) {
        return;
    }
    fetch('/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            password: password,
        })
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Couldn't get Data from server.")
            }
            return response.json();
        })
        .then(data => {
            if (data.error && data.error == "User exists.") {
                document.getElementById("invalid").style.display = "block";
                return;
            }
            if (data.success && data.success == "User created successfully") {
                window.location.href = "/EmailVerificationPage.html"
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred, please try again later.");
        });
});
document.addEventListener("DOMContentLoaded", function () {
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm");

    firstName.addEventListener("input", function () {
        document.getElementById("validFName").style.display = "none";
        document.getElementById("invalid").style.display = "none";
    });

    lastName.addEventListener("input", function () {
        document.getElementById("validLName").style.display = "none";
        document.getElementById("invalid").style.display = "none";
    });

    emailInput.addEventListener("input", function () {
        document.getElementById("validEmail").style.display = "none";
        document.getElementById("invalid").style.display = "none";
    });

    phoneInput.addEventListener("input", function () {
        document.getElementById("validPhone").style.display = "none";
        document.getElementById("invalid").style.display = "none";
    });

    passwordInput.addEventListener("input", function () {
        document.getElementById("validPassword").style.display = "none";
        document.getElementById("invalid").style.display = "none";
    });

    confirmPasswordInput.addEventListener("input", function () {
        document.getElementById("validConfPassword").style.display = "none";
        document.getElementById("invalid").style.display = "none";
    });
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
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