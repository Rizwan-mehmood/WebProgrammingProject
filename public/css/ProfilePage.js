const params = new URLSearchParams(window.location.search);
const data = params.get('data');
const userData = JSON.parse(decodeURIComponent(data));
const email = userData.email;
localStorage.setItem('email', email);
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
      for (let i = 0; i < data.educationData.length; i++) {
        document.getElementById('instituteName').value = data.educationData[i].instituteName;
        document.getElementById('degreeName').value = data.educationData[i].degreeName;
        document.getElementById('major').value = data.educationData[i].field;
        document.getElementById('startDate').value = data.educationData[i].startDate;
        document.getElementById('endDate').value = data.educationData[i].endDate;
        document.getElementById('studyCountry').value = data.educationData[i].studyCountry;
        document.getElementById('studyCity').value = data.educationData[i].studyCity;
        document.getElementById('marks').value = data.educationData[i].marks;
        const newSection = document.createElement('div');
        newSection.classList.add('sections');
        newSection.innerHTML = `
        <div id="sections1">
          <p>${data.educationData[i].startDate}</p>
          <p style="width: 2px; height: 30px; background-color: black; border-radius: 5px;"></p>
          <p>${data.educationData[i].endDate}</p>
        </div>
        <div id="sections2">
          <h5>${data.educationData[i].instituteName}</h5>
          <p><b>Degree:</b> ${data.educationData[i].degreeName}, ${data.educationData[i].field}</p>
          <p><b>Location:</b> ${data.educationData[i].studyCountry}, ${data.educationData[i].studyCity}</p>
          <p><b>Obtained Marks:</b> ${data.educationData[i].marks}</p>
        </div>
        `;
        document.getElementById('sec4').appendChild(newSection);
        addEducation();
      }
      for (let i = 0; i < data.skillsData.length; i++) {
        document.getElementById('skillName').value = data.skillsData[i].skillName;
        document.getElementById('experience').value = data.skillsData[i].experience;
        const newSection = document.createElement('div');
        newSection.classList.add('sec6skills');
        newSection.innerHTML =
          `<div id="sec6sk1">
                    <h6>Skill</h6>
                    <p>${data.skillsData[i].skillName}</p>
                </div>
                <div id="sec6sk2">
                    <h6>Experience</h6>
                    <p>${data.skillsData[i].experience} years</p>
                </div>`
        document.getElementById('sec6').appendChild(newSection);
        addSkills();
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
document.getElementById('h1_img').addEventListener('click', function () {
  document.getElementById('overlay').style.display = document.getElementById('overlay').style.display === 'block' ? 'none' : 'block';
  document.getElementById('logout').style.display = document.getElementById('logout').style.display === 'flex' ? 'none' : 'flex';
  document.getElementById('logout').style.top = document.getElementById('h1_img').offsetTop + 45 + 'px';
  document.getElementById('logout').style.left = document.getElementById('h1_img').offsetLeft - 100 + 'px';
});
document.querySelector('#logout>button').addEventListener('click', function () {
  localStorage.removeItem('profileImage');
  localStorage.removeItem('email');
  window.history.replaceState(null, null, window.location.href);
  window.location.href = '/LoginPage.html';
});
document.querySelector('#logout>p').addEventListener('click', function (e) {
  document.getElementById('logout').style.display = 'none';
  document.getElementById('changePassword').style.display = 'block';
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
      localStorage.setItem('profileImage', e.target.result);
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
  return false;
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
        fetch(imagePath)
          .then(response => response.blob())
          .then(blob => {
            const fileReader = new FileReader();
            fileReader.onload = function () {
              localStorage.setItem('profileImage', fileReader.result);
            };
            fileReader.readAsDataURL(blob);
          })
          .catch(error => {
            console.error('Error fetching image:', error);
          });
      }
    })
    .catch((error) => {
      console.error("Error getting image:", error);
    });
  return false;
}

