const express = require('express');
const router = express.Router();
const Users = require('../module/users'); // Asegúrate de que la ruta sea correcta

const userService = new Users();

// Ruta para manejar el registro de usuarios
router.post('/', async (req, res) => {
    const { email, name, age, idNumber, password } = req.body;

    try {
        // Puedes agregar lógica para verificar el email, encriptar la contraseña, etc.
        await userService.registerUser(email, name, age, idNumber, password);
        res.status(201).send('Usuario registrado exitosamente.');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).send('Error al registrar usuario.');
    }
});

module.exports = router;
