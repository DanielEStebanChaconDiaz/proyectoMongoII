const express = require('express');
const appSeats = require('./server/routes/asiento.routes');
const appMovie = require('./server/routes/movie.routes');
const path = require('path'); // Asegúrate de requerir 'path' para manejar rutas de archivos
const app = express();

// Configura el directorio estático
app.use(express.static(process.env.EXPRESS_STATIC));

// Ruta para servir la vista HTML de asientos
app.get('/seats', function (req, res) {
    res.sendFile(path.join(__dirname, process.env.EXPRESS_STATIC, 'views', 'seats.html'));
});
app.use('/seats', appSeats);

// Ruta para servir la vista HTML de películas
app.get('/movies', function (req, res) {
    res.sendFile(path.join(__dirname, process.env.EXPRESS_STATIC, 'views', 'movies.html'));
});
app.use('/movies', appMovie);

app.get('/movie', function (req, res) {
    res.sendFile(path.join(__dirname, process.env.EXPRESS_STATIC, 'views', 'movie.html'));
});
app.use('/movie', appMovie);

// Middleware para manejar errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

// Inicia el servidor
app.listen({ host: process.env.EXPRESS_HOST, port: process.env.EXPRESS_PORT }, () => {
    console.log(`http://${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}`);
});
