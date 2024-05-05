const cardData = [
  { image: "/images/Explore/1.png", title: "Electronics" },
  { image: "/images/Explore/2.png", title: "Smart Watches" },
  { image: "/images/Explore/3.png", title: "Smart Phones" },
  { image: "/images/Explore/4.png", title: "Smart LCD" },
  { image: "/images/Explore/5.png", title: "Kitchen & Accesories" },
  { image: "/images/Explore/6.png", title: "Men's Fashion" },
];
function createCard(imageSrc, title) {
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");
  const img = document.createElement("img");
  img.src = imageSrc;
  img.alt = "Title";
  const h4 = document.createElement("h4");
  h4.textContent = title;
  cardDiv.appendChild(img);
  cardDiv.appendChild(h4);
  return cardDiv;
}
const cardsContainer = document.getElementById("cardsContainer");
cardData.forEach((data) => {
  const cardElement = createCard(data.image, data.title);
  cardsContainer.appendChild(cardElement);
});
const categoriesData = [
  {
    name: "Electronics",
    subcategories: [
      "Mobile Phones & Accessories",
      "Laptops & Computers",
      "Tablets & E-readers",
      "Cameras & Photography",
      "Audio & Headphones",
      "Video Games & Consoles",
    ],
  },
  {
    name: "Fashion",
    subcategories: [
      "Men's Clothing",
      "Women's Clothing",
      "Kids' Clothing",
      "Shoes & Footwear",
      "Accessories (e.g., bags, belts, hats)",
      "Jewelry & Watches",
    ],
  },
  {
    name: "Home & Kitchen",
    subcategories: [
      "Furniture",
      "Home Decor",
      "Kitchen & Dining",
      "Bedding & Bath",
      "Appliances",
      "Cleaning Supplies",
    ],
  },
  {
    name: "Health & Beauty",
    subcategories: [
      "Skincare",
      "Makeup & Cosmetics",
      "Haircare",
      "Personal Care & Hygiene",
      "Vitamins & Supplements",
      "Fragrances",
    ],
  },
  {
    name: "Sports & Outdoors",
    subcategories: [
      "Exercise & Fitness",
      "Outdoor Recreation",
      "Sports Equipment",
      "Camping & Hiking",
      "Cycling",
      "Team Sports",
    ],
  },
  {
    name: "Books & Media",
    subcategories: [
      "Books (e.g., Fiction, Non-fiction, Children's Books)",
      "eBooks & Audiobooks",
      "Movies & TV Shows",
      "Music (CDs, Vinyl, Digital)",
      "Magazines & Newspapers",
      "Educational Resources",
    ],
  },
];
const sideBar = document.getElementById("categoriesList");
categoriesData.forEach((category) => {
  const categoryList = document.createElement("ul");
  const categoryName = document.createElement("li");
  const categoryChevron = document.createElement("span");
  categoryChevron.classList.add("fas", "fa-chevron-right");
  categoryName.textContent = category.name;
  categoryName.prepend(categoryChevron);
  categoryList.appendChild(categoryName);
  const subcategoryList = document.createElement("ul");
  category.subcategories.forEach((subcategory) => {
    const subcategoryItem = document.createElement("li");
    const subcategoryLink = document.createElement("a");
    subcategoryLink.textContent = subcategory;
    subcategoryLink.setAttribute("href", "#");
    subcategoryItem.appendChild(subcategoryLink);
    subcategoryList.appendChild(subcategoryItem);
  });
  categoryName.addEventListener("click", function () {
    subcategoryList.style.display =
      subcategoryList.style.display == "block" ? "none" : "block";
    categoryChevron.classList.toggle("fa-chevron-down");
    categoryChevron.classList.toggle("fa-chevron-right");
  });

  categoryList.appendChild(subcategoryList);
  sideBar.appendChild(categoryList);
});
let click = document.querySelector("#allCategories>h3");
click.addEventListener("click", function (e) {
  if (document.getElementById("sideBar").style.display == "block flex") {
    document.getElementById("sideBar").style.display = "none";
    document.getElementById("overlay").style.display = "none";
  } else {
    document.getElementById("sideBar").style.display = "block flex";
    document.getElementById("overlay").style.display = "block";
    document.getElementById("sideBar").style.top = click.offsetTop + "px";
  }
  document.querySelectorAll("#categoriesList>ul>li>span").forEach((temp) => {
    temp.className = "";
    temp.classList.add("fas", "fa-chevron-right");
  });
});
let over = document.getElementById("overlay");
over.addEventListener("click", function (e) {
  document.getElementById("sideBar").style.display = "none";
  document.getElementById("overlay").style.display = "none";
  document.getElementById("menuList").style.display = "none";
  document.querySelectorAll("#categoriesList>ul>ul").forEach((ul) => {
    ul.style.display = "none";
  });
  let Account = document.getElementById("Account");
  Account.style.display = "none";
});
let drop = document.querySelector("#icon>i");
drop.addEventListener("click", function () {
  let overlay = document.getElementById("overlay");
  overlay.style.display = overlay.style.display == "block" ? "none" : "block";
  let list = document.getElementById("menuList");
  list.style.display = list.style.display == "block" ? "none" : "block flex";
  list.style.top = drop.offsetTop + 20 + "px";
  list.style.left = drop.offsetLeft - 70 + "px";
});
let account = document.getElementById("a1");
account.addEventListener("click", function () {
  let Account = document.getElementById("Account");
  Account.style.display = "block flex";
  let overlay = document.getElementById("overlay");
  overlay.style.display = overlay.style.display == "block" ? "none" : "block";
});

function google() {
  console.log("google");
  // Redirect the user to Google authentication page
  window.location.href = "/auth/google";
}
