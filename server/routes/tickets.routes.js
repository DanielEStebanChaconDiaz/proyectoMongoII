const Tickets = require('../module/tickets');
const { query, body, validationResult } = require('express-validator');
const express = require('express');
const appTickets = express.Router();
const appTicket = express.Router();

appTickets.post('/facture', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }
    console.log(req.body)
    const { movieId, cinemaId, seatsPurchase, cinemaDireccion, movieImage, totalPrice, orderDate, orderId, userName} = req.body;
  
    try {
      const obj = new Tickets();
      console.log(movieId, cinemaId, seatsPurchase, cinemaDireccion, movieImage, totalPrice, orderDate, orderId, userName)
      const result = await obj.createOrder(movieId, cinemaId, seatsPurchase, cinemaDireccion, movieImage, totalPrice, orderDate, orderId, userName);
      if (result.modifiedCount > 0) {
          res.status(200).json({ message: 'Asiento actualizado correctamente' });
      } else {
          res.status(404).json({ message: 'No se encontró el asiento o no se pudo actualizar' });
      }
    } catch (error) {
        console.error('Error al actualizar el estado del asiento:', error);
        res.status(500).json({ error: 'Error al actualizar el estado del asiento' });
    }
  });

  
module.exports = appTickets , appTicket;