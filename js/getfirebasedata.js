
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-analytics.js";
  import { getFirestore, collection, getDocs,onSnapshot,addDoc,deleteDoc,query,where,orderBy } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyAef28MOvO7MHVZZJBvIYY7UI_oetbf85Q",
    authDomain: "bahnthai-menu.firebaseapp.com",
    projectId: "bahnthai-menu",
    storageBucket: "bahnthai-menu.appspot.com",
    messagingSenderId: "740062677914",
    appId: "1:740062677914:web:33d96138433e5bb0f8c823",
    measurementId: "G-J6SKHHHYRX"
  };
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);


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
        a.innerHTML += menu.name;
        priceSpan.innerHTML += menu.price;
    }else if(menu.options){

        let menuSorted = sortOptions(menu.options);
        menuSorted.forEach(e=>{
            a.innerHTML += `${e.key}<br>`;
            priceSpan.innerHTML += `${e.value}<br>`;
        });

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








    
    // snap.forEach(function (doc) {

    //     var cateId = "cate"+ doc.id;

    //         var subCol = 'bahnthai-menus/' + doc.id.toString()+ '/items';

    //         db.collection(subCol).get().then(function(menuSnap){

    //             menuSnap.forEach(function(menuDoc){

    //                 var menu = menuDoc.data();

    //                 var elem = createMenuElement(cateId , menu.name, menu.price, menu.description, menu.image);

    //                 var menuContainer = document.getElementById('Container');

    //                 if (elem) {
    //                     menuContainer.appendChild(elem);
    //                 }
    //             });

    //         });


    //     });
    });

//
// dbRefObject.on('value', function(snap) {
//     allmenus = snap.val();
//     allmenus.forEach(function(c) {
//
//         var menus = c.menus;
//
//         menus.forEach(function(menuItem) {
//
//             var elem = createMenuElement(c.icon, menuItem.name, menuItem.burlington, menuItem.description, menuItem.image);
//             var menuContainer = document.getElementById('Container');
//             if (elem) {
//                 menuContainer.appendChild(elem);
//             }
//         });
//     });
//
// });













//   var db = firebase.firestore();

//   // lsconsole.log(db.collection("menus"));

//   var menus = db.collection("menus") .orderBy("order", "asc");
//   var appPanel = $('#appPanel');
//   var sPanel = $('#sPanel');
//   var curryPanel = $('#curryPanel');
//   var stirfriedPanel = $('#stirfriedPanel');
//   var noodlePanel = $('#noodlePanel');
//   var dessertPanel = $('#dessertPanel');
//   var lunchPanel = $('#lunchPanel');
//   var sideDishPanel = $('#sideDishPanel');

//   menus.get().then((querySnapshot) => {
// 		querySnapshot.forEach((doc) => {
//       // var row = $('div.row');
//       if(!doc.data().active)return;

//       if(doc.data().category === 'Appetizer'){
//         var item = createMenuElement(doc);
//         item.style.visibility = 'visible';
//         item.style.opacity = 1;
//        appPanel.append(item);
//       }else if(doc.data().category === 'Soup' || doc.data().category === 'Salad'){
//         var item = createMenuElement(doc);
//         item.style.visibility = 'visible';
//         item.style.opacity = 1;
//         sPanel.append(item);   
//     }else if(doc.data().category === 'Thai Curries' || doc.data().category === 'Grill'){
//         var item = createMenuElement(doc);
//         item.style.visibility = 'visible';
//         item.style.opacity = 1;
//         curryPanel.append(item);   
//     }else if(doc.data().category === 'Stir-fried' || doc.data().category === 'Fish & Seafood'){
//         var item = createMenuElement(doc);
//         item.style.visibility = 'visible';
//         item.style.opacity = 1;
//         stirfriedPanel.append(item);   
//     }else if(doc.data().category === 'Noodles' || doc.data().category === 'Rice Dishes'){
//         var item = createMenuElement(doc);
//         item.style.visibility = 'visible';
//         item.style.opacity = 1;
//         noodlePanel.append(item);   
//     }else if(doc.data().category === 'Thai Desserts'){
//         var item = createMenuElement(doc);
//         item.style.visibility = 'visible';
//         item.style.opacity = 1;
//         dessertPanel.append(item);
//     }else if(doc.data().category === 'Lunch'){
//         var item = createMenuElement(doc);
//         item.style.visibility = 'visible';
//         item.style.opacity = 1;
//         lunchPanel.append(item);   
//     }else {
//           var item = createMenuElement(doc);
//           item.style.visibility = 'visible';
//           item.style.opacity = 1;
//           sideDishPanel.append(item);        
//       }  

//     });

//     // console.log($('.site-animation'));
//   });




//   function createMenuElement(doc) {

//     var outerDiv = document.createElement('div');
//     outerDiv.classList.add('media');
//     outerDiv.classList.add('menu-item');
//     outerDiv.classList.add('col-md-6');
//     outerDiv.classList.add('site-animate');
//     var innerDiv = document.createElement('div');
//     innerDiv.classList.add('media-body');
//     var h5 = document.createElement('h5');
//     h5.classList.add('mt-0');
//     var p = document.createElement('p');
//     var h6 = document.createElement('h6');
//     h6.classList.add('text-primary');
//     h6.classList.add('menu-item-price');   
//         p.innerHTML = doc.data().description?doc.data().description:'';
//         var choices = doc.data().choices;
//         if(choices){
//           if(doc.data().category === 'Side Dishes'){
//             outerDiv.classList.remove('col-md-6');
//             outerDiv.classList.add('col-md-12');
//             choices = choices[0];
//           }
//           for (var prop in choices) {
//             // skip loop if the property is from prototype
//             if (!choices.hasOwnProperty(prop)) continue;
    
//             h6.innerHTML += doc.data().category === 'Side Dishes' ?`${prop}&nbsp;&nbsp;${choices[prop]} <br />`:`  |  ${prop}:${choices[prop]}`;
//         }
//         }else{
//           h6.innerHTML = doc.data().price;
//         }
        
//         h5.innerHTML = doc.data().name;
//         innerDiv.appendChild(h5);
//         innerDiv.appendChild(p);
//         innerDiv.appendChild(h6);
//         outerDiv.appendChild(innerDiv);

//         return outerDiv;

// }


  