// Firebase imports
// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
// import { getAuth, signInWithEmailAndPassword, onAuthStateChanged , signOut } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js";
// import {
//   getFirestore,
//   collection,
//   query,
//   orderBy,
//   onSnapshot,
//   doc,
//   getDoc,
//   setDoc,
//   deleteDoc,
//   getDocs,
//   addDoc,
//   updateDoc,
// } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyBFGsDVtTUs6_nB8nfaW5EhceJ7BlE3_F4",
  authDomain: "bahnthai-2ea23.firebaseapp.com",
  projectId: "bahnthai-2ea23",
  storageBucket: "bahnthai-2ea23.firebasestorage.app",
  messagingSenderId: "134991899936",
  appId: "1:134991899936:web:525833efd42d3f36b83b45",
  measurementId: "G-Z3L1GBGT5B"
};



firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();