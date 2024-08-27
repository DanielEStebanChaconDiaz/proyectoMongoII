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
  async getShowtime(cinema_id) {
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
            movie_id: new ObjectId(movieId),
          }
        }
      ]).toArray();

      return resultado;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  async actualizarEstadoAsiento(movieId, cinemaId, date, rowLetter ,seatNumber ) {
    console.log(movieId, cinemaId, date, seatNumber, rowLetter)
    try {
      const db = await this.connect();
      const collection = db.collection('showtimes');

      // Paso 1: Encontrar el documento correcto
      const result = collection.updateMany({
        "showtimes.date": new Date(date),
        movie_id: new ObjectId(movieId),
        cinema_id: new ObjectId(cinemaId),
        "showtimes.seats": {
          $elemMatch: {
            seat_number: parseInt(seatNumber),
            seat_row: rowLetter
          }
        }
      },
      {
        $set: {
          "showtimes.$[showtime].seats.$[seat].estado": "ocupado"
        }
      },
      {
        arrayFilters: [
          { "showtime.date": new Date(date) },
          { 
            "seat.seat_number": parseInt(seatNumber),
            "seat.seat_row": rowLetter
          }
        ]
      });



      console.log('Resultado de la actualización:', result, 'ola');

      // Verificar si se actualizó algún documento
      console.log(result);
      if (result.modifiedCount > 0) {
        console.log('Asiento actualizado correctamente');
      } else {
        console.log('No se encontró el asiento o no se pudo actualizar');
      }

      return result;
    } catch (error) {
      console.error('Error al actualizar el estado del asiento:', error);
      throw error;  // Lanzamos el error en lugar de retornar null
    }
  }




}