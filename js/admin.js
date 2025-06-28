
// Category definitions
const categories = [
  { name: "Appetizers", key: "Appetizer", order: 1 },
  { name: "Barbeque", key: "Barbeque", order: 4 },
  { name: "Fish & Seafoods", key: "Fish & Seafood", order: 6 },
  { name: "Lunch Specials", key: "Lunch Special", order: 10 },
  { name: "Noodle Dishes", key: "Noodle Dishes", order: 8 },
  { name: "Rice Dishes", key: "Rice Dishes", order: 9 },
  { name: "Soups", key: "Soup", order: 2 },
  { name: "Thai Desserts", key: "Specialty Thai Desserts", order: 11 },
  { name: "Stir‑fried Dishes", key: "Stir‑fried Dishes", order: 5 },
  { name: "Thai curries", key: "Thai Curries", order: 4 },
  { name: "Thai Salads", key: "Thai Salads", order: 3 },
  { name: "Vegetable", key: "Vegetables", order: 7 },
];


// Enforce admin access
firebase.auth().onAuthStateChanged(async (user) => {
  if (!user) return window.location.assign('login.html');
  const token = await user.getIdTokenResult();
  if (!token.claims.isAdmin) {
    alert('Access denied: Admins only!');
    await firebase.auth().signOut();
    return window.location.assign('login.html');
  }
  initMenuListener();
});

// Real‑time menu listener
function initMenuListener() {
  firebase.firestore().collection('applebyline').orderBy('order')
    .onSnapshot(snapshot => {
      const menus = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      renderSideNav(menus);
    });
}

