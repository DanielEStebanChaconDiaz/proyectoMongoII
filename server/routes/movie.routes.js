const Movie = require('../module/movies');
const { query, validationResult } = require('express-validator');
const express = require('express');
const appMovie = express.Router();

appMovie.get('/v1', [
    query('search').notEmpty().withMessage("El término de búsqueda es requerido")
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
    }

    const searchTerm = req.query.q;
    let obj = new Movie();
    
    try {
        // Buscar por título
        const moviesByTitle = await obj.getMoviesForgenre(searchTerm);
        
        // Buscar por género
        const moviesByGenre = await obj.getMoviesForGenre(searchTerm);
        
        // Combinar resultados y eliminar duplicados
        const allMovies = [...moviesByTitle, ...moviesByGenre];
        const uniqueMovies = Array.from(new Set(allMovies.map(m => m._id)))
            .map(_id => allMovies.find(m => m._id === _id));
        
        res.send(uniqueMovies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al buscar películas" });
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

module.exports = appMovie;
