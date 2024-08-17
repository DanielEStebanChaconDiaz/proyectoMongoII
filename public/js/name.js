import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import { getAuth, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';

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

// Función para escuchar el estado de autenticación
export function loadUserName() {
    return new Promise((resolve, reject) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // Usuario autenticado, devolver email
                const email = user.email;
                console.log(email);
                resolve(email);
            } else {
                // No hay usuario autenticado
                console.log("No hay un usuario autenticado.");
                resolve(null);
            }
        }, (error) => {
            console.error("Error al obtener el email del usuario:", error);
            reject(error);
        });
    });
}
