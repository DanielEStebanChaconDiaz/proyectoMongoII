const { MongoClient } = require('mongodb');
const Connection = require('../helpers/connect');
const bcrypt = require('bcrypt'); // Para el hashing de contraseñas

module.exports = class Tickets {
    constructor() {
        this.connection = new Connection();
        this.db = null;
    }

    async connect() {
        if (!this.db) {
            try {
                this.db = await this.connection.connect();
            } catch (err) {
                console.error('Error connecting to the database:', err);
            }
        }
        return this.db;
    }
    async createOrder(movieId, cinemaId, seatsPurchase, cinemaDireccion, movieImage, totalPrice, orderDate, orderId, userName) {
        try {
            // Conectar a la base de datos
            const db = await this.connect();
            const ticketsCollection = db.collection('tickets');

            const result = ticketsCollection.insertOne({
                order: orderId,
                moviId: movieId,
                cinemaId: cinemaId,
                movieImage: movieImage,
                cinemaDireccion: cinemaDireccion,
                seats: seatsPurchase,
                totalPrice: totalPrice,
                showtimeDate: orderDate,
                userName: userName,
            })

            // Confirmar que la inserción fue exitosa
            console.log('Tickets successfully created:', result);
            return result;
        } catch (err) {
            console.error('Error creating order:', err);
            throw err;
        }
    }

    async getTicketsForOrder(orderId) {
        try {
            // Conectar a la base de datos
            const db = await this.connect();
            const ticketsCollection = db.collection('tickets');

            const result = await ticketsCollection.find({
                order: orderId
            }).toArray();

            return result;

        } catch (err) {
            console.error('Error getting tickets for order:', err);
            throw err;

        }

    }
}