const { ObjectId } = require('mongodb');
const Connection = require('../helpers/connect');

module.exports = class Movie {
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

    async getMoviesForTitle(title) {
        try {
            // Asegúrate de que showtime_id sea una cadena de 24 caracteres hexadecimales válidos

            await this.connect(); // Asegúrate de que la conexión se establezca primero

            // Busca documentos en 'seats' donde showtime_id coincida
            const result = await this.db.collection('movies').aggregate([
                {
                    $match: { title: title }
                }
            ]).toArray();

            return result;
        } catch (err) {
            console.error('Error al encontrar peliculas:', err);
            throw err; // Propaga el error para que pueda ser manejado adecuadamente en otros lugares
        }
    }
    async getMovies(){
        try {
            await this.connect(); // Asegúrate de que la conexión se establezca primero

            // Busca todos los documentos en la colección 'movies'
            const result = await this.db.collection('movies').find().toArray();

            return result;
        } catch (err) {
            console.error('Error al recuperar peliculas:', err);
            throw err; // Propaga el error para que pueda ser manejado adecuadamente en otros lugares
        }
    }
}