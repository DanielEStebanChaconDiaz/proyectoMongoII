import { initializeApp } from 'www.gstatic.com/firebasejs/9.0.2/firebase-app.js';

import {sendEmailVerification, getAuth, signInWithPopup, 
    createUserWithEmailAndPassword, signInWithEmailAndPassword,  
    onAuthStateChanged} from 'www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';

const firebaseConfig = {
  apiKey: "AIzaSyAZf19a7Gm_K2uwxapQIpWhaXESO79UyjU",
  authDomain: "cinecampus-f0e3a.firebaseapp.com",
  projectId: "cinecampus-f0e3a",
  storageBucket: "cinecampus-f0e3a.appspot.com",
  messagingSenderId: "593635990799",
  appId: "1:593635990799:web:11beefda8225be1237f27a",
  measurementId: "G-56L27ZZGMR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
registerVersion.addeventListener('submit', (e) => {})
