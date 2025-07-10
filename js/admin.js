
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
  deleteDoc
} from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js';

import { categories } from './utils.js';

// 1️⃣ Admin Authentication Guard
onAuthStateChanged(auth, async user => {
  if (!user) return location.assign('login.html');
  const token = await user.getIdTokenResult();
  if (!token.claims.isAdmin) {
    alert('Access denied: Admins only!');
    await signOut(auth);
    return location.assign('login.html');
  }
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
  const ref = doc(db, 'applebyline', menu.id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return alert('Item not found');

  const data = snap.data();
  document.getElementById('menuId').value = menu.id;
  document.getElementById('menuName').value = data.name || '';
  document.getElementById('menuDescription').value = data.description || '';
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

// 5️⃣ Add option / choice helpers
// … (use your existing addOption/addChoice functions unchanged)

// 6️⃣ CRUD operations
window.createItem = async () => {
  const payload = buildPayloadFromForm('new');
  await addDoc(collection(db, 'applebyline'), payload);
  alert('New item created!');
  if (typeof resetCreateForm === 'function') resetCreateForm();
};

window.updateItem = async () => {
  const id = document.getElementById('menuId').value;
  if (!id) return alert('Please select an item.');
  const payload = buildPayloadFromForm('menu');
  const ref = doc(db, 'applebyline', id);
  await updateDoc(ref, payload);
  alert('Item updated!');
};

window.deleteItem = async () => {
  const id = document.getElementById('menuId').value;
  if (!id || !confirm('Delete this item?')) return;
  const ref = doc(db, 'applebyline', id);
  await deleteDoc(ref);
  alert('Item deleted.');
};

function buildPayloadFromForm(prefix) {
  // Extract values same as your old logic
  // Return payload object
}

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
