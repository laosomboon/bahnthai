 // Import the functions you need from the SDKs you need
  import { initializeApp} from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-analytics.js";
  import {getFireStore,collection,onSnapshot,query,orderBy } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js";
  import { getAuth, signOut} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
  import { firebaseConfig } from "./firebaseConfig.js";

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const db = getFireStore(app);
  const colRef = collection(db, "applebyline");
  const q = query(colRef, orderBy('order'));


 var menupack = [];



 
 onSnapshot(q, (snap) => {
     let menus = [];
     snap.docs.forEach(element => { 
         menus.push({...element.data(), id: element.id});
     });
     
      menupack.push({name:"Appetizers", items:menus.filter((e)=>{return e.category == "Appetizer"})});
      menupack.push({name:"Barbeque", items:menus.filter((e)=>{return e.category == "Barbeque"})});
      menupack.push({name:"Fish & Seafoods", items:menus.filter((e)=>{return e.category == "Fish & Seafood"})});
      menupack.push({name:"Lunch Specials",items:menus.filter((e)=>{return e.category == "Lunch Special"})});
      menupack.push({name:"Noodle Dishes", items: menus.filter((e)=>{return e.category == "Noodle Dishes"})});
      menupack.push({name:"Rice Dishes", items:menus.filter((e)=>{return e.category == "Rice Dishes"})});
      menupack.push({name:"Soups", items:menus.filter((e)=>{return e.category == "Soup"})});
      menupack.push({name:"Thai Desserts",items:menus.filter((e)=>{return e.category == "Specialty Thai Desserts"})});
      menupack.push({name:"Stir-fired Dishes", items:menus.filter((e)=>{return e.category == "Stir-fried Dishes"})});
      menupack.push({name:"Thai curries", items:menus.filter((e)=>{return e.category == "Thai Curries"})});
      menupack.push({name:"Thai Salads", items:menus.filter((e)=>{return e.category == "Thai Salads"})});
      menupack.push( {name:"Vegetable", items:menus.filter((e)=>{return e.category == "Vegetables"})});
      
      menupack.forEach((e)=>{

        let cateId = e.name.replace(/\s|(?!<a(.*)>(.*))(&amp;|&)/g,'');

        var a = document.createElement('a');
        a.setAttribute("id", cateId + "Btn");
        a.setAttribute("onclick", "highlight("+ cateId +")");
        a.setAttribute("href", "javascript:void(0)");
        a.classList.add('w3-bar-item');
        a.classList.add('w3-button');
        a.innerText = e.name;
        var i = document.createElement('i');
            i.classList.add("fa");
            i.classList.add("fa-caret-down");
            i.classList.add("w3-margin-left");
        a.appendChild(i);
        var div = document.createElement('div');
        div.setAttribute("id", cateId);
        div.classList.add("w3-hide");
        div.classList.add("w3-animate-left");
        var sideNav = document.getElementById("SidenavContainer");
            sideNav.appendChild(a);
            sideNav.appendChild(div);
        e.items.forEach(m=>{

        var innerA = document.createElement('a');
        innerA.setAttribute("id",m.id);
         innerA.setAttribute("onclick", 'openMenu('+JSON.stringify(m)+');w3_close();');
         innerA.setAttribute("href", "javascript:void(0)");
         innerA.classList.add('w3-bar-item');
         innerA.classList.add('w3-button');
         innerA.classList.add('w3-border-bottom');
         innerA.classList.add('w3-hover-light-grey');
         innerA.innerText = m.name;
         innerA.setAttribute("style","font: .7em Arial, sans-serif; color:blue");
        div.appendChild(innerA);
      
        });

      })
     
     });




 function toggleSignIn() {

  // const auth = getAuth(app);
  // signOut(auth)
  //   .then(() => {
  //     location.assign('/login.html');
  //   })
  //   .catch((error) => {
  //     const errorCode = error.code;
  //     const errorMessage = error.message;

  //   })

  // if (firebase.auth().currentUser) {
  //     // [START signout]
  //     firebase.auth().signOut();
  //     // [END signout]
  // } else {
  //     var email = document.getElementById('email').value;
  //     var password = document.getElementById('password').value;


  //     if (email.length < 4) {
  //         alertify.error('Please enter an email address.');
  //         return;
  //     }

  //     if (password.length < 4) {
  //         alertify.error('Please enter a password.');
  //         return;
  //     }


  //     firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {


  //         var errorCode = error.code;
  //         var errorMessage = error.message;

  //         if (errorCode === 'auth/wrong-password') {
  //             alertify.error('Wrong password');
  //         } else {
  //             alertity.error(errorMessage);
  //         }

  //     });

  // }

}

