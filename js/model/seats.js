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
    async getSeats() {
        await this.connect();
        try {
            const collections = await this.db.collection('seats').find({estado: {$eq: 'disponible'}}).toArray();
            return collections;
        } catch (err) {
            console.error('Error fetching seats:', err);
        }
    }
}