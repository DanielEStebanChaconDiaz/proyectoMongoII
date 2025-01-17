const Movie = require('../module/movies');
const { query, validationResult } = require('express-validator');
const express = require('express');
const appMovie = express.Router();

appMovie.get('/v1', [
    query("title").notEmpty().withMessage("title es requerido")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }

    const title = req.query.title; // Extrae el showtime_id de req.query
    let obj = new Movie();

    try {
        const movie = await obj.getMoviesForTitle(title);
        const genre = await obj.getMoviesForGenre(title);
        res.send([movie, genre]);
    } catch (error) {
        console.error(error); // Log para depuración
        res.status(500).json({ message: "Error al obtener los asientos" });
    }
});
appMovie.get('/v1/all', async (req, res) => {
    let obj = new Movie();
    
    try {
        const movies = await obj.getMovies(); // Pasa el showtime_id directamente
        res.send(movies);
    } catch (error) {
        console.error(error); // Log para depuración
        res.status(500).json({ message: "Error al obtener los asientos" });
    }
});
appMovie.get('/v2/all', async (req, res) => {
    let obj = new Movie();
    
    try {
        const movies = await obj.getMoviesComming(); // Pasa el showtime_id directamente
        res.send(movies);
    } catch (error) {
        console.error(error); // Log para depuración
        res.status(500).json({ message: "Error al obtener los asientos" });
    }
});

appMovie.get('/v3', [
    query("movieId").notEmpty().withMessage("movieId es requerido")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }

    const movieId = req.query.movieId; // Extrae el showtime_id de req.query
    let obj = new Movie();

    try {
        const movie = await obj.getMoviesForId(movieId);
        res.send(movie);
    } catch (error) {
        console.error(error); // Log para depuración
        res.status(500).json({ message: "Error al obtener los asientos" });
    }
});

module.exports = appMovie;
