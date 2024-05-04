let drop = document.querySelector("#icon>i");
drop.addEventListener("click", function () {
  let overlay = document.getElementById("overlay");
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
