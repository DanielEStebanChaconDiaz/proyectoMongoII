import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import { getAuth, signOut } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';

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

document.getElementById('cerrar').addEventListener('click', (e) => {
    // Limpiar almacenamiento local
    localStorage.clear();
    
    // Limpiar almacenamiento de sesión
    sessionStorage.clear();
    
    // Opcional: Borrar cookies específicas si tienes alguna
    document.cookie.split(";").forEach(function(c) {
        document.cookie = c.trim().split("=")[0] + "=;expires=" + new Date().toUTCString() + ";path=/";
    });
    
    // Cerrar sesión con Firebase (u otro proveedor de autenticación)
    signOut(auth)
        .then(() => {
            alert('Sesión cerrada');
            
            // Recargar la página o redirigir
            window.location.href = '/login';  // Redirige al usuario a /login después de cerrar la sesión
        })
        .catch((error) => {
            console.error('Error al cerrar la sesión:', error);
        });
});


document.addEventListener('DOMContentLoaded', () => {
    // Obtener los elementos de la navegación
    const homeButton = document.querySelector('.bottom-nav .nav-item:nth-child(1)');
    const browseButton = document.querySelector('.bottom-nav .nav-item:nth-child(2)');
    const searchInput = document.getElementById('searchInput');

    // Función para redirigir al /movies
    function redirectToMovies() {
        window.location.href = '/movies';
    }

    // Función para enfocar el campo de búsqueda
    function focusSearchInput() {
        searchInput.focus();
    }

    // Agregar eventos de clic
    homeButton.addEventListener('click', redirectToMovies);
    browseButton.addEventListener('click', focusSearchInput);
});
