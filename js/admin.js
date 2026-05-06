
// admin.js
import { auth, db } from './firebaseConfig.js';
import {
  onAuthStateChanged,
  signOut
} from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js';

import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  deleteField
} from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js';

import { categories } from './utils.js';

function initNotifier() {
  if (!window.alertify || typeof window.alertify.set !== 'function') return;
  window.alertify.set('notifier', 'position', 'bottom-right');
  window.alertify.set('notifier', 'delay', 3);
}

initNotifier();

// 1️⃣ Admin Authentication Guard
onAuthStateChanged(auth, async user => {
  if (!user) return location.assign('login.html');
  const token = await user.getIdTokenResult();
  if (!token.claims.isAdmin) {
    notify('error', 'Access denied: Admins only');
    await signOut(auth);
    return location.assign('login.html');
  }
  populateCategories();
  initMenuListener();
});

// 2️⃣ Real-time Menu Fetch
function initMenuListener() {
  const q = query(collection(db, 'applebyline'), orderBy('order'));
  onSnapshot(q, snapshot => {
    const menus = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    renderSideNav(menus);
  });
}
function populateCategories() {
  const selects = [
    document.getElementById('newMenuCategory'),
    document.getElementById('menuCategory')
  ];

  selects.forEach(select => {
    select.innerHTML = '<option value="">-- Select Category --</option>';
    categories
      .slice()
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
      .forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.key;
        opt.textContent = cat.name;
        select.appendChild(opt);
      });
  });
}


// 3️⃣ Sidebar Rendering
function renderSideNav(menus) {
  const sideNav = document.getElementById('SidenavContainer');
  sideNav.innerHTML = '';
  categories
    .slice()
    .sort((a, b) => (a.order || 999) - (b.order || 999))
    .forEach(cat => {
      const items = menus.filter(m => m.category === cat.key);
      if (!items.length) return;

      const id = cat.key.replace(/\W+/g, '');
      const a = document.createElement('a');
      a.className = 'w3-bar-item w3-button';
      a.textContent = cat.name;
      a.innerHTML += '<i class="fa fa-caret-down w3-margin-left"></i>';
      a.onclick = () => toggleSection(id);

      const div = document.createElement('div');
      div.id = id;
      div.className = 'w3-hide w3-animate-left';

      items.forEach(menu => {
        const x = document.createElement('a');
        x.className = 'w3-bar-item w3-button w3-border-bottom w3-hover-light-grey';
        x.style.cssText = 'font:.7em Arial;color:blue';
        x.textContent = `[${menu.order ?? ''}] ${menu.name}`;
        x.onclick = () => openMenu(menu);
        div.appendChild(x);
      });

      sideNav.appendChild(a);
      sideNav.appendChild(div);
    });
}

function toggleSection(id) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('w3-hide');
}

// 4️⃣ Load item into form
async function openMenu(menu) {
  document.getElementById('createForm').style.display = 'none';
  const ref = doc(db, 'applebyline', menu.id);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    notify('error', 'Item not found');
    return;
  }

  const data = snap.data();
  document.getElementById('menuId').value = menu.id;
  document.getElementById('menuName').value = data.name || '';
  document.getElementById('menuDescription').value = data.description || '';
  document.getElementById('menuCategory').value = data.category || '';
  document.getElementById('menuPrice').value = data.price || '';
  document.getElementById('menuOrder').value = data.order ?? '';

  // Reset containers
  document.getElementById('optionsContainer').innerHTML = '';
  document.getElementById('choicesContainer').innerHTML = '';

  if (data.options) {
    toggleWrappers('options');
    Object.entries(data.options).forEach(([opt, p]) =>
      addOption(opt, p, data.thaioptions?.[opt])
    );
  } else if (data.choices) {
    toggleWrappers('choices');
    Object.entries(data.choices).forEach(([ch, p]) => addChoice(ch, p));
  } else {
    toggleWrappers('price');
  }
}

function toggleWrappers(type) {
  document.getElementById('optionsWrapper').style.display = type === 'options' ? 'block' : 'none';
  document.getElementById('choicesWrapper').style.display = type === 'choices' ? 'block' : 'none';
  document.getElementById('singlePriceWrapper').style.display = type === 'price' ? 'block' : 'none';
}

window.addOption = (name = '', price = '', thaiName = '') => {
  const container = document.getElementById('optionsContainer');
  const div = document.createElement('div');
  div.className = 'optionRow';
  div.innerHTML = `
    <input type="text" placeholder="Option name" value="${name}">
    <input type="text" placeholder="Thai name" value="${thaiName}">
    <input type="number" placeholder="Price" step="0.01" value="${price}">
    <button type="button" onclick="this.parentNode.remove()">🗑️</button>
  `;
  container.appendChild(div);
};

window.addChoice = (label = '', price = '') => {
  const container = document.getElementById('choicesContainer');
  const div = document.createElement('div');
  div.className = 'choiceRow';
  div.innerHTML = `
    <input type="text" placeholder="Choice label" value="${label}">
    <input type="number" placeholder="Price" step="0.01" value="${price}">
    <button type="button" onclick="this.parentNode.remove()">🗑️</button>
  `;
  container.appendChild(div);
};

window.addNewOption = (name = '', price = '', thaiName = '') => {
  const container = document.getElementById('newOptionsContainer');
  const div = document.createElement('div');
  div.className = 'optionRow';
  div.innerHTML = `
    <input type="text" placeholder="Option name" value="${name}">
    <input type="text" placeholder="Thai name" value="${thaiName}">
    <input type="number" placeholder="Price" step="0.01" value="${price}">
    <button type="button" onclick="this.parentNode.remove()">🗑️</button>
  `;
  container.appendChild(div);
};

