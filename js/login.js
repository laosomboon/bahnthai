// Document on load.
$(function () {
    initApp();

    $("#loginForm").submit(function (e) {
        e.preventDefault();

        var email = document.getElementById('email');
        var password = document.getElementById('password');

        if (!email.value || !password.value || email.value.length < 4 || password.value.length < 4) {
            alertify.error('Please check your Email and Password');
            this.reset();
            return;
        }

        firebase.auth().signInWithEmailAndPassword(email.value, password.value)
            .then(function (userCredential) {
                var user = userCredential.user;

                // Optionally check email against allowed list before writing to Firestore
                const allowedEmails = ["ssmarnpharb58@gmail.com", "laosomboon@gmail.com"];
                if (!allowedEmails.includes(user.email)) {
                    alertify.error("Unauthorized email");
                    firebase.auth().signOut();
                    return;
                }

                // Write to Firestore
                var db = firebase.firestore();
                db.collection("adminLogins").add({
                    email: user.email,
                    timestamp: new Date()
                }).then(function (docRef) {
                    console.log("Login recorded: ", docRef.id);
                    // Redirect handled by onAuthStateChanged below
                }).catch(function (error) {
                    console.error("Error writing login record: ", error);
                });
            })
            .catch(function (error) {
                var errorCode = error.code;
                var errorMessage = error.message;

                if (errorCode === 'auth/wrong-password') {
                    alertify.error('Wrong password');
                } else {
                    alertify.error(errorMessage);
                }
            });
    });
});

function initApp() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // Redirect to admin page after successful login
            location.assign('/admin.html');
        }
    });
}
