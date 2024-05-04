function Landing() {
  window.location.href = "/LandingPage.html";
}
const queryString = window.location.search;
const urlParams1 = new URLSearchParams(queryString);
let email = urlParams1.get("email");
let firstName = null;
let lastName = null;
let phone = null;
let bio = null;
firstName = urlParams1.get("firstName");
lastName = urlParams1.get("lastName");
phone = urlParams1.get("phone");
bio = urlParams1.get("bio");

document.addEventListener("DOMContentLoaded", function () {
  console.log("Loading Page");
  fetch("/getData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to get Data");
      }
      return response.json();
    })
    .then((data) => {
      firstName = data.fname;
      lastName = data.lname;
      phone = data.phone;
      bio = data.bio;
      const p = document.querySelectorAll("#two > div > p");
      p[0].innerText = firstName;
      p[1].innerText = lastName;
      p[2].innerText = email;
      p[3].innerText = `${phone}`;
      let textarea = document.querySelector("#two > div > textarea");
      textarea.value = bio;
      textarea.readOnly = !textarea.readOnly;
      getImage();
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});
let name = firstName[0] + lastName[0];
let acc = document.querySelector("#acc");
acc.textContent = name;
acc.addEventListener("click", function () {
  let container = document.getElementById("container");
  container.style.display =
    container.style.display == "block" ? "none" : "block";
  container.style.top = acc.offsetTop + 40 + "px";
  container.style.left = acc.offsetLeft - 90 + "px";
});
let show = document.querySelectorAll("#passwordUpdate > div > i");

// Toggle the display of the icons
show[0].addEventListener("click", function () {
  show[0].style.display = "none";
  show[1].style.display = "block";
  let inputs = document.querySelectorAll("#passwordUpdate>input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].type = "text";
  }
});

show[1].addEventListener("click", function () {
  show[0].style.display = "block";
  show[1].style.display = "none";
  let inputs = document.querySelectorAll("#passwordUpdate>input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].type = "password";
  }
});
let profilePicture = document.getElementById("profilePic");
profilePicture.addEventListener("click", function () {
  let container = document.getElementById("container");
  container.style.display =
    container.style.display == "block" ? "none" : "block";
  container.style.top = profilePicture.offsetTop + 40 + "px";
  container.style.left = profilePicture.offsetLeft - 90 + "px";
});
let edit = document.getElementById("edit");
edit.addEventListener("click", function () {
  let paragraphs = document.querySelectorAll("#two > div > p");
  for (let i = 0; i < paragraphs.length; i++) {
    if (i != 2) {
      paragraphs[i].contentEditable = !paragraphs[i].isContentEditable;
    }
  }
  let textarea = document.querySelector("#two > div >textarea");
  textarea.readOnly = !textarea.readOnly;
  edit.style.display = "none";
  document.getElementById("save").style.display = "block";
  document.getElementById("cancel").style.display = "block";
});
let overlay = document.querySelector("#overlay");
overlay.addEventListener("click", function () {
  document.getElementById("container").style.display = "none";
  document.getElementById("overlay").style.display = "none";
  document.getElementById("passwordUpdate").style.display = "none";
});
let save = document.getElementById("save");
save.addEventListener("click", function () {
  let paragraphs = document.querySelectorAll("#two > div > p");
  if (
    paragraphs[0].innerHTML.length == 0 ||
    paragraphs[1].innerHTML.length == 0 ||
    paragraphs[3].innerHTML.length == 0
  ) {
    alert("Please fill all the fields");
    return;
  }
  if (!/^[a-zA-Z]+$/.test(paragraphs[0].innerHTML)) {
    alert("First Name cannot be a number");
    return;
  }
  function isValidPhone(phone) {
    const phoneRegex = /^03\d{9}$/;
    return phoneRegex.test(phone);
  }
  if (!/^[a-zA-Z]+$/.test(paragraphs[1].innerHTML)) {
    alert("Last Name cannot be a number");
    return;
  }
  if (!isValidPhone(paragraphs[3].innerHTML)) {
    alert("Invalid Phone Number");
    return;
  }
  edit.style.display = "block";
  document.getElementById("save").style.display = "none";
  document.getElementById("cancel").style.display = "none";
  for (let i = 0; i < paragraphs.length; i++) {
    if (i != 2) {
      paragraphs[i].contentEditable = !paragraphs[i].isContentEditable;
    }
  }
  let textarea = document.querySelector("#two > div >textarea");
  fetch("/updateInfo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fname: paragraphs[0].innerHTML,
      lname: paragraphs[1].innerHTML,
      email: paragraphs[2].innerHTML,
      phone: paragraphs[3].innerHTML,
      bio: textarea.value,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Update failed");
      }
      return response.text();
    })
    .then((data) => {
      console.log("Information Upadated successfully:", data);
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error updating information:", error);
    });
});
let cancel = document.getElementById("cancel");
cancel.addEventListener("click", function () {
  window.location.reload();
});
function logout() {
  window.location.replace("/LoginPage.html");
}
let file = null;
function replaceImage() {
  if (document.getElementById("save").style.display == "block") {
    chooseFile();
    document.getElementById("save").addEventListener("click", function () {
      uploadImage(file);
    });
  }
}
let clicked = document.querySelector("#chngpass>a");
clicked.addEventListener("click", function () {
  document.getElementById("container").style.display = "none";
  document.getElementById("overlay").style.display = "block";
  document.getElementById("passwordUpdate").style.display = "block flex";
});
function chooseFile() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.style.display = "none";
  input.addEventListener("change", function () {
    file = input.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const image = document.getElementById("uploadedImage");
      image.src = e.target.result;
      image.style.display = "block";
    };
    reader.readAsDataURL(file);
    document.querySelector("#pic>button").style.display = "none";
    uploadImage(file);
  });
  document.body.appendChild(input);
  input.click();
}

