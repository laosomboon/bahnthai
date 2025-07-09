
  // Import the functions you need from the SDKs you need
  import { jsPDF } from "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-analytics.js";
  import { getFirestore, collection, getDocs,onSnapshot,addDoc,deleteDoc,query,where,orderBy } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js";
  import {getAuth} from "https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js";
  const firebaseConfig = {
    apiKey: "AIzaSyBFGsDVtTUs6_nB8nfaW5EhceJ7BlE3_F4",
    authDomain: "bahnthai-2ea23.firebaseapp.com",
    projectId: "bahnthai-2ea23",
    storageBucket: "bahnthai-2ea23.firebasestorage.app",
    messagingSenderId: "134991899936",
    appId: "1:134991899936:web:525833efd42d3f36b83b45",
    measurementId: "G-Z3L1GBGT5B"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth(app);


function sortOptions(options){
    let sortable = [];
    for (var k in options) {
        sortable.push({key:k, value:options[k]});
    }   
    sortable.sort(function(a, b) {
        return a.value - b.value;
    });
    return sortable;
}
function sortByName(options){
   let sortable = [];
   for (var k in options){
     if(k.includes("Chicken") && !k.includes("Shrimp")){
        sortable.push({order:1,key:k, value:options[k]});
     }else if(k.includes("Beef")){
        sortable.push({order:2,key:k, value:options[k]});
     }else if(k.includes("Shrimp") && k.includes("Chicken")){
        sortable.push({order:3,key:k, value:options[k]});
     }else if(k.includes("Shrimp") || k.includes("Prawn") || k.includes("Shrimps") && !k.includes("Chicken")){
        sortable.push({order:4,key:k, value:options[k]});
     }else if(k.includes("Seafood")){
        sortable.push({order:6,key:k, value:options[k]});
     }else{
        console.log(k);
     }
   }
   sortable.sort((a, b)=>{return a.order - b.order});
   return sortable;
}

function createMenuElement(id, menu) {

    var div = document.createElement('div');
    div.classList.add('mix');
    div.classList.add(id);
    div.classList.add('col-xs-12');
    div.classList.add('col-sm-12');
    div.classList.add('col-md-12');
    div.classList.add('menu-restaurant');
    div.setAttribute('data-cat', id);


    var spanWrapper = document.createElement('span');
    spanWrapper.classList.add('clearfix');

    var a = document.createElement('a');
    a.setAttribute("class", "menu-title");
    a.setAttribute("data-meal-img", menu.image);

    a.innerHTML = "";

    var priceSpan = document.createElement('span');
    priceSpan.setAttribute("class", "menu-price");
    priceSpan.innerHTML = "";

     // Read sortOptions function for more details

    if(menu.choices){
        let menuSorted = sortOptions(menu.choices);
        a.innerHTML += `${menu.name}<br>`;
        priceSpan.innerHTML +="<br>";
        menuSorted.forEach(e=>{
            a.innerHTML += `<span style="font-size:.8em;">${e.key}</span><br>`;
            priceSpan.innerHTML += `${e.value}<br>`;
        });

    }else if(menu.price){
        a.innerHTML += `${menu.name} <span class="thainame">${menu.thainame?menu.thainame:""}</span>`;
        priceSpan.innerHTML += menu.price;
    }else if(menu.options){
        let names = sortByName(menu.options);
        let thainames = sortByName(menu.thaioptions);
        menu.options = names;
        menu.thaioptions = thainames;
        for(let i = 0; i < menu.options.length;i++ ){
            a.innerHTML +=  `${menu.options[i].key} <span class="thainame">${menu.thaioptions[i].value}<span><br>`;
            priceSpan.innerHTML += `${menu.options[i].value}<br>`;
        }


    }else{
        console.log(menu.order);
    }

    var lineSpan = document.createElement('span');
    lineSpan.setAttribute("style", "left:166px; right: 44px;");
    lineSpan.setAttribute("class", "menu-line");


    var subtitleSpan = document.createElement("span");
    subtitleSpan.setAttribute("class", "menu-subtitle");
    subtitleSpan.innerHTML = (menu.description?menu.description:"");

    spanWrapper.appendChild(a);
    spanWrapper.appendChild(lineSpan);
    spanWrapper.appendChild(priceSpan);

    div.appendChild(spanWrapper);
    div.appendChild(subtitleSpan);

    return div;
}



/*Fetch Menu from Firebase*/
 // const dbRefObject = firebase.database().ref().child('allmenus');
 const db = getFirestore();
const colRef = collection(db, "applebyline");

const q = query(colRef, orderBy('order'));

onSnapshot(q, (snap) => {
    let menus = [];
    snap.docs.forEach(element => { 
        menus.push({...element.data(), id: element.id});
    });

    menus.forEach((menu) =>{

        let id = menu.category.replace(/\s|(?!<a(.*)>(.*))(&amp;|&)/g,'');
        let elem = createMenuElement(id ,menu);
        let menuContainer = document.getElementById('Container');
                if (elem) {
                    menuContainer.appendChild(elem);
                }  
    });




// function formatPrice(price) {
//   if (typeof price !== 'number') {
//     // Try to convert price to number
//     price = Number(price);
//     if (isNaN(price)) {
//       throw new Error('Invalid price value');
//     }
//   }
//   return `$${price.toFixed(2)}`;
// }





export function generateStyledMenuPDF() {
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text("Bahn Thai Menu", 20, 20);

    const menuContainer = document.getElementById("Container");
    if (!menuContainer) {
        alert("Menu container not found!");
        return;
    }

    let y = 30;
    const items = menuContainer.querySelectorAll(".menu-restaurant");

    if (!items.length) {
        alert("No menu items found!");
        return;
    }

    items.forEach(item => {
        const title = item.querySelector(".menu-title")?.textContent?.trim() || "";
        const price = item.querySelector(".menu-price")?.textContent?.trim() || "";
        const description = item.querySelector(".menu-subtitle")?.textContent?.trim() || "";

        if (y > 270) {  // Prevent printing off the page
            doc.addPage();
            y = 20;
        }

        doc.setFontSize(14);
        doc.text(title, 20, y);
        doc.text(price, 160, y, { align: 'right' });
        y += 6;

        if (description) {
            doc.setFontSize(11);
            const lines = doc.splitTextToSize(description, 170);
            doc.text(lines, 20, y);
            y += lines.length * 5;
        } else {
            y += 4;
        }
    });

    doc.save("bahnthai_menu.pdf");
}
