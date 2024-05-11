const params = new URLSearchParams(window.location.search);
const data = params.get('data');
const userData = JSON.parse(decodeURIComponent(data));
const email = userData.email;
const pic = document.querySelector('#pic>div');
const change = document.getElementById('change');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const country = document.getElementById('country');
const city = document.getElementById('city');
const facebook = document.getElementById('facebook');
const linkedin = document.getElementById('linkedin');
const github = document.getElementById('github');

let graphData = [];
let completed = 0;
let rating = 0;
fetch('/getUserData', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: email
  })
})
  .then(response => {
    if (!response.ok) {
      throw new Error("Couldn't get Data from server.")
    }
    return response.json();
  })
  .then(data => {
    let name;
    let profile;
    if (data.email == email) {
      firstName.value = data.fname;
      lastName.value = data.lname;
      country.value = data.country;
      city.value = data.city;
      facebook.value = data.facebook;
      linkedin.value = data.linkedin;
      github.value = data.github;
      name = data.fname + ' ' + data.lname;
      profile = data.fname[0] + data.lname[0];
      document.querySelector('#o2 h1').innerHTML = userData.inProgress;
      var socialDiv = document.getElementById("social");
      var socialLinks = socialDiv.getElementsByTagName("a");
      socialLinks[0].setAttribute("href", data.facebook);
      socialLinks[1].setAttribute("href", data.linkedin);
      socialLinks[2].setAttribute("href", data.github);
      if (data.facebook) {
        socialLinks[0].style.display = 'block';
      }
      if (data.linkedin) {
        socialLinks[1].style.display = 'block';
      }
      if (data.github) {
        socialLinks[2].style.display = 'block';
      }
      if (data.country && data.city) {
        var paragraph = document.querySelector("#nameLoc p");
        paragraph.textContent = data.city + ", " + data.country;
        paragraph.style.display = "block";
      }
      else if (data.country || data.city) {
        var paragraph = document.querySelector("#nameLoc p");
        paragraph.textContent = data.country + data.city;
        paragraph.style.display = "block";
      }

    }
    else {
      firstName.value = userData.firstName;
      lastName.value = userData.lastName;
      name = userData.firstName + ' ' + userData.lastName;
      document.querySelector('#o2 h1').innerHTML = userData.inProgress;
      profile = userData.firstName[0] + userData.lastName[0];
      saveInUserData();
    }
    document.querySelector('#nameLoc>h1').innerHTML = name;
    document.title = "ShopEx - " + name;
    document.querySelector('#h1>div>span').innerHTML = name;
    document.querySelector('#h1_h1').innerHTML = profile;
    document.querySelector('#pic_h1').innerHTML = profile;
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });
document.addEventListener('DOMContentLoaded', function () {
  getImage();
});
for (let i = 0; i < userData.date.length; i++) {
  graphData.push({
    date: userData.date[i],
    number: userData.completed[i],
  });
  completed += userData.completed[i];
  rating += userData.rating[i];
}
rating = rating / userData.date.length;
const ratings = document.getElementById('rating');
for (let i = 0; i < rating; i++) {
  let i = document.createElement('i');
  i.classList.add('fa');
  i.classList.add('fa-star');
  ratings.appendChild(i);
}
document.querySelector('#o1 h1').innerHTML = completed;
makeMap();
pic.addEventListener('mouseover', function () {
  change.style.display = 'block flex';
});

pic.addEventListener('mouseout', function () {
  change.style.display = 'none';
});

