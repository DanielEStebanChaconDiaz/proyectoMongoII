const { ObjectId } = require('mongodb');
const Connection = require('../helpers/connect');

module.exports = class Seats {
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

    async getSeats(showtime_id) {
        try {
            // Asegúrate de que showtime_id sea una cadena de 24 caracteres hexadecimales válidos
            if (!/^[a-fA-F0-9]{24}$/.test(showtime_id)) {
                throw new Error('ID de showtime no es un ObjectId válido');
            }

            await this.connect(); // Asegúrate de que la conexión se establezca primero

            // Busca documentos en 'seats' donde showtime_id coincida
            const result = await this.db.collection('seats').aggregate([
                { $match: { showtime_id: new ObjectId(showtime_id) } }, // Filtra por showtime_id
                { $project: { _id: 0, seat_number: 1, status: 1 } }   // Proyecta solo los campos seat_number y status
            ]).toArray();

            return result;
        } catch (err) {
            console.error('Error al recuperar asientos:', err);
            throw err; // Propaga el error para que pueda ser manejado adecuadamente en otros lugares
        }
    }
}
