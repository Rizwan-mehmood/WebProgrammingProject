let drop = document.querySelector("#icon>i");
const params = new URLSearchParams(window.location.search);
    const userExists = params.get('userExists');
    if (userExists === 'true') {
      document.getElementById("exists").style.display = "block";
    }
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
    let flag = false;
    if (!isValidEmail(email)) {
        document.getElementById("validEmail").style.display = "block";
        emailInput.focus();
        flag = true;
    }
    if (password.length < 8) {
        document.getElementById("validPassword").style.display = "block";
        passwordInput.focus();
        flag = true;
    }
    if (flag) {
        return;
    }
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            password: password,
        })
    }
    )
        .then(response => {
            if (!response.ok) {
                throw new Error("Couldn't get Data from server.")
            }
            return response.json();
        })
        .then(data => {
            if (data.error && data.error == "Invalid credentials") {
                document.getElementById("invalid").style.display = "block";
                return;
            }
            window.location.href = `/ProfilePage.html?data=${encodeURIComponent(JSON.stringify(data.userData))}`;
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
});
document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");

    emailInput.addEventListener("input", function () {
        document.getElementById("validEmail").style.display = "none";
        document.getElementById("invalid").style.display = "none";
        document.getElementById("exists").style.display = "none";
    });

    passwordInput.addEventListener("input", function () {
        document.getElementById("validPassword").style.display = "none";
        document.getElementById("invalid").style.display = "none";
        document.getElementById("exists").style.display = "none";
    });
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