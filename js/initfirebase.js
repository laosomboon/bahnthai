// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged , signOut } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  getDocs,
  addDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js";
import { firebaseConfig } from "./firebaseConfig.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Categories definition
const categories = [
  { name: "Appetizers", key: "Appetizer", order: 1 },
  { name: "Barbeque", key: "Barbeque", order: 4 },
  { name: "Fish & Seafoods", key: "Fish & Seafood", order: 6 },
  { name: "Lunch Specials", key: "Lunch Special", order: 10 },
  { name: "Noodle Dishes", key: "Noodle Dishes", order: 8 },
  { name: "Rice Dishes", key: "Rice Dishes", order: 9 },
  { name: "Soups", key: "Soup", order: 2 },
  { name: "Thai Desserts", key: "Specialty Thai Desserts" },
  { name: "Stir-fired Dishes", key: "Stir-fried Dishes", order: 5 },
  { name: "Thai curries", key: "Thai Curries", order: 4 },
  { name: "Thai Salads", key: "Thai Salads", order: 3 },
  { name: "Vegetable", key: "Vegetables", order: 7 },
];

// Real-time menu population
const colRef = collection(db, "applebyline");
const q = query(colRef, orderBy("order"));

onSnapshot(q, (snap) => {
  const validKeys = categories.map(c => c.key);
  const menus = snap.docs
    .map(doc => ({ ...doc.data(), id: doc.id }))
    .filter(m => validKeys.includes(m.category));

  const sideNav = document.getElementById("SidenavContainer");
  sideNav.innerHTML = "";

  const sortedCategories = [...categories].sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  sortedCategories.forEach(cat => {
    const filtered = menus.filter(m => m.category === cat.key);
    if (!filtered.length) return;

    const cateId = cat.key.replace(/[^a-zA-Z0-9]/g, "");

    const a = document.createElement("a");
    a.id = cateId + "Btn";
    a.href = "javascript:void(0)";
    a.classList.add("w3-bar-item", "w3-button");
    a.onclick = () => highlight(cateId);
    a.innerText = cat.name;

    const i = document.createElement("i");
    i.classList.add("fa", "fa-caret-down", "w3-margin-left");
    a.appendChild(i);

    const div = document.createElement("div");
    div.id = cateId;
    div.classList.add("w3-hide", "w3-animate-left");

    filtered.forEach(menu => {
      
      const innerA = document.createElement("a");
      innerA.href = "javascript:void(0)";
      innerA.classList.add("w3-bar-item", "w3-button", "w3-border-bottom", "w3-hover-light-grey");
      innerA.innerText = menu.name;
      innerA.style.cssText = "font: .7em Arial, sans-serif; color:blue";
      innerA.onclick = () => openMenu(menu);
      div.appendChild(innerA);
    });

    sideNav.appendChild(a);
    sideNav.appendChild(div);
  });
});


// Menu view handler
window.openMenu = async function (menu) {
  const menuId = document.getElementById("menuId");
  const menuName = document.getElementById("menuName");
  const menuDescription = document.getElementById("menuDescription");
  const menuPrice = document.getElementById("menuPrice");
  const optionsWrapper = document.getElementById("optionsWrapper");
  const choicesWrapper = document.getElementById("choicesWrapper");
  const singlePriceWrapper = document.getElementById("singlePriceWrapper");
  const optionsContainer = document.getElementById("optionsContainer");
  const choicesContainer = document.getElementById("choicesContainer");

  // Clear existing dynamic fields
  optionsContainer.innerHTML = "";
  choicesContainer.innerHTML = "";
  menuPrice.value = "";

  const docRef = doc(db, `applebyline/${menu.id}`);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    alert("Menu item not found.");
    return;
  }

  const data = docSnap.data();

  // Basic fields
  menuId.value = menu.id;
  menuName.value = data.name || "";
  menuDescription.value = data.description || "";

  // Determine pricing type
  if (data.options) {
    optionsWrapper.style.display = "block";
    choicesWrapper.style.display = "none";
    singlePriceWrapper.style.display = "none";

    for (const [optionName, price] of Object.entries(data.options)) {
      const thaiName = data.thaioptions?.[optionName] || "";
      addOption(optionName, price, thaiName);
    }
  } else if (data.choices) {
    choicesWrapper.style.display = "block";
    optionsWrapper.style.display = "none";
    singlePriceWrapper.style.display = "none";

    for (const [choice, price] of Object.entries(data.choices)) {
      addChoice(choice, price);
    }
  } else if (data.price) {
    singlePriceWrapper.style.display = "block";
    optionsWrapper.style.display = "none";
    choicesWrapper.style.display = "none";

    menuPrice.value = data.price;
  } else {
    // default fallback
    singlePriceWrapper.style.display = "block";
    optionsWrapper.style.display = "none";
    choicesWrapper.style.display = "none";
  }
};

