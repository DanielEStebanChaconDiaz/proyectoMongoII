const express = require('express');
const appUsers = express.Router();
const { query, validationResult } = require('express-validator');
const Users = require('../module/users');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const userService = new Users();

const upload = multer ({dest: 'uploads'})



// Ruta para manejar el registro de usuarios
appUsers.post('/', upload.single('image'), async (req, res) => {
  const { email, nombre, password } = req.body;

  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    // Guarda la imagen en el sistema de archivos
    const imageName = result.secure_url

    // Llama al servicio de usuarios con los parámetros correctos
    await userService.registerUser(nombre, email, password, imageName);
    res.status(201).send('Usuario registrado exitosamente.');
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).send('Error al registrar usuario.');
  }
});

appUsers.post('/v2', upload.single('image'),[
  query("email").notEmpty().withMessage("email es requerido")
], async (req, res) => {

  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    // Guarda la imagen en el sistema de archivos
    const email = req.query.email;
    const imageName = result.secure_url

    // Llama al servicio de usuarios con los parámetros correctos
    await userService.updateImg(email, imageName);
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