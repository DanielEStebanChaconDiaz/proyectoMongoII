import { loadUserName } from './name.js';

const CACHE_KEY = 'userData'; // Clave para almacenar los datos del usuario en el almacenamiento local

export async function fetchUserName() {
    try {
        // Verificar si los datos del usuario están en el almacenamiento local
        const cachedUserData = localStorage.getItem(CACHE_KEY);
        if (cachedUserData) {
            const userData = JSON.parse(cachedUserData);
            updateGreeting(userData.name, userData.img);
            return;
        }

        // Esperar a que se obtenga el email del usuario de manera asincrónica
        const email = await loadUserName(); 

        // Verificar si el email fue capturado correctamente
        if (!email) {
            console.error('Email not captured');
            return;
        }

        // Realizar la solicitud a la API con el email del usuario
        const response = await fetch(`/register-user/v1?email=${email}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Parsear la respuesta JSON y obtener los datos del usuario
        const data = await response.json();
        const name = data[0].nombre;
        const img = data[0].imagePath;
        console.log(img)

        console.log("User data:", data); // Verificar la respuesta de la API

        // Guardar los datos del usuario en el almacenamiento local
        localStorage.setItem(CACHE_KEY, JSON.stringify({ name, img }));

        // Actualizar el saludo en la página con el nombre y la imagen del usuario
        updateGreeting(name, img);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Función para actualizar el saludo en la página
function updateGreeting(name, img) {
    const saludoElement = document.getElementById('saludo');
    const profileElement = document.getElementById('profile');
    if (saludoElement) {
        saludoElement.innerHTML = `Hi, ${name}`;
    }
    if (profileElement && img) {
        
        profileElement.setAttribute('src', img)
    } else if (profileElement) {
        profileElement.innerHTML = `

No image

`;
    }
}

// Ejecutar la función fetchUserName cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {
    fetchUserName();
});