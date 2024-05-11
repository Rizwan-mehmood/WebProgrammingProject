document.getElementById("verificationForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const codeInput = document.getElementById("code");
    const code = codeInput.value.trim();
    if (code.length !== 6 || isNaN(code)) {
        document.querySelector('#check>p').style.display = 'block';
        codeInput.focus();
        return;
    }

    fetch("/signupVerify", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ code })
    })
        .then(response => response.json())
        .then(data => {
            if (data.error && data.error === "Code expired.") {
                document.querySelector("#check>p:nth-child(2)").style.display = 'block'
            } else if (data.success && data.success == "Success") {
                document.querySelector("#check>p:nth-child(3)").style.display = 'block'
            }
            else if (data.error && data.error == "Incorrect code.") {
                document.querySelector("#check>p:nth-child(4)").style.display = 'block'
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred, please try again later.");
        });

});
document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('code');
    const validCode = document.getElementById('validCode');
    const invalidCode = document.getElementById('incorrect');

    input.addEventListener('input', function () {
        validCode.style.display = invalidCode.style.display = 'none';
    });
})