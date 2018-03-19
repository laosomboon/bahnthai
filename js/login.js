 // Document on load.
 $(function() {
     initApp();


     $("#loginForm").submit(function(e) {
         event.preventDefault();


         if (firebase.auth().currentUser) {
             // [START signout]
             firebase.auth().signOut();
             // [END signout]
         } else {

             var email = document.getElementById('email');
             var password = document.getElementById('password');

             if (!password.value || !email.value || password.value.length < 4 || email.value.length < 4) {

                 alertify.error('Please check your Email and Password');
                 e.preventDefault();
                 this.reset();
             } else {
                 //
                 // localStorage.setItem("email", email);
                 // localStorage.setItem("password", password);

                 firebase.auth().signInWithEmailAndPassword(email.value, password.value).catch(function (error) {

                     // Handle Errors here.
                     var errorCode = error.code;
                     var errorMessage = error.message;
                     // [START_EXCLUDE]
                     if (errorCode === 'auth/wrong-password') {
                         alertify.error('Wrong password');
                     } else {
                         alertify.error(errorMessage);
                     }
                     // console.log(error);
                     // document.getElementById('quickstart-sign-in').disabled = false;
                     // [END_EXCLUDE]
                 });
                 // [END authwithemail]


             }


         }

     });





 });//end ready











 function initApp() {
     firebase.auth().onAuthStateChanged(function(user) {
         if (user) {
            location.assign('/admin.html');
         }
     });
 }

