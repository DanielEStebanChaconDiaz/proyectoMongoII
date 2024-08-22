import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import { sendEmailVerification, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';

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

document.getElementById('login').addEventListener('click', (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario

    const email = document.getElementById('emaillog').value;
    const password = document.getElementById('passwordlog').value;

    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            alert('Usuario logueado');
            console.log(cred.user);
        })
        .catch((error) => {
            const errorCode = error.code;
            if (errorCode === 'auth/invalid-email') {
                alert('El email no es válido');
            } else if (errorCode === 'auth/wrong-password') {
                alert('Contraseña incorrecta');
            } else if (errorCode === 'auth/user-not-found') {
                alert('El usuario no existe');
            } else {
                alert('Error: ' + error.message);
            }
        });
});

document.getElementById('cerrar').addEventListener('click', (e) => {
    auth.signOut()
        .then(() => {
            alert('Sesión cerrada');
        })
        .catch((error) => {
            console.error('Error al cerrar la sesión:', error);
        });
});

auth.onAuthStateChanged(user => {
    if (user) {
        console.log('Usuario activo')
        if (user.emailVerified) {
            if (window.location.pathname !== '/movies') {
                window.location.href = '/movies'
            }
        } else {
            auth.signOut();
        }
    } else {
        console.log('Usuario no activo')
        if (window.location.pathname !== '/login') {
            window.location.href = '/login'
        }
    }
})

// Esta función puede ser usada en una página de verificación de correo electrónico o en un archivo separado
async function checkEmailVerification() {
    const user = auth.currentUser;
  
    if (user) {
      await user.reload(); // Recarga el usuario para obtener el estado actualizado
      if (user.emailVerified) {
        window.location.href = '/movies'; // Redirige si el correo está verificado
      } else {
        alert('Por favor, verifica tu correo electrónico.');
      }
    }
  }
  
  // Llama a esta función cuando el usuario regrese después de verificar el correo
  window.addEventListener('load', checkEmailVerification);