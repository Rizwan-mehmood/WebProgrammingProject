const p = document.querySelectorAll('#verificationForm p');
document.getElementById("verificationForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const codeInput = document.getElementById("code");
    const code = codeInput.value.trim();
    if (code.length !== 6 || (isNaN(code))) {
        p[1].style.display = "block";
        codeInput.focus();
        return;
    }

    fetch("/verifyCode", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ code: code }),
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Invalid response from server');
            }
        })
        .then(data => {
            if (data.error && data.error == "Invalid Code.") {
                p[2].style.display = 'block';
            }
            else {
                window.location.href = data.redirectUrl;
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });


});
document.querySelector('#input input').addEventListener('input', function () {
    p[1].style.display = p[2].style.display = 'none';
});