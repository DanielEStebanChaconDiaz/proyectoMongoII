const express = require('express');
const router = express.Router();
const Users = require('../module/users'); // Asegúrate de que esta ruta sea correcta

// Instancia de la clase Users
const users = new Users();

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
    const { idToken, nombre, contraseña } = req.body;

    if (!idToken || !nombre || !contraseña) {
        return res.status(400).json({ error: 'ID token, nombre, and contraseña are required' });
    }

    try {
        const userId = await users.registerUser(idToken, nombre, contraseña);
        res.status(200).json({ userId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