// Add new Option block
function addOption(name = "", price = "", thaiName = "") {
  const container = document.getElementById("optionsContainer");
  const optionIndex = container.children.length;

  const div = document.createElement("div");
  div.classList.add("option-block");
  div.style.marginBottom = "1rem";

  div.innerHTML = `
    <label>Option Name</label><br />
    <input type="text" name="optionName-${optionIndex}" class="field-style field-full" value="${name}" />

    <label>Price</label><br />
    <input type="number" name="optionPrice-${optionIndex}" step="0.01" class="field-style field-full" value="${price}" />

    <label>Thai Name</label><br />
    <input type="text" name="thaiOption-${optionIndex}" class="field-style field-full" value="${thaiName}" />

    <button type="button" onclick="this.parentElement.remove()" class="w3-btn w3-small w3-red">Remove</button>
    <hr />
  `;

  container.appendChild(div);
}

// Add new Choice block
function addChoice(name = "", price = "") {
  const container = document.getElementById("choicesContainer");
  const choiceIndex = container.children.length;

  const div = document.createElement("div");
  div.classList.add("choice-block");
  div.style.marginBottom = "1rem";

  div.innerHTML = `
    <label>Choice Name</label><br />
    <input type="text" name="choiceName-${choiceIndex}" class="field-style field-full" value="${name}" />

    <label>Price</label><br />
    <input type="number" name="choicePrice-${choiceIndex}" step="0.01" class="field-style field-full" value="${price}" />

    <button type="button" onclick="this.parentElement.remove()" class="w3-btn w3-small w3-red">Remove</button>
    <hr />
  `;

  container.appendChild(div);
}

window.updateItem = async function (btn) {

  const menuId = document.getElementById("menuId").value;
  const name = document.getElementById("menuName").value.trim();
  const description = document.getElementById("menuDescription").value.trim();
  const price = parseFloat(document.getElementById("menuPrice").value);

  const optionsWrapper = document.getElementById("optionsWrapper");
  const choicesWrapper = document.getElementById("choicesWrapper");
 
  const dataToUpdate = {
    name,
    description,
    order: 0, // optionally keep or update ordering logic
  };


  // --- OPTIONS ---
  if (optionsWrapper.style.display === "block") {
    const optionBlocks = document.querySelectorAll("#optionsContainer .option-block");
    const options = {};
    const thaioptions = {};

    optionBlocks.forEach((block, i) => {
      const optionName = block.querySelector(`[name^="optionName-"]`).value.trim();
      const optionPrice = parseFloat(block.querySelector(`[name^="optionPrice-"]`).value);
      const thaiName = block.querySelector(`[name^="thaiOption-"]`).value.trim();

      if (optionName && !isNaN(optionPrice)) {
        options[optionName] = optionPrice;
        if (thaiName) thaioptions[optionName] = thaiName;
      }
    });

    dataToUpdate.options = options;
    if (Object.keys(thaioptions).length > 0) {
      dataToUpdate.thaioptions = thaioptions;
    }
    delete dataToUpdate.price;
    delete dataToUpdate.choices;
  }

  // --- CHOICES ---
  else if (choicesWrapper.style.display === "block") {
    const choiceBlocks = document.querySelectorAll("#choicesContainer .choice-block");
    const choices = {};

    choiceBlocks.forEach((block, i) => {
      const choiceName = block.querySelector(`[name^="choiceName-"]`).value.trim();
      const choicePrice = parseFloat(block.querySelector(`[name^="choicePrice-"]`).value);

      if (choiceName && !isNaN(choicePrice)) {
        choices[choiceName] = choicePrice;
      }
    });

    dataToUpdate.choices = choices;
    delete dataToUpdate.price;
    delete dataToUpdate.options;
    delete dataToUpdate.thaioptions;
  }

  // --- SINGLE PRICE ---
  else {
    if (!isNaN(price)) {
      dataToUpdate.price = price;
    }
    delete dataToUpdate.options;
    delete dataToUpdate.choices;
    delete dataToUpdate.thaioptions;
  }

  try {
    await updateDoc(doc(db, `applebyline/${menuId}`), dataToUpdate);
    alert("Item updated!");
  } catch (err) {
    console.error(err);
    alert("Failed to update item.");
  }
};