function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("email", email);
  const imageFileName = `user_${phone.slice(-5)}`;
  formData.append("imageFileName", imageFileName);
  fetch("/uploadImage", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Upload failed");
      }
      return response.text();
    })
    .then((data) => {
      console.log("Image uploaded successfully:", data);
    })
    .catch((error) => {
      console.error("Error uploading image:", error);
    });
}
function getImage() {
  fetch("/getImage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: email }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to get image");
        document.getElementById("choosebutton").style.display = "block";
      }
      return response.json();
    })
    .then((data) => {
      if (data.path) {
        const image = document.getElementById("uploadedImage");
        const imagePath = data.path.replace(/\\/g, "/").replace("public", "");
        image.src = imagePath;
        const profilePic = document.getElementById("profilePic");
        profilePic.src = imagePath;
        profilePic.style.display = "block";
        document.getElementById("acc").style.display = "none";
        console.log(data.path);
        image.style.display = "block";
      } else {
        console.log("No image found for the user");
        // Call uploadImage function if image not found
        document.getElementById("choosebutton").style.display = "block";
      }
    })
    .catch((error) => {
      console.error("Error getting image:", error);
    });
}

function resetPassword() {
  let oldPass = document.getElementById("oldPass");
  let newPass = document.getElementById("newPass");
  let confPass = document.getElementById("confPass");
  if (
    oldPass.value.length == 0 ||
    newPass.value.length == 0 ||
    confPass.value.length == 0
  ) {
    alert("Please fill all the fields");
    return;
  }
  if (newPass.value.length < 8) {
    alert("Password must be at least 8 characters long");
    return;
  }
  if (newPass.value != confPass.value) {
    alert("Passwords do not match");
    return;
  }
  fetch("/resetPassword", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      oldPass: oldPass.value,
      newPass: newPass.value,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to reset password");
      }
      return response.text();
    })
    .then((data) => {
      console.log("Password reset successfully:", data);
      alert("Password reset successfully!");
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error resetting password:", error);
      alert("Error resetting password");
      window.location.reload();
    });
}