function makeMap() {
  const dates = graphData.map(data => data.date);
  const numbers = graphData.map(data => data.number);
  const canvas = document.createElement('canvas');
  canvas.id = 'myChart';
  document.getElementById('sec3').appendChild(canvas);

  const ctx = document.getElementById('myChart').getContext('2d');
  const myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [{
        label: 'Number of Orders Completed in past 1 month',
        data: numbers,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function chooseFile() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.style.display = "none";
  input.addEventListener("change", function () {
    file = input.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      document.getElementById('h1_h1').style.display = document.getElementById('pic_h1').style.display = "none";
      document.getElementById('h1_img').style.display = document.getElementById('pic_img').style.display = "block";
      document.getElementById('h1_img').src = document.getElementById('pic_img').src = e.target.result;
    }
    reader.readAsDataURL(file);
    uploadImage(file);
  });
  document.body.appendChild(input);
  input.click();
}

function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("email", email);
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
      }
      return response.json();
    })
    .then((data) => {
      if (data.path) {
        const imagePath = data.path.replace(/\\/g, "/").replace("public", "");
        document.getElementById('h1_h1').style.display = document.getElementById('pic_h1').style.display = "none";
        document.getElementById('h1_img').style.display = document.getElementById('pic_img').style.display = "block";
        document.getElementById('h1_img').src = document.getElementById('pic_img').src = imagePath;
      }
    })
    .catch((error) => {
      console.error("Error getting image:", error);
    });
}

function chooseFile1() {
  let check = document.getElementById("pic_h1");
  if (check.style.display != "none") {
    chooseFile();
  }
}
function EditProfile() {
  document.querySelector('#m1').style.display = "none";
  document.querySelector('#m2').style.display = "block";
}
function dashboard() {
  document.querySelector('#m1').style.display = "block";
  document.querySelector('#m2').style.display = "none";
}
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById("m1").style.display == "block") {
    makeMap();
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const divs = document.querySelectorAll("section#sec1 div");
  divs.forEach(function (div) {
    div.addEventListener("click", function () {
      divs.forEach(function (div) {
        div.style.backgroundColor = "blueviolet";
      });
      div.style.backgroundColor = "rgb(90, 25, 152)";
    });
  });
});
function handleClick(sectionId) {
  document.getElementById('sec7').style.display = sectionId === 'personal' ? 'block' : 'none';
  document.getElementById('sec8').style.display = sectionId === 'education' ? 'block' : 'none';
  document.getElementById('sec9').style.display = sectionId === 'workHistory' ? 'block' : 'none';
  document.getElementById('sec10').style.display = sectionId === 'skills' ? 'block' : 'none';
  document.getElementById('sec11').style.display = 'none';
}

document.getElementById('personal').addEventListener('click', function () {
  handleClick('personal');
});
document.getElementById('education').addEventListener('click', function () {
  handleClick('education');
});
document.getElementById('workHistory').addEventListener('click', function () {
  handleClick('workHistory');
});
document.getElementById('skills').addEventListener('click', function () {
  handleClick('skills');
});
function Landing() {
  window.location.href = "/LandingPage.html";
}
function saveInUserData() {
  const value = firstName.value;
  fetch('/saveInUserData', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: userData.email,
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      country: document.getElementById('country').value,
      city: document.getElementById('city').value,
      facebook: document.getElementById('facebook').value,
      linkedin: document.getElementById('linkedin').value,
      github: document.getElementById('github').value,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to save data");
      }
    })
    .catch((error) => {
      console.error("Error saving data:", error);
    });
}
const hasRun = localStorage.getItem('hasRun');
function reload() {
  window.location.reload();
}

const inputs = document.querySelectorAll('#sec7>input');
let cancelBtn = document.getElementById('cancelbtn');
let saveBtn = document.getElementById('savebtn');
inputs.forEach(input => {
  input.addEventListener('input', function () {
    cancelBtn.style.display = 'block';
    saveBtn.style.display = 'block';
  });
});
saveBtn.addEventListener('click', function () {
  cancelBtn.style.display = 'none';
  saveBtn.style.display = 'none';
});
document.querySelector('#sec81>div').addEventListener('click', function () {
  document.getElementById('sec8').style.display = 'none';
  document.getElementById('sec11').style.display = 'block';
});
function deleteParent() {
  // Get the parent node of the clicked element and remove it
  var parent = document.querySelector('.sections');
  parent.parentNode.removeChild(parent);
}