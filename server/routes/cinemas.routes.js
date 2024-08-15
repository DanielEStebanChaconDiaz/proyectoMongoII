const Cinemas = require('../module/cinemas');
const { query, validationResult } = require('express-validator');
const express = require('express');
const appCinemas = express.Router();

appCinemas.get('/v3', [
    query("cinemaId").notEmpty().withMessage("cinemaId es requerido")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }

    const cinemaId = req.query.cinemaId; // Extrae el showtime_id de req.query
    let obj = new Cinemas();

    try {
        const movie = await obj.getMoviesForId(cinemaId);
        res.send(movie);
    } catch (error) {
        console.error(error); // Log para depuración
        res.status(500).json({ message: "Error al obtener los asientos" });
    }
});
module.exports = appCinemas;