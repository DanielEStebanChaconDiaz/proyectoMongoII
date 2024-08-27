const Tickets = require('../module/tickets');
const { query, body, validationResult } = require('express-validator');
const express = require('express');
const appTicket = express.Router();
appTicket.get(
    '/v1',
    [
      query("orderId").notEmpty().withMessage("orderId es requerido")
    ], 

    async (req, res) => {
        console.log('entre')
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ message: errors.array()[0].msg });
      }
    
      const orderId = req.query.orderId; // Extrae el orderId de req.query
      let obj = new Tickets();
    
      try {
          const ticket = await obj.getTicketsForOrder(orderId);
          res.json(ticket); // Asegúrate de enviar JSON
      } catch (error) {
          console.error(error); // Log para depuración
          res.status(500).json({ message: "Error al obtener los asientos" });
      }
  });
module.exports = appTicket;