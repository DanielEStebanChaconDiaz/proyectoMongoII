const Tickets = require('../module/tickets');
const { query, body, validationResult } = require('express-validator');
const express = require('express');
const appTicketes = express.Router();



appTicketes.get('/v2', [query('userName').notEmpty().withMessage('userName es requerido')],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }
        const userName = req.query.userName;
        let obj = new Tickets();
        try {
            const ticket = await obj.getTicketsForUserName(userName);
            res.json(ticket); // Asegúrate de enviar JSON
        } catch (error) {
            console.error(error); // Log para depuración
            res.status(500).json({ message: "Error al obtener los asientos" });
        }
    })

module.exports = appTicketes;