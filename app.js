let container = document.querySelector("[data-user]");
let searchInput = document.querySelector(".search-input");
let newBtn = document.querySelector(".new-btn");
let newUserForm = document.querySelector(".new-user-form");
let overlay = document.querySelector(".overlay");
let overlayNewDetails = document.querySelector(".overlay-new-details");
let closeBtn = document.querySelector(".close-btn");
let addBtn = document.querySelector(".add-btn");
let loading = document.querySelector(".loading");
let userDetails = document.querySelector(".user-details");
let closeUserDetailsBtn = document.querySelector(".close-user-details-btn");
let extraDetailsBtn = document.querySelector(".add-extra-details");
let extraDetails = document.querySelector(".extra-details.popup");
let cancelNewDetails = document.querySelector(".cancel-new-details-btn");
let addNewDeatils = document.querySelector(".add-new-details-btn");

let fullName = document.querySelector(".full-name-i");
let email = document.querySelector(".email-i");
let userName = document.querySelector(".user-name-i");
let phone = document.querySelector(".phone-i");
let country = document.querySelector(".country-i");
let zipCode = document.querySelector(".zip-code-i");

let detailsTitle = document.querySelector('.details-title')
let detailsValue = document.querySelector('.details-value')

let currentUser;

let userData = [];
const updateUser = (data) => {
  if (data.length == 0) {
    let card = container.content.cloneNode(true).children[0];
    let icon = card.querySelector(".name");
    let msg = card.querySelector(".email");
    icon.innerHTML = `<img src="./src/empty.png">`;
    msg.textContent = "somthing went wrong..";
    container.parentElement.append(card);
    card.classList.add("empty-user");
  }
  data.forEach((user) => {
    let card = container.content.cloneNode(true).children[0];
    let name = card.querySelector(".name");
    let email = card.querySelector(".email");
    let phone = card.querySelector(".phone");
    name.textContent = user.name;
    email.textContent = `Email: ${user.email}`;
    phone.textContent = `Phone: ${user.phone}`;
    container.parentElement.append(card);
    loading.classList.remove("active");
    card.setAttribute("data-username", user.username);
  });
};
fetch("https://jsonplaceholder.typicode.com/users")
  .then((res) => res.json())
  .then((data) => {
    userData = data;
    updateUser(data);
  })
  .catch((e) => {
    updateUser(userData);
  });
searchInput.addEventListener("input", () => {
  let search = searchInput.value;
  let cards = [...container.parentElement.children];
  cards.shift();
  cards.shift();
  cards.forEach((card) => {
    let name = card.querySelector(".name").textContent.toLocaleLowerCase();
    if (
      name.includes(search.toLocaleLowerCase()) ||
      card.dataset.username == search
    ) {
      card.classList.remove("hide");
    } else {
      card.classList.add("hide");
    }
  });
});

newBtn.addEventListener("click", () => {
  newUserForm.classList.add("active");
  overlay.classList.add("active");
});
closeBtn.addEventListener("click", (e) => {
  e.preventDefault();
  overlay.classList.remove("active");
  newUserForm.classList.remove("active");
});
overlay.addEventListener("click", () => {
  let popups = document.querySelectorAll(".popup");
  popups.forEach((pop) => {
    pop.classList.toggle("active", !"active");
  });
 
});
// adding users
class User {
  constructor(name, email, userName, phone, country, zip) {
    this.name = name;
    this.email = email;
    this.username = userName;
    this.phone = phone;
    this.country = country;
    this.zip = zip;
    this.id = userData[userData.length - 1].id + 1;
  }
}

addBtn.addEventListener("click", (e) => {
  nameInput = fullName.value;
  emailInput = email.value;
  userNameInput = userName.value;
  phoneInput = phone.value;
  countryInput = country.value;
  zipInput = zipCode.value;
  if (nameInput != "" && emailInput != "" && phoneInput != "") {
    e.preventDefault();
    let user = new User(
      nameInput,
      emailInput,
      userNameInput,
      phoneInput,
      countryInput,
      zipInput
    );
    userData.push(user);
    updateUser([user]);
    newUserForm.classList.remove("active");
    overlay.classList.remove("active");
  }
  fullName.value = "";
  email.value = "";
  userName.value = "";
  phone.value = "";
  country.value = "";
  zipCode.value = "";
});
container.parentElement.addEventListener("click", (e) => {
  let card = e.target.closest(".card");
  if (card) {
    userDetails.classList.add('active');
    document.body.classList.add('body-stop')
    closeUserDetailsBtn.classList.add('active');
    extraDetailsBtn.classList.add('active');
    let username = card.dataset.username;
    let index = userData.findIndex((user) => user.username == username);
    let heading = document.createElement("h2");
    heading.textContent = userData[index].name;
    userDetails.append(heading);    
    currentUser = userData[index];
    (function printDetails(data) {
      for (let prop in data) {
        if (typeof data[prop] === "object" && data[prop] !== null) {
          printDetails(data[prop]);
        } else {
          let html = `<div class="row">
                        <lable for="${prop}">${prop}</lable>
                        <input type="text" value="${data[prop]}" readonly>
                    </div>`;
          userDetails.innerHTML += html;
        }
      }
    })(userData[index]);
  }
});
closeUserDetailsBtn.addEventListener("click",(e)=>{
        userDetails.classList.remove("active");        
        userDetails.innerHTML = "";
        e.target.classList.remove('active');
        extraDetailsBtn.classList.remove('active');
        document.body.classList.remove('body-stop');
        overlay.classList.remove('active')
})
extraDetailsBtn.addEventListener("click",()=>{
  overlay.classList.add('active');
  extraDetails.classList.add('active');
  overlayNewDetails.classList.add('active')
})
overlayNewDetails.addEventListener("click",()=>{
  extraDetails.classList.remove('active')
  overlayNewDetails.classList.remove('active')
})
cancelNewDetails.addEventListener("click",(e)=>{
  e.preventDefault()
  extraDetails.classList.remove('active')
  overlayNewDetails.classList.remove('active')
  detailsTitle.value = ""
  detailsValue.value = ""
})
addNewDeatils.addEventListener("click",(e)=>{
  e.preventDefault()
  let title = detailsTitle.value;
  let value = detailsValue.value;
  if (!currentUser.hasOwnProperty(title)) {
    if (confirm("do you realy want to add? remember you can not change after adding")) {
      currentUser[title] = value;
      let html = `<div class="row">
      <lable for="${title}">${title}</lable>
      <input type="text" value="${value}" readonly>
      </div>`;
      userDetails.innerHTML += html;
      extraDetails.classList.remove('active');
      overlayNewDetails.classList.remove('active')
      detailsTitle.value = ""
      detailsValue.value = ""
    }
  }else{
    alert("Please enter new details")
  }
})