const Connection = require('../helpers/connect');
const { ObjectId } = require('mongodb');
module.exports = class Showtime {
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
    async getShowtime(cinema_id){
      try {
        const db = await this.connect();
        const showtimes = await db.collection('showtimes').find({ cinema_id: new ObjectId(cinema_id) }).toArray();
        return showtimes;
      } catch (error) {
        console.error(error);
        return null;
      }
    }
    async obtenerAsientosPorCineYFuncion(movieId) {
        try {
          const db = await this.connect();
          const resultado = await db.collection('showtimes').aggregate([
            {
              $match: {
                movie_id: new ObjectId(movieId),  // Filtro adicional por movie_id
              }
            }
          ]).toArray();
      
          return resultado;
        } catch (error) {
          console.error(error);
          return null;
        }
      };
      
      

}