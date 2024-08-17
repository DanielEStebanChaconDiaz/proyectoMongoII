const express = require('express');
const appUsers = express.Router();
const { query, validationResult } = require('express-validator');
const Users = require('../module/users'); // Asegúrate de que la ruta sea correcta

const userService = new Users();

// Ruta para manejar el registro de usuarios
appUsers.post('/', async (req, res) => {
    const { email, nombre, password } = req.body; // Asegúrate de que los nombres coincidan

    try {
        // Llama al servicio de usuarios con los parámetros correctos
        await userService.registerUser(nombre, email, password);
        res.status(201).send('Usuario registrado exitosamente.');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).send('Error al registrar usuario.');
    }
});

appUsers.get('/v1', [
    query("email").notEmpty().withMessage("email es requerido")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }

    const email = req.query.email; // Extrae el showtime_id de req.query
    let obj = new Users();

    try {
        const movie = await obj.getUsersFroEmail(email);
        res.send(movie);
    } catch (error) {
        console.error(error); // Log para depuración
        res.status(500).json({ message: "Error al obtener los asientos" });
    }
});

module.exports = appUsers;