function chooseFile1() {
  let check = document.getElementById("pic_h1");
  if (check.style.display != "none") {
    chooseFile();
  }
  return false;
}
function EditProfile() {
  document.querySelector('#m1').style.display = "none";
  document.querySelector('#m2').style.display = "block";
  return false;
}
function dashboard() {
  window.location.reload();
  return false;
}
document.addEventListener('DOMContentLoaded', function () {
  if (document.getElementById("m1").style.display == "block") {
    makeMap();
  }
  return false;
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
  return false;
});
function handleClick(sectionId) {
  document.getElementById('sec7').style.display = sectionId === 'personal' ? 'block' : 'none';
  document.getElementById('sec8').style.display = sectionId === 'education' ? 'block' : 'none';
  document.getElementById('sec10').style.display = sectionId === 'skills' ? 'block' : 'none';
  document.getElementById('sec11').style.display = 'none';
  return false;
}

document.getElementById('personal').addEventListener('click', function () {
  handleClick('personal');
  return false;
});
document.getElementById('education').addEventListener('click', function () {
  handleClick('education');
  return false;
});
document.getElementById('skills').addEventListener('click', function () {
  handleClick('skills');
  return false;
});
function Landing() {
  window.location.href = "/LandingPage.html";
  return false;
}
function saveInUserData(education, skill) {
  const array = [];
  let instituteName, sections2Div, degreeElement, degreeValue, locationElement, locationValues, marksElement, marksValue, countryValue, cityValue, degreeName, field, country, city, marks, startDate, endDate, skillName, experience;
  if (education != null) {
    instituteName = education.querySelector('#sections2>h5').innerText;
    sections2Div = education.querySelector('#sections2');
    degreeElement = sections2Div.querySelector('p:nth-of-type(1)');
    degreeValue = degreeElement.textContent.split(':')[1].trim().split(', ');
    locationElement = sections2Div.querySelector('p:nth-of-type(2)');
    locationValues = locationElement.textContent.split(':')[1].trim().split(', ');
    marksElement = sections2Div.querySelector('p:nth-of-type(3)');
    marksValue = marksElement.textContent.split(':')[1].trim();
    countryValue = locationValues[1];
    cityValue = locationValues[0];
    degreeName = degreeValue[0];
    field = degreeValue[1];
    country = countryValue;
    city = cityValue;
    marks = marksValue;
    startDate = education.querySelector('#sections1>p:first-child').innerText;
    endDate = education.querySelector('#sections1>p:last-child').innerText;
  }
  if (skill != null) {
    skillName = skill.querySelector('#sk1>p').innerText;
    experience = skill.querySelector('#sk2>p').innerText.split(' ')[0];
  }

  const userData = [];
  userData.push(document.getElementById('firstName').value);
  userData.push(document.getElementById('lastName').value);
  userData.push(document.getElementById('country').value);
  userData.push(document.getElementById('city').value);
  userData.push(document.getElementById('facebook').value);
  userData.push(document.getElementById('linkedin').value);
  userData.push(document.getElementById('github').value);
  array.push(userData);
  const educationData = [];
  educationData.push(instituteName);
  educationData.push(degreeName);
  educationData.push(field);
  educationData.push(startDate);
  educationData.push(endDate);
  educationData.push(country);
  educationData.push(city);
  educationData.push(marks);
  array.push(educationData);
  const skillData = [];
  skillData.push(skillName);
  skillData.push(experience);
  array.push(skillData);
  return array;
}
function saveData() {
  const sections = document.querySelectorAll('#sec8 .sections');
  const skills = document.querySelectorAll('#sec10 .Skills');
  const array = [];
  if (sections.length == 0 && skills.length == 0) {
    array.push(saveInUserData(null, null));
  }
  else {
    for (let i = 0; i < sections.length || i < skills.length; i++) {
      if (i < sections.length && i < skills.length) {
        array.push(saveInUserData(sections[i], skills[i]));
      }
      else if (i < sections.length && i >= skills.length) {
        array.push(saveInUserData(sections[i], null));
      }
      else if (i >= sections.length && i < skills.length) {
        array.push(saveInUserData(null, skills[i]));
      }
    }
  }
  fetch('/saveInUserData', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      array: array,
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
  return false;
}

const inputs = document.querySelectorAll('#sec7>input');
let cancelBtn = document.getElementById('cancelbtn');
let saveBtn = document.getElementById('savebtn');
inputs.forEach(input => {
  input.addEventListener('input', function () {
    cancelBtn.style.display = 'block';
    saveBtn.style.display = 'block';
  });
  return false;
});
saveBtn.addEventListener('click', function () {
  cancelBtn.style.display = 'none';
  saveBtn.style.display = 'none';
  return false;
});
let save = document.getElementById('saveBtn');
let cancel = document.getElementById('cancelBtn');
save.addEventListener('click', function () {
  save.style.display = 'none';
  cancel.style.display = 'none';
});
cancel.addEventListener('click', function () {
  window.location.reload();
});
document.querySelector('#sec81>div').addEventListener('click', function () {
  document.getElementById('sec8').style.display = 'none';
  document.getElementById('sec11').style.display = 'block';
  document.getElementById('instituteName').value = "";
  document.getElementById('degreeName').value = "";
  document.getElementById('major').value = "";
  document.getElementById('startDate').value = "";
  document.getElementById('endDate').value = "";
  document.getElementById('studyCountry').value = "";
  document.getElementById('studyCity').value = "";
  document.getElementById('marks').value = "";
  return false;
});
function deleteParent(trashIcon) {
  const sectionsDiv = trashIcon.closest('.sections');
  if (sectionsDiv) {
    sectionsDiv.parentNode.removeChild(sectionsDiv);
    document.getElementById('cancelBtn').style.display = "block";
    document.getElementById('saveBtn').style.display = "block";
  } else {
    console.error('Parent .sections div not found');
  }
  return false;
}
function deleteSkill(trashIcon) {
  const sectionsDiv = trashIcon.closest('.Skills');
  if (sectionsDiv) {
    sectionsDiv.parentNode.removeChild(sectionsDiv);
    document.getElementById('cancelBtn').style.display = "block";
    document.getElementById('saveBtn').style.display = "block";
  } else {
    console.error('Parent .sections div not found');
  }
  return false;
}


document.getElementById('edu').addEventListener('submit', function (e) {
  e.preventDefault();
  const instituteName = document.getElementById('instituteName').value;
  const degreeName = document.getElementById('degreeName').value;
  const major = document.getElementById('major').value;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const country = document.getElementById('studyCountry').value;
  const city = document.getElementById('studyCity').value;
  const marks = document.getElementById('marks').value;
  // Create new section element
  const newSection = document.createElement('div');
  newSection.classList.add('sections');

  // Populate new section with input values
  newSection.innerHTML = `
      <div id="sections1">
          <p>${startDate}</p>
          <p style="width: 2px; height: 30px; background-color: black; border-radius: 5px;"></p>
          <p>${endDate}</p>
      </div>
      <div id="sections2">
          <h5>${instituteName}</h5>
          <p><b>Degree:</b> ${degreeName}, ${major}</p>
          <p><b>Location:</b> ${country}, ${city}</p>
          <p><b>Obtained Marks:</b> ${marks}</p>
      </div>
      <div id="sections3">
          <div onclick="deleteParent(this)">
              <i class="fa fa-trash"></i>
          </div>
      </div>
  `;
  document.getElementById('sec8').appendChild(newSection);
  document.getElementById('sec11').style.display = 'none';
  document.getElementById('sec8').style.display = 'block';
  document.getElementById('cancelBtn').style.display = 'block';
  document.getElementById('saveBtn').style.display = 'block';
});
function addEducation() {
  const instituteName = document.getElementById('instituteName').value;
  const degreeName = document.getElementById('degreeName').value;
  const major = document.getElementById('major').value;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const country = document.getElementById('studyCountry').value;
  const city = document.getElementById('studyCity').value;
  const marks = document.getElementById('marks').value;
  // Create new section element
  const newSection = document.createElement('div');
  newSection.classList.add('sections');

  // Populate new section with input values
  newSection.innerHTML = `
      <div id="sections1">
          <p>${startDate}</p>
          <p style="width: 2px; height: 30px; background-color: black; border-radius: 5px;"></p>
          <p>${endDate}</p>
      </div>
      <div id="sections2">
          <h5>${instituteName}</h5>
          <p><b>Degree:</b> ${degreeName}, ${major}</p>
          <p><b>Location:</b> ${country}, ${city}</p>
          <p><b>Obtained Marks:</b> ${marks}</p>
      </div>
      <div id="sections3">
          <div onclick="deleteParent(this)">
              <i class="fa fa-trash"></i>
          </div>
      </div>
  `;
  document.getElementById('sec8').appendChild(newSection);
  document.getElementById('sec11').style.display = 'none';
  document.getElementById('sec11').style.display = 'none';
  document.getElementById('sec8').style.display = 'none';
  document.getElementById('cancelBtn').style.display = 'none';
  document.getElementById('saveBtn').style.display = 'none';
}

document.querySelector('#sec101>div').addEventListener('click', function () {
  document.getElementById('sec10').style.display = 'none';
  document.getElementById('sec7').style.display = 'none';
  document.getElementById('sec8').style.display = 'none';
  document.getElementById('sec10').style.display = 'none';
  document.getElementById('sec11').style.display = 'none';
  document.getElementById('sec12').style.display = 'block';
  document.getElementById('cancelBtn').style.display = 'none';
  document.getElementById('saveBtn').style.display = 'none';
  document.getElementById('skillName').value = '';
  document.getElementById('experience').value = '';
});
document.getElementById('skill').addEventListener('submit', function (e) {
  e.preventDefault();
  const div = document.createElement('div');
  const skill = document.getElementById('skillName').value;
  const experience = document.getElementById('experience').value;
  console.log(skill, experience);
  div.classList.add('Skills');
  div.innerHTML =
    `<div id="skills1">
        <div id="sk1">
          <h6>Skill</h6>
          <p>${skill}</p>
        </div>
        <div id="sk2">
          <h6>Experience</h6>
          <p>${experience} years</p>
        </div>
      </div>
      <div id="skills2">
        <div onclick="deleteSkill(this)">
          <i class="fa fa-trash"></i>
        </div>
      </div>`
  document.getElementById('sec10').appendChild(div);
  document.getElementById('sec12').style.display = 'none';
  document.getElementById('sec10').style.display = 'block';
  document.getElementById('cancelBtn').style.display = 'block';
  document.getElementById('saveBtn').style.display = 'block';
});
function addSkills() {
  const div = document.createElement('div');
  const skill = document.getElementById('skillName').value;
  const experience = document.getElementById('experience').value;
  div.classList.add('Skills');
  div.innerHTML =
    `<div id="skills1">
        <div id="sk1">
          <h6>Skill</h6>
          <p>${skill}</p>
        </div>
        <div id="sk2">
          <h6>Experience</h6>
          <p>${experience} years</p>
        </div>
      </div>
      <div id="skills2">
        <div onclick="deleteSkill(this)">
          <i class="fa fa-trash"></i>
        </div>
      </div>`
  document.getElementById('sec10').appendChild(div);
  document.getElementById('sec12').style.display = 'none';
  document.getElementById('sec10').style.display = 'none';
  document.getElementById('cancelBtn').style.display = 'none';
  document.getElementById('saveBtn').style.display = 'none';
}
document.getElementById('password').addEventListener('submit', function (e) {
  e.preventDefault();
  const oldPassword = document.getElementById('oldPassword').value;
  const newPassword = document.getElementById('newPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const p = document.querySelectorAll('#password>p');
  let flag = false;
  if (newPassword.length < 8) {
    p[2].style.display = 'block';
    flag = true;
  }
  if (newPassword != confirmPassword) {
    p[3].style.display = 'block';
    flag = true;
  }
  fetch('/resetPassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: email,
      oldPassword: oldPassword,
      newPassword: newPassword,
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        p[1].style.display = 'block';
      }
      else if (data.success) {
        p[0].style.display = 'block';
        setTimeout(function () { }, 400);
        window.location.reload();
      }
    })
    .catch(err => console.log(err));
});