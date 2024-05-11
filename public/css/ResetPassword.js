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
document.getElementById("form").addEventListener("submit", function (event) {
    event.preventDefault();
    const queryParams = new URLSearchParams(window.location.search);
    const email = queryParams.get('email');
    const passwordInput = document.getElementById("password");
    const confirmInput = document.getElementById("confirm");
    const password = passwordInput.value.trim();
    let confirm = confirmInput.value.trim();
    if (password.length < 8) {
        document.getElementById("validPassword").style.display = "block";
        passwordInput.focus();
        return false;
    }
    if (password !== confirm) {
        document.getElementById("match").style.display = "block";
        confirmInput.focus();
        return false;
    }
    fetch("/updatePassword", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to update password");
            }
            return response.json();
        })
        .then((data) => {
            document.getElementById("success").style.display = "block";
        }).catch((error) => {
            console.error("Error updating password:", error);
            alert("An error occurred, please try again later.");
        });

});
const password = document.getElementById("password");
const confirm = document.getElementById("confirm");
const p = document.querySelectorAll('#form p');
password.addEventListener("input", function () {
    p[2].style.display = "none";
});

confirm.addEventListener("input", function () {
    p[4].style.display = "none";
});

function Landing() {
    window.location.href = "/LandingPage.html";
}