const Seats = require('../module/seats');
const { query, validationResult } = require('express-validator');
const express = require('express');
const appSeats = express.Router();

appSeats.get('/v1', [
    query("showtime_id").notEmpty().withMessage("showtime_id es requerido")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }

    const showtime_id = req.query.showtime_id; // Extrae el showtime_id de req.query
    let obj = new Seats();
    
    try {
        const seats = await obj.getSeats(showtime_id); // Pasa el showtime_id directamente
        res.send(seats);
    } catch (error) {
        console.error(error); // Log para depuración
        res.status(500).json({ message: "Error al obtener los asientos" });
    }
});

module.exports = appSeats;
