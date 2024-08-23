const Showtime = require('../module/showtime');
const { query, body, validationResult } = require('express-validator');
const express = require('express');
const appShowtime = express.Router();
appShowtime.get('/v2', [
  // La validación debe estar aquí
  query("movie_id").notEmpty().withMessage("movie_id es requerido"),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
  }

  const movieId = req.query.movie_id; // Extrae el movie_id de req.query
  let obj = new Showtime();

  try {
      const showtime = await obj.obtenerAsientosPorCineYFuncion(movieId);
      res.send(showtime); // Asegúrate de enviar JSON
  } catch (error) {
      console.error(error); // Log para depuración
      res.status(500).json({ message: "Error al obtener los asientos" });
  }
});

// Ruta PUT con validación
appShowtime.post('/update-seat', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
  }
  console.log(req.body)
  const { movieId, cinemaId, date, rowLetter, seatNumber } = req.body[0];

  try {
    const obj = new Showtime();
    console.log(movieId, cinemaId, date, rowLetter, seatNumber)
    const result = await obj.actualizarEstadoAsiento(movieId, cinemaId, date, rowLetter, seatNumber);
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



module.exports = appShowtime;
