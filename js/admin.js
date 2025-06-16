// admin.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
  getDocs,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAxn2Mb_xT1Er0A0NHO5M0M1AaXGyAHO1k",
  authDomain: "bahnthaiweb.firebaseapp.com",
  projectId: "bahnthaiweb",
  storageBucket: "bahnthaiweb.appspot.com",
  messagingSenderId: "559148712347",
  appId: "1:559148712347:web:eebac4f0d5bfbba8c8dc1d",
  measurementId: "G-2XZRLJPM4W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Categories for applebyline
const categories = [
  { name: "Appetizers", key: "Appetizer" },
  { name: "Barbeque", key: "Barbeque" },
  { name: "Fish & Seafoods", key: "Fish & Seafood" },
  { name: "Lunch Specials", key: "Lunch Special" },
  { name: "Noodle Dishes", key: "Noodle Dishes" },
  { name: "Rice Dishes", key: "Rice Dishes" },
  { name: "Soups", key: "Soup" },
  { name: "Thai Desserts", key: "Specialty Thai Desserts" },
  { name: "Stir-fired Dishes", key: "Stir-fried Dishes" },
  { name: "Thai curries", key: "Thai Curries" },
  { name: "Thai Salads", key: "Thai Salads" },
  { name: "Vegetable", key: "Vegetables" },
];

const colRef = collection(db, "applebyline");
const q = query(colRef, orderBy("order"));

onSnapshot(q, (snap) => {
  const menus = snap.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  const sideNav = document.getElementById("SidenavContainer");
  sideNav.innerHTML = "";

  categories.forEach(cat => {
    const filtered = menus.filter(m => m.category === cat.key);
    if (filtered.length === 0) return;

    const cateId = cat.key.replace(/[^a-zA-Z0-9]/g, "");

    const a = document.createElement("a");
    a.setAttribute("id", cateId + "Btn");
    a.setAttribute("onclick", `highlight('${cateId}')`);
    a.setAttribute("href", "javascript:void(0)");
    a.classList.add("w3-bar-item", "w3-button");
    a.innerText = cat.name;

    const i = document.createElement("i");
    i.classList.add("fa", "fa-caret-down", "w3-margin-left");
    a.appendChild(i);

    const div = document.createElement("div");
    div.setAttribute("id", cateId);
    div.classList.add("w3-hide", "w3-animate-left");

    sideNav.appendChild(a);
    sideNav.appendChild(div);

    filtered.forEach(menu => {
      const innerA = document.createElement("a");
      innerA.dataset.menu = JSON.stringify(menu);
      innerA.addEventListener("click", function () {
        const menuObj = JSON.parse(this.dataset.menu);
        openMenu(menuObj);
      });
      innerA.setAttribute("href", "javascript:void(0)");
      innerA.classList.add(
        "w3-bar-item",
        "w3-button",
        "w3-border-bottom",
        "w3-hover-light-grey"
      );
      innerA.innerText = menu.name;
      innerA.style.cssText = "font: .7em Arial, sans-serif; color:blue";
      div.appendChild(innerA);
    });
  });
});


// Menu Functions
window.openMenu = async function (menu) {
  const showImage = document.getElementById("showImage");
  const showName = document.getElementById("showName");
  const menuName = document.getElementById("menuName");
  const menuId = document.getElementById("menuId");
  const menuImage = document.getElementById("menuImage");
  const menuPrice = document.getElementById("menuPrice");
  const menuThaiName = document.getElementById("menuThaiName");
  const cateId = document.getElementById("menuCateId");
  const menuDescription = document.getElementById("menuDescription");
  const menuSpiceLevel = document.getElementById("menuSpiceLevel");

  const docRef = doc(db, `applebyline/${menu.id}`);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    showName.innerText = data.name;
    showImage.src = data.image;

    menuName.value = data.name;
    menuId.value = menu.id;
    menuImage.value = data.image;
    menuPrice.value = data.price;
    menuThaiName.value = data.thainame;
    cateId.value = data.category;
    menuDescription.value = data.description;
    menuSpiceLevel.value = data.spice_level;
  } else {
    alertify.error("Menu item not found.");
  }
};

window.updateItem = async function (btn) {
  const menuId = document.getElementById("menuId").value;
  const name = document.getElementById("menuName").value.trim();
  const description = document.getElementById("menuDescription").value.trim();
  const price = parseFloat(document.getElementById("menuPrice").value);

  const optionsWrapper = document.getElementById("optionsWrapper");
  const choicesWrapper = document.getElementById("choicesWrapper");

  console.log(menuId);

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


window.deleteItem = async function () {
  const menuId = document.getElementById("menuId").value;
  const docRef = doc(db, `applebyline/${menuId}`);

  alertify.confirm(
    "Removing",
    "Do you really want to delete this product?",
    async function () {
      try {
        await deleteDoc(docRef);
        location.reload();
        alertify.warning("Menu deleted!");
      } catch (error) {
        alertify.error("Error removing Menu: " + error.message);
      }
    },
    function () {
      alertify.error("Cancel");
    }
  );
};

window.addProduct = async function () {
  const f = document.getElementById("newProductForm");

  const data = {
    name: f.newMenuName.value,
    thainame: f.newMenuThainame.value,
    image: f.newMenuImage.value,
    price: f.newMenuPrice.value,
    spice_level: f.newMenuSpiceLevel.value,
    description: f.newMenuDescription.value,
    category: f.newMenuCate.value,
  };

  const colRef = collection(db, "applebyline");
  const snapshot = await getDocs(colRef);
  const docId = snapshot.size.toString();

  await setDoc(doc(colRef, docId), data);
  document.getElementById("id01").style.display = "none";
  alertify.success("Product successfully added.");
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

window.highlight = function (el) {
  const div = document.getElementById(el.id);
  if (div) div.classList.toggle("w3-show");
};

// Admin Route Protection
onAuthStateChanged(auth, (user) => {
  if (!user || user.email !== "prawatlaosomboon@gmail.com") {
    location.assign("login.html");
  }
});

// Logout
window.signMeOut = function () {
  signOut(auth).then(() => {
    location.assign("login.html");
  }).catch((error) => {
    alertify.error("Sign-out failed");
    console.error(error);
  });
};
