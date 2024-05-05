document.getElementById("verificationForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const codeInput = document.getElementById("code");
    const code = codeInput.value.trim();

    if (!code) {
        alert("Please enter your code.");
        codeInput.focus();
        return;
    }
    if (code.length !== 6) {
        alert("Code must have 6 characters.");
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
            if (data.error === "Code expired") {
                alert("Code has expired. Please try again.");
                window.location.href = "/LoginPage.html";
            } else {
                console.log("Verification successful.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An error occurred, please try again later.");
        });

});
