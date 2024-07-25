// models/users.js
import Connection from '../../db/connect/connect.js';
import readlineSync from 'readline-sync'

export class Users {
    constructor() {
        this.connection = new Connection();
        this.db = null;
    }

    async connect(user, pws) {
        if (!this.db) {
            try {
                await this.connection.login(user, pws);
                this.db = await this.connection.connect();
            } catch (err) {
                console.error('Error connecting to the database:', err);
            }
        }
    }

    async getUsers(user, pws) {
        await this.connect(user, pws);
        try {
            const collections = await this.db.collection('users').find().toArray();
            return collections;
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    }
    async getMoviesFunction(user, pws) {
        await this.connect(user, pws);
        try {
            const collections = await this.db.collection('movies').aggregate([
                {
                  $lookup: {
                    from: 'cinemas',
                    localField: 'movieId',
                    foreignField: 'functions.movieId',
                    as: 'Programacion'
                  }
                },
                {
                  $unwind: '$Programacion'
                },
                {
                  $unwind: '$Programacion.functions'
                },
                {
                  $match: {
                    'Programacion.functions.movieId':  1
                  }
                },
                {
                  $project: {
                    title: 1,
                    'Programacion.name': 1,
                    'Programacion.location': 1,
                    'Programacion.functions.startTime': 1,
                    'Programacion.functions.endTime': 1,
                    'Programacion.functions.room': 1
                  }
                }
              ]).toArray();
            return collections;
        } catch (err) {
            console.error('Error fetching movie descriptions:', err);
        }
    }
    async getSeats(user, pws){
        await this.connect(user, pws);
        try {
            const collections = await this.db.collection('seats').find().toArray();
            return collections;
        } catch (err) {
            console.error('Error fetching movies:', err);
        }
    }
    async comprarBoleto(resultSeats) {
        // Mostrar asientos disponibles
        console.log("Asientos Disponibles:");
        console.log(resultSeats);
    
        // Solicitar al usuario que ingrese el ID del asiento
        const seatId = readlineSync.question('Ingrese el ID del asiento que desea comprar: ');
    
        // Buscar el asiento en los datos proporcionados
        const asiento = resultSeats.find(seat => seat.seatId === parseInt(seatId));
    
        if (asiento) {
            if (asiento.estado === 'disponible') {
                // Actualizar el estado del asiento a 'ocupado'
                try {
                    
                    const result = await this.db.collection('seats').updateOne(
                        { seatId: parseInt(seatId) }, // Filtro para encontrar el asiento
                        { $set: { estado: 'ocupado' } } // Actualización del estado
                    );
    
                    if (result.modifiedCount > 0) {
                        console.log(`¡Asiento ${seatId} comprado exitosamente!`);
                    } else {
                        console.log('No se pudo actualizar el estado del asiento. Inténtalo de nuevo.');
                    }
                } catch (err) {
                    console.error('Error al actualizar el estado del asiento:', err);
                }
            } else {
                console.log(`El asiento ${seatId} no está disponible para la compra.`);
            }
        } else {
            console.log('ID de asiento no válido.');
        }
    }
    async closeConnection() {
        if (this.connection) {
            await this.connection.close();
            this.db = null;
        }
    }
}