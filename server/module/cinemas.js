const { ObjectId } = require('mongodb');
const Connection = require('../helpers/connect');

module.exports = class Cinemas{
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

    async getCinemaById(cinemaId) {
        await this.connect(); // Asegúrate de que la conexión se establezca primero

        // Busca todos los documentos en la colección 'movies'
        const result = await this.db.collection('movies').aggregate(
            [
                {
                  $match: {
                    _id: new ObjectId(cinemaId)  // Filtra la película por ID
                  }
                }
            ]
        ).toArray();

        return result;
    } catch (err) {
        console.error('Error al recuperar peliculas:', err);
        throw err; // Propaga el error para que pueda ser manejado adecuadamente en otros lugares
    }
}