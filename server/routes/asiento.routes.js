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

    let obj = new Seats();
    try {
        const seats = await obj.getSeats(req.query);
        res.send(seats);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los asientos" });
    }
});

module.exports = appSeats;
