import { auth, db } from './firebaseConfig.js';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js';
import { collection, addDoc } from 'https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js';

function initApp() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const token = await user.getIdTokenResult();
      if (token.claims.isAdmin) {
        location.assign('admin.html');
      } else {
        alert('You do not have admin access.');
        await signOut(auth);
      }
    }
  });
}

$(function () {
  initApp();

  $('#loginForm').submit(function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!email || !password || email.length < 4 || password.length < 4) {
      alertify.error('Please check your Email and Password');
      this.reset();
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        const allowedEmails = ['ssmarnpharb58@gmail.com', 'laosomboon@gmail.com'];
        if (!allowedEmails.includes(user.email)) {
          alertify.error('Unauthorized email');
          await signOut(auth);
          return;
        }

        await addDoc(collection(db, 'adminLogins'), {
          email: user.email,
          timestamp: new Date()
        });

        // onAuthStateChanged will handle redirect
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
