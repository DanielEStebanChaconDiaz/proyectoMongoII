const Showtime = require('../module/showtime');
const { query, validationResult } = require('express-validator');
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
  

module.exports = appShowtime;
