import Connection from "../../db/connect/connect.js";
export class Seats{
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
    }
    
/**
 * Recupera asientos de la base de datos con el estado 'disponible'.
 *
 * @returns {Promise<Array>} Un array de asientos con el estado 'disponible'.
 *
 * @throws Lanza un error si hay un problema al recuperar los asientos de la base de datos.
 *
 * @example
 * const asientos = new Asientos();
 * const asientosDisponibles = await asientos.getSeats();
 * console.log(asientosDisponibles);
 */
async getSeats() {
    await this.connect();
    try {
        const colecciones = await this.db.collection('seats').find({estado: {$eq: 'disponible'}}).toArray();
        return colecciones;
    } catch (err) {
        console.error('Error al recuperar asientos:', err);
    }
}
}