window.deleteItem = async function (btn) {
  const menuId = document.getElementById("menuId").value;
  if (!menuId) {
    alert("Invalid menu item ID.");
    return;
  }

  const confirmDelete = confirm("Are you sure you want to delete this menu item?");
  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, `applebyline/${menuId}`));
    alert("Item deleted!");
    // Optionally clear form
    document.getElementById("updateForm").reset();
    document.getElementById("optionsContainer").innerHTML = "";
    document.getElementById("choicesContainer").innerHTML = "";
  } catch (err) {
    console.error(err);
    alert("Failed to delete item.");
  }
};
window.addOption = function (name = "", price = "", thai = "") {
  const optionsContainer = document.getElementById("optionsContainer");
  const index = optionsContainer.children.length;

  const block = document.createElement("div");
  block.className = "option-block";
  block.innerHTML = `
    <input type="text" name="optionName-${index}" value="${name}" placeholder="Option Name" class="field-style field-split align-left" />
    <input type="number" name="optionPrice-${index}" value="${price}" step=".01" placeholder="Price" class="field-style field-split align-left" />
    <input type="text" name="thaiOption-${index}" value="${thai}" placeholder="Thai Name" class="field-style field-split align-left" />
    <button type="button" onclick="this.parentElement.remove()" class="w3-btn w3-tiny w3-red">X</button>
    <br />
  `;
  optionsContainer.appendChild(block);
};
window.addChoice = function (name = "", price = "") {
  const choicesContainer = document.getElementById("choicesContainer");
  const index = choicesContainer.children.length;

  const block = document.createElement("div");
  block.className = "choice-block";
  block.innerHTML = `
    <input type="text" name="choiceName-${index}" value="${name}" placeholder="Choice Label" class="field-style field-split align-left" />
    <input type="number" name="choicePrice-${index}" value="${price}" step=".01" placeholder="Price" class="field-style field-split align-left" />
    <button type="button" onclick="this.parentElement.remove()" class="w3-btn w3-tiny w3-red">X</button>
    <br />
  `;
  choicesContainer.appendChild(block);
};

// Sidebar toggle
window.w3_open = function () {
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("myOverlay").style.display = "block";
};

window.w3_close = function () {
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("myOverlay").style.display = "none";
};

// Highlight category
window.highlight = function (id) {
  const section = document.getElementById(id);
  if (section) section.classList.toggle("w3-hide");
};

// Logout
window.signMeOut = function () {
  signOut(auth)
    .then(() => location.assign("login.html"))
    .catch((error) => {
      alertify.error("Sign-out failed");
      console.error(error);
    });
};

