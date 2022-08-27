 db = firebase.firestore();

// Document on load.
 $(function() {

        // var db = firebase.firestore();

         firebase.auth().onAuthStateChanged(function(user) {
             if (!user) {
                 location.assign('/login.html');
             }else{

                //
                // var dbRef =  db.collection("bahnthai-menus").where("name","!", "").orderBy("name").onSnapshort(function(snaps){
                //             snaps.docChanges.forEach(function(i){
                //                 console.log(i.name);
                //             });
                //  });





                 db.collection("bahnthai-menus").get().then(function(snap) {

                     snap.forEach(function (doc) {



                         var cate = doc.data();
                         var id = doc.id;
                         var cateId = "cate"+ doc.id;

                         var a = document.createElement('a');
                         a.setAttribute("id", cateId + "Btn");
                         a.setAttribute("onclick", "highlight("+ cateId +")");
                         a.setAttribute("href", "javascript:void(0)");
                         a.classList.add('w3-bar-item');
                         a.classList.add('w3-button');
                         a.innerText = cate.name;

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



                         var subCollection = 'bahnthai-menus/' + id + '/items';

                         db.collection(subCollection).get().then(function(snap) {

                             snap.forEach(function (doc) {

                                 var menu = doc.data();

                                 menu.cateId = id;

                                 menu.id = doc.id;


                                 var innerA = document.createElement('a');
                                 innerA.setAttribute("id", cateId + "Tab");
                                 innerA.setAttribute("onclick", 'openMenu('+JSON.stringify(menu)+');w3_close();');
                                 innerA.setAttribute("href", "javascript:void(0)");
                                 innerA.classList.add('w3-bar-item');
                                 innerA.classList.add('w3-button');
                                 innerA.classList.add('w3-border-bottom');
                                 innerA.classList.add('w3-hover-light-grey');
                                 // innerA.innerText = menu.name;



                                 var innerDiv = document.createElement('div');
                                 innerDiv.classList.add('w3-container');


                                 // var img = document.createElement('img');
                                 // img.classList.add('w3-round');
                                 // img.classList.add('w3-margin-right');
                                 // img.setAttribute("src", menu.image);
                                 // img.setAttribute("style", "width:20%;");

                                 var nameSpan = document.createElement('span');
                                 nameSpan.classList.add('w3-opacity');
                                 nameSpan.classList.add('w3-small');
                                 nameSpan.innerText = menu.name;



                                 // innerDiv.appendChild(img);
                                 innerDiv.appendChild(nameSpan);
                                 innerA.appendChild(innerDiv);
                                 div.appendChild(innerA);


                             });
                         });



                     });


                 });



                 window.addEventListener("beforeunload", function (e) {
                     var confirmationMessage = "Do you really want to close browser?";
                     console.log(confirmationMessage);
                 });

             }
         });




 });//end ready







 /**
  * Handles the sign in button press.
  */
 function toggleSignIn() {
     if (firebase.auth().currentUser) {
         // [START signout]
         firebase.auth().signOut();
         // [END signout]
     } else {
         var email = document.getElementById('email').value;
         var password = document.getElementById('password').value;


         if (email.length < 4) {
             alertify.error('Please enter an email address.');
             return;
         }

         if (password.length < 4) {
             alertify.error('Please enter a password.');
             return;
         }


         firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {


             var errorCode = error.code;
             var errorMessage = error.message;

             if (errorCode === 'auth/wrong-password') {
                 alertify.error('Wrong password');
             } else {
                 alertity.error(errorMessage);
             }

         });

     }

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

     var dbUrl = 'bahnthai-menus/' + cateId + '/items';

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