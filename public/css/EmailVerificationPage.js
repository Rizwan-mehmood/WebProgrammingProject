function validateForm() {
    const codeInput = document.getElementById("code");
    let password = codeInput.value.trim();
    if (!password) {
        alert("Please enter your code.");
        codeInput.focus();
        return false;
    }
    if (password.length != 6) {
        alert("Code must have 6 characters.");
        codeInput.focus();
        return false;
    }
}