window.renderOptions = function(options, thaioptions) {
  const container = document.getElementById("optionsContainer");
  container.innerHTML = ""; // clear existing

  Object.entries(options).forEach(([key, price]) => {
    const thaiName = thaioptions?.[key] || "";

    const optionBlock = document.createElement("div");
    optionBlock.style.marginBottom = "12px";

    optionBlock.innerHTML = `
      <label>${key}</label><br>
      <input
        type="number"
        name="price-${key}"
        step="0.01"
        class="field-style field-full align-none"
        placeholder="Price for ${key}"
        value="${price}"
      />
      <input
        type="text"
        name="thai-${key}"
        class="field-style field-full align-none"
        placeholder="Thai Name for ${key}"
        value="${thaiName}"
      />
    `;

    container.appendChild(optionBlock);
  });
}

window.toggleNewMenuForm = function() {
  const form = document.getElementById("createForm");
  const categorySelect = document.getElementById("newMenuCategory");

  form.style.display = form.style.display === "none" ? "block" : "none";

  // Populate categories if not already populated
  if (categorySelect.options.length <= 1) {
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat.key;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
  }
}

window.addNewOption = function() {
  const container = document.getElementById("newOptionsContainer");
  const div = document.createElement("div");
  div.innerHTML = `
    <input type="text" placeholder="Option Name" class="newOptionName" />
    <input type="text" placeholder="Thai Name" class="newThaiName" />
    <input type="number" placeholder="Price" step="0.01" class="newOptionPrice" />
    <button type="button" onclick="this.parentElement.remove()">🗑️</button>
  `;
  container.appendChild(div);
}

window.addNewChoice = function() {
  const container = document.getElementById("newChoicesContainer");
  const div = document.createElement("div");
  div.innerHTML = `
    <input type="text" placeholder="Choice Label" class="newChoiceName" />
    <input type="number" placeholder="Price" step="0.01" class="newChoicePrice" />
    <button type="button" onclick="this.parentElement.remove()">🗑️</button>
  `;
  container.appendChild(div);
}
window.createItem = async function () {
  const name = document.getElementById("newMenuName").value.trim();
  const category = document.getElementById("newMenuCategory").value.trim();
  const description = document.getElementById("newMenuDescription").value.trim();
  const price = parseFloat(document.getElementById("newMenuPrice").value);

  const options = {};
  const thaioptions = {};
  const optionNameEls = document.getElementsByClassName("newOptionName");
  const optionThaiEls = document.getElementsByClassName("newThaiName");
  const optionPriceEls = document.getElementsByClassName("newOptionPrice");

  for (let i = 0; i < optionNameEls.length; i++) {
    const optName = optionNameEls[i].value.trim();
    const optThai = optionThaiEls[i].value.trim();
    const optPrice = parseFloat(optionPriceEls[i].value);
    if (optName && !isNaN(optPrice)) {
      options[optName] = optPrice;
      thaioptions[optName] = optThai;
    }
  }

  const choices = {};
  const choiceNameEls = document.getElementsByClassName("newChoiceName");
  const choicePriceEls = document.getElementsByClassName("newChoicePrice");

  for (let i = 0; i < choiceNameEls.length; i++) {
    const choiceName = choiceNameEls[i].value.trim();
    const choicePrice = parseFloat(choicePriceEls[i].value);
    if (choiceName && !isNaN(choicePrice)) {
      choices[choiceName] = choicePrice;
    }
  }

  if (!name || !category) {
    alert("Name and Category are required.");
    return;
  }

  const newItem = {
    name,
    category,
    description,
    order: Date.now(), // You can replace with manual input if needed
  };

  if (Object.keys(options).length > 0) {
    newItem.options = options;
    newItem.thaioptions = thaioptions;
  } else if (Object.keys(choices).length > 0) {
    newItem.choices = choices;
  } else if (!isNaN(price)) {
    newItem.price = price;
  }

  try {
    await addDoc(collection(db, "applebyline"), newItem);
    alert("New menu item added successfully!");
    resetCreateForm();
    toggleNewMenuForm(); // Hide the form again
  } catch (error) {
    console.error("Error adding item:", error);
    alert("Failed to add new item.");
  }
};

function resetCreateForm() {
  document.getElementById("createForm").reset();
  document.getElementById("newOptionsContainer").innerHTML = "";
  document.getElementById("newChoicesContainer").innerHTML = "";
}

