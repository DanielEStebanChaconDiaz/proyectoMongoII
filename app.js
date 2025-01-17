const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const appSeats = require('./server/routes/asiento.routes');
const appMovie = require('./server/routes/movie.routes');
const appCinemas = require('./server/routes/cinemas.routes');
const appUsers = require('./server/routes/users.routes'); // Importa las rutas de usuarios
const appShowtime = require('./server/routes/showtime.routes');
const appTickets = require('./server/routes/tickets.routes')
const appTicket = require('./server/routes/bougth.routes')
const appTicketes = require('./server/routes/allTickets.routes');
const stripe = require('stripe')('sk_test_51Ps3CL06WcWl6cu4TCkI5J9KSwWlSaPMtf9h8H5jlrUMlpfr9ryTQN2lmuPd1jXaTDfJhShp0jw2MlXOHPMH3qkN003eoytsDv'); // Tu clave secreta de Stripe
const { error } = require('console');



const app = express();
app.use(express.urlencoded({ extended: true }));

// Configura el directorio estático
app.use(express.static(process.env.EXPRESS_STATIC));

// Middleware para analizar el cuerpo de las solicitudes
app.use(bodyParser.json());
app.post('/create-payment-intent', async (req, res) => {
    console.log(req.body)
    const { amount, currency } = req.body;
    console.log(amount, currency);

    if (!amount || !currency) {
        return res.status(400).send({ error: 'Faltan parámetros en la solicitud.' });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });

        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});


app.get('/tickets', (req, res) => {
    res.sendFile(path.join(__dirname, process.env.EXPRESS_STATIC, 'views', 'tickets.html'));
})

app.use('/tickets', appTicketes)

// Ruta para servir la vista HTML de asientos
app.get('/seats', (req, res) => {
    res.sendFile(path.join(__dirname, process.env.EXPRESS_STATIC, 'views', 'seats.html'));
});
app.use('/seats', appSeats);

// Ruta para servir la vista HTML de películas
app.get('/movies', (req, res) => {
    res.sendFile(path.join(__dirname, process.env.EXPRESS_STATIC, 'views', 'movies.html'));
});
app.use('/movies', appMovie);

// Ruta para servir la vista HTML de una película específica
app.get('/movie', (req, res) => {
    res.sendFile(path.join(__dirname, process.env.EXPRESS_STATIC, 'views', 'movie.html'));
});
app.use('/movie', appCinemas);


app.get('/register-user', (req, res) => {
    res.sendFile(path.join(__dirname, process.env.EXPRESS_STATIC, 'views','registro.html'));
})
// Usa las rutas de usuarios
app.use('/register-user', appUsers);

app.get('/check-email', (req, res) => {
    res.sendFile(path.join(__dirname, process.env.EXPRESS_STATIC, 'views', 'check-email.html'));
  });
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, process.env.EXPRESS_STATIC, 'views', 'login.html'));
})

app.get('/accound', (req, res) => {
    res.sendFile(path.join(__dirname, process.env.EXPRESS_STATIC, 'views', 'acound.html'));
})

app.get('/seats/:movie_id/:cinema_id', (req, res) => {
    res.sendFile(`${process.env.EXPRESS_STATIC}/views/seats.html`, { root: __dirname });
})
app.use('/seats', appShowtime);

// Middleware para manejar errores

app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, process.env.EXPRESS_STATIC, 'views', 'pay.html'));
})
app.use('/payment', appTickets)

app.get('/paid', (req, res) => {
    res.sendFile(path.join(__dirname, process.env.EXPRESS_STATIC, 'views', 'ticket.html'));
})
app.use('/paid', appTicket)



app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

// Inicia el servidor
app.listen({ host: process.env.EXPRESS_HOST, port: process.env.EXPRESS_PORT }, () => {
    console.log(`Servidor corriendo en http://${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}/login`);
});
