import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-app.js';
import { sendEmailVerification, getAuth, createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';

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

document.getElementById('registro').addEventListener('click', async (e) => {
  e.preventDefault(); // Previene el comportamiento por defecto del formulario

  const nombre = document.getElementById('name').value;
  const email = document.getElementById('emailreg').value;
  const password = document.getElementById('passwordreg').value;

  try {
    // Crear el usuario en Firebase con el correo y la contraseña
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    alert('Usuario creado');
    console.log(cred.user);

    // Envía la verificación de correo
    await sendEmailVerification(auth.currentUser);
    alert('Te hemos enviado un correo de verificación');

    // Después de enviar el correo de verificación, puedes cerrar la sesión
    await auth.signOut();

    // Envía los datos al backend para registrar al usuario
    await fetch('/register-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, email, password }),
    });

    // Aquí, podrías redirigir al usuario a una página que le indique que debe verificar su correo electrónico
    window.location.href = '/check-email'; // Cambia esta URL según tu configuración

  } catch (error) {
    const errorCode = error.code;
    if (errorCode === 'auth/email-already-in-use') {
      alert('El correo ya existe');
    } else if (errorCode === 'auth/invalid-email') {
      alert('El correo no es válido');
    } else if (errorCode === 'auth/weak-password') {
      alert('La contraseña debe tener al menos 6 caracteres');
    } else {
      alert('Error: ' + error.message);
    }
  }
});

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