function w3_open() {
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("myOverlay").style.display = "block";
}

function w3_close() {
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("myOverlay").style.display = "none";
}

function highlight(e) {
  var id = e.id;
  var x = document.getElementById(id);
  if (x.className.indexOf("w3-show") == -1) {
      x.className += " w3-show";
      x.previousElementSibling.className += " w3-pale-green";
  } else {
      x.className = x.className.replace(" w3-show", "");
      x.previousElementSibling.className =
          x.previousElementSibling.className.replace(" w3-pale-green", "");
  }
}

function openMenu(menu) {

  var showImage = document.getElementById('showImage');
  var showName = document.getElementById('showName');
  var menuName = document.getElementById('menuName');
  var menuId = document.getElementById('menuId');
  var menuImage = document.getElementById('menuImage');
  var menuPrice = document.getElementById('menuPrice');
  var menuThaiName = document.getElementById('menuThaiName');
  var cateId = document.getElementById('menuCateId');
  var menuDescription = document.getElementById('menuDescription');
  var menuSpiceLevel = document.getElementById('menuSpiceLevel');

  var menuUrl = 'bahnthai-menus/' + menu.cateId.toString() + '/items';

  //var db = firebase.firestore();
  var db = firebase.firestore();


  db.collection(menuUrl).doc(menu.id.toString()).get().then(function(doc){

      showName.innerText = doc.data().name;
      showImage.src = doc.data().image;

      menuName.value = doc.data().name;
      menuId.value = doc.id;
      menuImage.value = doc.data().image;
      menuPrice.value = doc.data().price;
      menuThaiName.value = doc.data().thainame;
      cateId.value = menu.cateId;
      menuDescription.value = doc.data().description;
      menuSpiceLevel.value = doc.data().spice_level;

  }).catch(function(err){
     alertify.error(err);
  });

}

function updateItem(e){
  var db = firebase.firestore();
  var data = {};
  var menuId = document.getElementById('menuId').value.toString();
  var cateId = document.getElementById('menuCateId').value.toString();

  data.name = document.getElementById('menuName').value;
  data.image = document.getElementById('menuImage').value;
  data.price = document.getElementById('menuPrice').value;
  data.thainame = document.getElementById('menuThaiName').value;
  data.description = document.getElementById('menuDescription').value;
  data.spice_level = document.getElementById('menuSpiceLevel').value;



  var dbUrl = 'bahnthai-menus/' + cateId.toString() + '/items';

  db.collection(dbUrl).doc(menuId.toString()).set(data).then(function(){
      alertify.success('Successfully updated');
  }).catch(function(err){
      alertify.error(err);
  });

}

function deleteItem(e){

  var db = firebase.firestore();

  var menuId = document.getElementById('menuId').value;
  var cateId = document.getElementById('menuCateId').value;

  var dbUrl = 'applebyline/' + Id;

  alertify.confirm("Removing","Do you really want to delete this product?",
      function(){
          db.collection(dbUrl).doc(menuId.toString()).delete().then(function() {
              location.reload();
              alertify.warning("Menu deleted!");
          }).catch(function(error) {
              alertify.error("Error removing Menu: ", error);
          });
      },
      function(){
          alertify.error('Cancel');
      });



}

function addProduct(){

  var db = firebase.firestore();

  var f = document.getElementById('newProductForm');
  var data = {};
  data.name = f.newMenuName.value;
  data.thainame = f.newMenuThainame.value;
  data.image = f.newMenuImage.value;
  data.price = f.newMenuPrice.value;
  data.spicy_level = f.newMenuSpiceLevel.value;
  data.description = f.newMenuDescription.value;

  var url = "bahnthai-menus/" + f.newMenuCate.value.toString() + "/items";
  console.log(url);

  db.collection(url).get().then(function(snaps){
      db.collection(url).doc(snaps.size.toString()).set(data).then(function(){
          document.getElementById('id01').style.display='none';
          alertify.success("Product successfully added.");
      }).catch(function(err){
          alertify.error(err.message);
      });
  });


  //
}

function addBulk(){

  $.getJSON("data.json", function(result){
      $.each(result, function(n, cate){

          db.collection("bahnthai-menus").doc(n.toString()).set({name:cate.category});
          var subCol = 'bahnthai-menus/' + n + '/items';

          $.each(cate.menus, function(i, item){
              db.collection(subCol).doc(i.toString()).set(item);
          });
      });
  });
}


 