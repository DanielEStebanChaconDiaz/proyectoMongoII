const express = require('express')
const appSeats = require('./server/routes/asiento.routes')
const app = express();


app.use(express.static(process.env.EXPRESS_STATIC))

app.get('/seats', function (req, res) {
    res.sendFile(`${process.env.EXPRESS_STATIC}/views/seats.html`, {root: __dirname})
})
app.use('/seats', appSeats)

app.listen({host: process.env.EXPRESS_HOST, port: process.env.EXPRESS_PORT}, ()=>{
    console.log(`http://${process.env.EXPRESS_HOST}:${process.env.EXPRESS_PORT}`);
})