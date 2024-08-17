import { loadUserName } from './name.js';

const CACHE_KEY = 'userName'; // Clave para almacenar el nombre en el almacenamiento local

export async function fetchUserName() {
    try {
        // Verificar si el nombre está en el almacenamiento local
        const cachedName = localStorage.getItem(CACHE_KEY);
        if (cachedName) {
            // Si el nombre está en caché, actualizar el saludo
            updateGreeting(cachedName);
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

        // Parsear la respuesta JSON y obtener el nombre del usuario
        const data = await response.json();
        const name = data[0].nombre;

        console.log("User data:", data); // Verificar la respuesta de la API

        // Guardar el nombre en el almacenamiento local
        localStorage.setItem(CACHE_KEY, name);

        // Actualizar el saludo en la página con el nombre del usuario
        updateGreeting(name);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

// Función para actualizar el saludo en la página
function updateGreeting(name) {
    const saludoElement = document.getElementById('saludo');
    if (saludoElement) {
        saludoElement.innerHTML = `Hi, ${name}`;
    }
}

// Ejecutar la función fetchUserName cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {
    fetchUserName();
});