// Sidebar rendering
function renderSideNav(menus) {
  const sideNav = document.getElementById('SidenavContainer');
  sideNav.innerHTML = '';
  const sorted = categories.slice().sort((a, b) => (a.order || 999) - (b.order || 999));

  sorted.forEach(cat => {
    const items = menus.filter(m => m.category === cat.key);
    if (!items.length) return;
    const id = cat.key.replace(/\W+/g, '');

    const a = document.createElement('a');
    a.className = 'w3-bar-item w3-button';
    a.textContent = cat.name;
    a.onclick = () => toggleSection(id);
    a.innerHTML += '<i class="fa fa-caret-down w3-margin-left"></i>';

    const div = document.createElement('div');
    div.id = id;
    div.className = 'w3-hide w3-animate-left';

    items.forEach(menu => {
      const x = document.createElement('a');
      x.className = 'w3-bar-item w3-button w3-border-bottom w3-hover-light-grey';
      x.style.cssText = 'font:.7em Arial;color:blue';
      x.textContent = menu.name;
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

// Load selected menu into form
async function openMenu(menu) {
  const docSnap = await firebase.firestore().doc(`applebyline/${menu.id}`).get();
  if (!docSnap.exists) return alert('Item not found');
  const data = docSnap.data();
  document.getElementById('menuId').value = menu.id;
  document.getElementById('menuName').value = data.name || '';
  document.getElementById('menuDescription').value = data.description || '';
  document.getElementById('menuPrice').value = data.price || '';
  document.getElementById('optionsContainer').innerHTML = '';
  document.getElementById('choicesContainer').innerHTML = '';

  if (data.options) {
    document.getElementById('optionsWrapper').style.display = 'block';
    document.getElementById('choicesWrapper').style.display = 'none';
    document.getElementById('singlePriceWrapper').style.display = 'none';
    Object.entries(data.options).forEach(([opt, p]) => addOption(opt, p, data.thaioptions?.[opt]));
  } else if (data.choices) {
    document.getElementById('optionsWrapper').style.display = 'none';
    document.getElementById('choicesWrapper').style.display = 'block';
    document.getElementById('singlePriceWrapper').style.display = 'none';
    Object.entries(data.choices).forEach(([ch, p]) => addChoice(ch, p));
  } else {
    document.getElementById('optionsWrapper').style.display = 'none';
    document.getElementById('choicesWrapper').style.display = 'none';
    document.getElementById('singlePriceWrapper').style.display = 'block';
  }
}

// UI helper for options/choices
function addOption(name = '', price = '', thaiName = '') {
  const container = document.getElementById('optionsContainer');
  const i = container.children.length;
  const div = document.createElement('div');
  div.className = 'option-block';
  div.innerHTML = `
    <input name="optionName-${i}" value="${name}" placeholder="Option Name" />
    <input type="number" name="optionPrice-${i}" step="0.01" value="${price}" placeholder="Price" />
    <input name="thaiOption-${i}" value="${thaiName}" placeholder="Thai Name" />
    <button onclick="this.parentElement.remove()">Remove</button>
    <hr />
  `;
  container.appendChild(div);
}
function addChoice(name = '', price = '') {
  const container = document.getElementById('choicesContainer');
  const i = container.children.length;
  const div = document.createElement('div');
  div.className = 'choice-block';
  div.innerHTML = `
    <input name="choiceName-${i}" value="${name}" placeholder="Choice Label" />
    <input type="number" name="choicePrice-${i}" step="0.01" value="${price}" placeholder="Price" />
    <button onclick="this.parentElement.remove()">Remove</button>
    <hr />
  `;
  container.appendChild(div);
}

// Update item
window.updateItem = async () => {
  const id = document.getElementById('menuId').value;
  if (!id) return alert('Please select an item.');

  const payload = {
    name: document.getElementById('menuName').value.trim(),
    description: document.getElementById('menuDescription').value.trim(),
    order: Date.now(),
  };

  if (document.getElementById('optionsWrapper').style.display === 'block') {
    payload.options = {};
    payload.thaioptions = {};
    document.querySelectorAll('#optionsContainer .option-block').forEach(div => {
      const nm = div.querySelector('input[name^="optionName-"]').value.trim();
      const pr = parseFloat(div.querySelector('input[name^="optionPrice-"]').value);
      const th = div.querySelector('input[name^="thaiOption-"]').value.trim();
      if (nm && !isNaN(pr)) {
        payload.options[nm] = pr;
        if (th) payload.thaioptions[nm] = th;
      }
    });
  } else if (document.getElementById('choicesWrapper').style.display === 'block') {
    payload.choices = {};
    document.querySelectorAll('#choicesContainer .choice-block').forEach(div => {
      const nm = div.querySelector('input[name^="choiceName-"]').value.trim();
      const pr = parseFloat(div.querySelector('input[name^="choicePrice-"]').value);
      if (nm && !isNaN(pr)) payload.choices[nm] = pr;
    });
  } else {
    const pr = parseFloat(document.getElementById('menuPrice').value);
    if (!isNaN(pr)) payload.price = pr;
  }

  await firebase.firestore().doc(`applebyline/${id}`).update(payload);
  alert('Item updated!');
};

// Delete item
window.deleteItem = async () => {
  const id = document.getElementById('menuId').value;
  if (!id || !confirm('Delete this item?')) return;
  await firebase.firestore().doc(`applebyline/${id}`).delete();
  alert('Item deleted.');
};

// Create new item
window.createItem = async () => {
  const name = document.getElementById('newMenuName').value.trim();
  const category = document.getElementById('newMenuCategory').value;
  const description = document.getElementById('newMenuDescription').value.trim();
  const price = parseFloat(document.getElementById('newMenuPrice').value);

  if (!name || !category) return alert('Name & Category are required.');

  const payload = { name, category, description, order: Date.now() };

  document.querySelectorAll('#newOptionsContainer .newOptionName').forEach((_, i) => {
    const nm = document.getElementsByClassName('newOptionName')[i].value.trim();
    const th = document.getElementsByClassName('newThaiName')[i].value.trim();
    const pr = parseFloat(document.getElementsByClassName('newOptionPrice')[i].value);
    if (nm && !isNaN(pr)) {
      payload.options = payload.options || {};
      payload.thaioptions = payload.thaioptions || {};
      payload.options[nm] = pr;
      payload.thaioptions[nm] = th;
    }
  });

  document.querySelectorAll('#newChoicesContainer .newChoiceName').forEach((_, i) => {
    const nm = document.getElementsByClassName('newChoiceName')[i].value.trim();
    const pr = parseFloat(document.getElementsByClassName('newChoicePrice')[i].value);
    if (nm && !isNaN(pr)) {
      payload.choices = payload.choices || {};
      payload.choices[nm] = pr;
    }
  });

  if (!payload.options && !payload.choices && !isNaN(price)) payload.price = price;

  await firebase.firestore().collection('applebyline').add(payload);
  alert('New item created!');
  if (typeof resetCreateForm === 'function') resetCreateForm();
};



// Logout
window.signMeOut = function() {
  auth.signOut()
    .then(() => {
      // Optionally display a message or redirect on successful logout
      location.assign("login.html");
    })
    .catch(error => {
      alertify.error("Sign-out failed");
      console.error("Error signing out:", error);
    });
};



function formatPrice(price) {
  if (typeof price !== 'number') {
    // Try to convert price to number
    price = Number(price);
    if (isNaN(price)) {
      throw new Error('Invalid price value');
    }
  }
  return `$${price.toFixed(2)}`;
}




async function generateStyledMenuPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Sort categories by order
  categories.sort((a, b) => a.order - b.order);

  // Set title of the PDF
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text('Bahn Thai Menu', 14, 20);

  let y = 30;

  // Retrieve Firestore menu items
  const snapshot = await firebase.firestore().collection('applebyline')
                           .orderBy('order')
                           .get();
  const items = snapshot.docs.map(d => d.data());

  // Insert each item by category (sorted order)
  const catMap = {};
  items.forEach(item => {
    (catMap[item.category] ||= []).push(item);
  });

  categories.forEach(cat => {
    const group = catMap[cat.key];
    if (!group) return;

    // Category title with custom style (underlined and green)
    doc.setFontSize(16);
    doc.setTextColor(0, 128, 0); // Green color for category
    doc.text(cat.name, 14, y);
    doc.setLineWidth(0.5);
    doc.line(14, y + 2, 195, y + 2); // Underline category name
    y += 8;

    // Reset the text color for the menu items (black)
    doc.setTextColor(0); 

    // Loop through items within a category
    group.forEach(item => {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'normal');
      
      let priceStr = '';
      let itemName = '';

      // If the item has options, display the option name with the price
      if (item.options) {
        Object.entries(item.options).forEach(([opt, price]) => {
          itemName = opt; // Use option name instead of item name
          priceStr = `${formatPrice(price)}`;
          
          // Set green color for option names
          doc.setTextColor(0, 128, 0);
          doc.text(itemName, 16, y); // Option name aligned left
          doc.setTextColor(0); // Reset text color for price
          doc.text(priceStr, 170, y, { align: 'right' }); // Option price aligned right
          y += 7;
        });
      } else if (item.name) {
        // Regular menu item name (if no options)
        itemName = item.name;
        doc.setTextColor(0, 128, 0); // Set green color for item name
        doc.text(itemName, 16, y); // Menu item name
        y += 5;
        
        if (item.price) {
          priceStr = formatPrice(item.price);
          doc.setTextColor(0); // Reset text color for price
          doc.text(priceStr, 170, y, { align: 'right' }); // Price aligned right
          y += 7;
        }
      }

      // If the item has choices, list them separately (green)
      if (item.choices) {
        doc.setFontSize(12);
        doc.setTextColor(0, 128, 0); // Green color for "Choices:"
        doc.text('Choices:', 18, y);
        y += 5;

        // Adjust the font size and position for choices
        Object.entries(item.choices).forEach(([choice, price]) => {
          const choiceText = `${choice}: ${formatPrice(price)}`;
          doc.text(choiceText, 18, y);
          y += 5;
        });

        doc.setTextColor(0); // Reset text color to black after choices
      }

      // Add description if available
      if (item.description && typeof item.description === 'string') {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(100); // Light gray color for description
        const lines = doc.splitTextToSize(item.description, 170);
        lines.forEach(line => {
          doc.text(line, 18, y);
          y += 5;
        });
        doc.setFontSize(12).setTextColor(0); // Reset font and color
      }

      // If page exceeds 270 (bottom of the page), add a new page
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    y += 10;
  });

  // Trigger download of the PDF
  const fileName = `BahnThaiMenu_${Date.now()}.pdf`;
  doc.save(fileName);
}

// Hook the button for generating the PDF
document.getElementById('generatePdfBtn').addEventListener('click', generateStyledMenuPDF);
