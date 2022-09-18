// VARIABLES

const alertElement = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.querySelector("#grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

let editElement;
let editFlag = false;
let editId = "";

// FUNCTIONS

// DISPLAY MESSAGE
const displayAlert = (txt, action) => {
  alertElement.textContent = txt;
  alertElement.classList.add(`alert-${action}`);
  setTimeout(() => {
    alertElement.textContent = "";
    alertElement.classList.remove(`alert-${action}`);
  }, 1000);
};

// RESET EVERYTHING BACK TO DEFAULT

const setBackToDefault = () => {
  grocery.value = "";
  editFlag = false;
  editId = "";
  submitBtn.textContent = "Submit";
};

// LOCAL STORAGE

const getLocalStorage = () =>
  localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];

const addToLocalStorage = (id, value) => {
  const grocery = { id, value };
  const items = getLocalStorage();
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
};

const removeFromLocalStorage = (id) => {
  let items = getLocalStorage();
  items = items.filter((item) => item.id !== id);
  localStorage.setItem("list", JSON.stringify(items));
};

const editLocalStorage = (id, value) => {
  let items = getLocalStorage();
  items = items.map((item) => (item.id === id ? (item.value = value) : item));
  localStorage.setItem("list", JSON.stringify(items));
};

// EDIT LIST ITEM

const editItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement;
  editElement = e.currentTarget.parentElement.previousElementSibling;
  grocery.value = editElement.innerHTML;

  editFlag = true;

  editId = element.dataset.id;

  submitBtn.textContent = "Edit";
};

// DELETE LIST ITEM

const deleteItem = (e) => {
  const element = e.currentTarget.parentElement.parentElement;
  const id = element.dataset.id;

  list.removeChild(element);

  if (list.children.length === 0) {
    container.classList.remove("show-container");
  }

  displayAlert("Item removed", "danger");

  setBackToDefault();

  removeFromLocalStorage(id);
};

// ADD LIST ITEM

const addItem = (e) => {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();

  if (value !== "" && !editFlag) {
    createListItem(id, value);

    displayAlert("Item added to the list", "success");

    container.classList.add("show-container");

    addToLocalStorage(id, value);
    setBackToDefault();
  } else if (value !== "" && editFlag) {
    editElement.innerHTML = value;
    displayAlert("Value changed", "success");
    editLocalStorage(editId, value);
    setBackToDefault();
  } else {
    displayAlert("Please enter a value", "danger");
  }
};

// CLEAR ALL ITEMS

const clearItems = () => {
  const items = document.querySelectorAll(".grocery-item");
  if (items.length > 0) {
    items.forEach((item) => {
      list.removeChild(item);
    });
  }
  container.classList.remove("show-container");
  displayAlert("Empty list", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
};

// CREATE NEW LIST ITEM

const createListItem = (id, value) => {
  const element = document.createElement("article");
  element.classList.add("grocery-item");
  const attribute = document.createAttribute("data-id");
  attribute.value = id;
  element.setAttributeNode(attribute);
  element.innerHTML = `
        <p class="title">${value}</p>
            <!-- BUTTON CONTAINER -->
        <div class="btn-container">
            <button class="edit-btn" type="button">
                <i class="fas fa-edit"></i>
            </button>
            <button class="delete-btn" type="button">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;

  list.appendChild(element);
  const deleteBtn = document.querySelector(".delete-btn");
  const editBtn = document.querySelector(".edit-btn");
  deleteBtn.addEventListener("click", deleteItem);
  editBtn.addEventListener("click", editItem);
};

// SETUP PREVIOUSLY ADDED ITEMS ONCE PAGE LOADS

const setupItems = () => {
  let items = getLocalStorage();
  if (items.length > 0) {
    items.forEach((item) => {
      createListItem(item.id, item.value);
    });
    container.classList.add("show-container");
  }
};

// EVENT LISTENERS

form.addEventListener("submit", addItem);
clearBtn.addEventListener("click", clearItems);
window.addEventListener("DOMContentLoaded", setupItems);
