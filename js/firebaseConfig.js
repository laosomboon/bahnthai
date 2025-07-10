import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyBFGsDVtTUs6_nB8nfaW5EhceJ7BlE3_F4",
  authDomain: "bahnthai-2ea23.firebaseapp.com",
  projectId: "bahnthai-2ea23",
  storageBucket: "bahnthai-2ea23.firebasestorage.app",
  messagingSenderId: "134991899936",
  appId: "1:134991899936:web:525833efd42d3f36b83b45",
  measurementId: "G-Z3L1GBGT5B"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