window.addNewChoice = (label = '', price = '') => {
  const container = document.getElementById('newChoicesContainer');
  const div = document.createElement('div');
  div.className = 'choiceRow';
  div.innerHTML = `
    <input type="text" placeholder="Choice label" value="${label}">
    <input type="number" placeholder="Price" step="0.01" value="${price}">
    <button type="button" onclick="this.parentNode.remove()">🗑️</button>
  `;
  container.appendChild(div);
};




// 6️⃣ CRUD operations
function notify(type, message) {
  if (window.alertify && typeof window.alertify.notify === 'function') {
    const normalizedType = type === 'error' ? 'error' : 'success';
    window.alertify.notify(message, normalizedType, 3);
    return;
  }
  if (type === 'error') {
    alert(message);
  } else {
    console.log(message);
  }
}

window.createItem = async () => {
  try {
    const payload = buildPayloadFromForm('new');
    await addDoc(collection(db, 'applebyline'), payload);
    notify('success', 'New item saved successfully');
    if (typeof resetCreateForm === 'function') resetCreateForm();
  } catch (error) {
    console.error('Create failed:', error);
    notify('error', 'Could not save new item');
  }
};

window.updateItem = async () => {
  const id = document.getElementById('menuId').value;
  if (!id) return notify('error', 'Please select an item first');

  try {
    const payload = buildPayloadFromForm('menu');
    const ref = doc(db, 'applebyline', id);
    await updateDoc(ref, payload);
    notify('success', 'Menu item saved successfully');
  } catch (error) {
    console.error('Update failed:', error);
    notify('error', 'Could not save changes');
  }
};

window.deleteItem = async () => {
  const id = document.getElementById('menuId').value;
  if (!id) {
    notify('error', 'Please select an item first');
    return;
  }

  const executeDelete = async () => {
    try {
      const ref = doc(db, 'applebyline', id);
      await deleteDoc(ref);
      notify('success', 'Item deleted');
    } catch (error) {
      console.error('Delete failed:', error);
      notify('error', 'Could not delete item');
    }
  };

  if (window.alertify && typeof window.alertify.confirm === 'function') {
    window.alertify.confirm('Delete this item?', executeDelete, () => {});
    return;
  }

  if (confirm('Delete this item?')) {
    await executeDelete();
  }
};

function buildPayloadFromForm(prefix) {
  const isNewForm = prefix === 'new';
  const ids = {
    name: isNewForm ? 'newMenuName' : 'menuName',
    description: isNewForm ? 'newMenuDescription' : 'menuDescription',
    price: isNewForm ? 'newMenuPrice' : 'menuPrice',
    order: isNewForm ? 'newMenuOrder' : 'menuOrder',
    category: isNewForm ? 'newMenuCategory' : 'menuCategory',
    optionsContainer: isNewForm ? '#newOptionsContainer .optionRow' : '#optionsContainer .optionRow',
    choicesContainer: isNewForm ? '#newChoicesContainer .choiceRow' : '#choicesContainer .choiceRow'
  };

  const name = document.getElementById(ids.name)?.value.trim() || '';
  const description = document.getElementById(ids.description)?.value.trim() || '';
  const price = parseFloat(document.getElementById(ids.price)?.value) || 0;
  const order = parseInt(document.getElementById(ids.order)?.value) || 0;
  const category = document.getElementById(ids.category)?.value || '';

  const payload = {
    name,
    description,
    order,
    category
  };

  // Detect if options/choices are present
  const optionsRows = document.querySelectorAll(ids.optionsContainer);
  const choicesRows = document.querySelectorAll(ids.choicesContainer);

  if (optionsRows.length > 0) {
    const options = {};
    const thaioptions = {};
    optionsRows.forEach(row => {
      const [optName, thaiName, optPrice] = row.querySelectorAll('input');
      if (optName.value.trim()) {
        options[optName.value.trim()] = parseFloat(optPrice.value) || 0;
        thaioptions[optName.value.trim()] = thaiName.value.trim();
      }
    });
    payload.options = options;
    payload.thaioptions = thaioptions;
    payload.choices = deleteField();
    payload.price = deleteField();
  } else if (choicesRows.length > 0) {
    const choices = {};
    choicesRows.forEach(row => {
      const [label, chPrice] = row.querySelectorAll('input');
      if (label.value.trim()) {
        choices[label.value.trim()] = parseFloat(chPrice.value) || 0;
      }
    });
    payload.choices = choices;
    payload.options = deleteField();
    payload.thaioptions = deleteField();
    payload.price = deleteField();
  } else {
    payload.price = price;
    payload.options = deleteField();
    payload.thaioptions = deleteField();
    payload.choices = deleteField();
  }

  return payload;
}
window.resetCreateForm = () => {
  document.getElementById('createForm').reset();
  document.getElementById('newOptionsContainer').innerHTML = '';
  document.getElementById('newChoicesContainer').innerHTML = '';
};

window.toggleNewMenuForm = () => {
  const form = document.getElementById('createForm');
  if (form.style.display === 'none' || form.style.display === '') {
    form.style.display = 'block';
    window.resetCreateForm?.();
  } else {
    form.style.display = 'none';
  }
};



// 7️⃣ Logout
window.signMeOut = async () => {
  await signOut(auth);
  location.assign('login.html');
};
// Sidebar toggle for small screens
function w3_open() {
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("myOverlay").style.display = "block";
}

function w3_close() {
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("myOverlay").style.display = "none";
}
