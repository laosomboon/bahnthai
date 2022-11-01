import { getAuth, signOut} from "https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import { firebaseConfig } from "./firebaseConfig.js";
  
  
  $('#date').datetimepicker();
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

   auth.onAuthStateChanged(function(user) {
    if (!user) {
      location.assign('/login.html');
     }else{

            //     const db = getFirestore(app);
            //     const colRef = collection(db, "applebyline");
                
            //     const q = query(colRef, orderBy('order'));
                
            //     onSnapshot(q, (snap) => {
            //         let menus = [];
            //         snap.docs.forEach(element => { 
            //             menus.push({...element.data(), id: element.id});
            //         });
                
            //         menus.forEach((menu) =>{

     
            //         });
                   
            //     });
            }

    });
                //
                // var dbRef =  db.collection("bahnthai-menus").where("name","!", "").orderBy("name").onSnapshort(function(snaps){
                //             snaps.docChanges.forEach(function(i){
                //                 console.log(i.name);
                //             });
                //  });



        //          db.collection("bahnthai-menus").get().then(function(snap) {

        //              snap.forEach(function (doc) {

                        

        //                  var cate = doc.data();
        //                  var id = doc.id;
        //                  var cateId = "cate"+ doc.id;

        //                  var a = document.createElement('a');
        //                  a.setAttribute("id", cateId + "Btn");
        //                  a.setAttribute("onclick", "highlight("+ cateId +")");
        //                  a.setAttribute("href", "javascript:void(0)");
        //                  a.classList.add('w3-bar-item');
        //                  a.classList.add('w3-button');
        //                  a.innerText = cate.name;

        //                  var i = document.createElement('i');
        //                  i.classList.add("fa");
        //                  i.classList.add("fa-caret-down");
        //                  i.classList.add("w3-margin-left");

        //                  a.appendChild(i);


        //                  var div = document.createElement('div');
        //                  div.setAttribute("id", cateId);
        //                  div.classList.add("w3-hide");
        //                  div.classList.add("w3-animate-left");

        //                  var sideNav = document.getElementById("SidenavContainer");

        //                  sideNav.appendChild(a);
        //                  sideNav.appendChild(div);



        //                  var subCollection = 'bahnthai-menus/' + id + '/items';

        //                  db.collection(subCollection).get().then(function(snap) {

        //                      snap.forEach(function (doc) {

        //                          var menu = doc.data();

        //                          menu.cateId = id;

        //                          menu.id = doc.id;


        //                          var innerA = document.createElement('a');
        //                          innerA.setAttribute("id", cateId + "Tab");
        //                          innerA.setAttribute("onclick", 'openMenu('+JSON.stringify(menu)+');w3_close();');
        //                          innerA.setAttribute("href", "javascript:void(0)");
        //                          innerA.classList.add('w3-bar-item');
        //                          innerA.classList.add('w3-button');
        //                          innerA.classList.add('w3-border-bottom');
        //                          innerA.classList.add('w3-hover-light-grey');
        //                          // innerA.innerText = menu.name;



        //                          var innerDiv = document.createElement('div');
        //                          innerDiv.classList.add('w3-container');


        //                          // var img = document.createElement('img');
        //                          // img.classList.add('w3-round');
        //                          // img.classList.add('w3-margin-right');
        //                          // img.setAttribute("src", menu.image);
        //                          // img.setAttribute("style", "width:20%;");

        //                          var nameSpan = document.createElement('span');
        //                          nameSpan.classList.add('w3-opacity');
        //                          nameSpan.classList.add('w3-small');
        //                          nameSpan.innerText = menu.name;



        //                          // innerDiv.appendChild(img);
        //                          innerDiv.appendChild(nameSpan);
        //                          innerA.appendChild(innerDiv);
        //                          div.appendChild(innerA);


        //                      });
        //                  });



        //              });


        //          });



        //          window.addEventListener("beforeunload", function (e) {
        //              var confirmationMessage = "Do you really want to close browser?";
        //              console.log(confirmationMessage);
        //          });

        //      }


 function signMeOut(){
    location.assign('login.html');
   }


