// // Document on load.
// $(function () {
//     initApp();

//     $("#loginForm").submit(function (e) {
//         e.preventDefault();

//         var email = document.getElementById('email');
//         var password = document.getElementById('password');

//         if (!email.value || !password.value || email.value.length < 4 || password.value.length < 4) {
//             alertify.error('Please check your Email and Password');
//             this.reset();
//             return;
//         }

//         firebase.auth().signInWithEmailAndPassword(email.value, password.value)
//             .then(function (userCredential) {
//                 var user = userCredential.user;

//                 // Optionally check email against allowed list before writing to Firestore
//                 const allowedEmails = ["ssmarnpharb58@gmail.com", "laosomboon@gmail.com"];
//                 if (!allowedEmails.includes(user.email)) {
//                     alertify.error("Unauthorized email");
//                     firebase.auth().signOut();
//                     return;
//                 }

//                 // Write to Firestore
//                 var db = firebase.firestore();
//                 db.collection("adminLogins").add({
//                     email: user.email,
//                     timestamp: new Date()
//                 }).then(function (docRef) {
//                     console.log("Login recorded: ", docRef.id);
//                     // Redirect handled by onAuthStateChanged below
//                 }).catch(function (error) {
//                     console.error("Error writing login record: ", error);
//                 });
//             })
//             .catch(function (error) {
//                 var errorCode = error.code;
//                 var errorMessage = error.message;

//                 if (errorCode === 'auth/wrong-password') {
//                     alertify.error('Wrong password');
//                 } else {
//                     alertify.error(errorMessage);
//                 }
//             });
//     });
// });

// function initApp() {
//     firebase.auth().onAuthStateChanged(function (user) {
//         if (user) {
//             // Redirect to admin page after successful login
//             location.assign('/admin.html');
//         }
//     });
// }


// const firebaseConfig = {
//             apiKey: "AIzaSyBFGsDVtTUs6_nB8nfaW5EhceJ7BlE3_F4",
//             authDomain: "bahnthai-2ea23.firebaseapp.com",
//             projectId: "bahnthai-2ea23",
//             storageBucket: "bahnthai-2ea23.firebasestorage.app",
//             messagingSenderId: "134991899936",
//             appId: "1:134991899936:web:525833efd42d3f36b83b45",
//             measurementId: "G-Z3L1GBGT5B"
// };

// firebase.initializeApp(firebaseConfig);
// const auth = firebase.auth();
// const db = firebase.firestore();

// Document ready
$(function () {
  initApp();

  $("#loginForm").submit(function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password || email.length < 4 || password.length < 4) {
      alertify.error('Please check your Email and Password');
      this.reset();
      return;
    }

    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        const allowedEmails = ["ssmarnpharb58@gmail.com", "laosomboon@gmail.com"];
        if (!allowedEmails.includes(user.email)) {
          alertify.error("Unauthorized email");
          auth.signOut();
          return;
        }

        db.collection("adminLogins").add({
          email: user.email,
          timestamp: new Date()
        }).then((docRef) => {
          console.log("Login recorded:", docRef.id);
          // Redirect handled in onAuthStateChanged
        }).catch((error) => {
          console.error("Firestore error:", error);
        });
      })
      .catch((error) => {
        if (error.code === 'auth/wrong-password') {
          alertify.error('Wrong password');
        } else {
          alertify.error(error.message);
        }
      });
  });
});

function initApp() {
  auth.onAuthStateChanged(async (user) => {
    if (user) {
      try {
        const token = await user.getIdTokenResult();
        if (token.claims.isAdmin) {
          location.assign("admin.html");
        } else {
          alert("You do not have admin access.");
          await auth.signOut();
        }
      } catch (err) {
        console.error("Token error:", err);
      }
    }
  });
}
