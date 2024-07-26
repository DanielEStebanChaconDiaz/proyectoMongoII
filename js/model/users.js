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
            await this.connect();
            let users

            const result = await this.db.command({ usersInfo: 1 });

            const cineCampusUsers = result.users.filter(user =>
                user.roles.some(role => role.db === 'cineCampus')
            );
            cineCampusUsers.forEach(usr => {
                users += (`- nombre: ${usr.user}\n`);
            });

            return users;
        } catch (err) {
            console.error('Error fetching users:', err);
            throw err;
        } finally {
            if (this.client) {
                await this.client.close();
            }
        }
    }

    async getSeats(user, pws) {
        await this.connect(user, pws);
        try {
            const collections = await this.db.collection('seats').find().toArray();
            return collections;
        } catch (err) {
            console.error('Error fetching movies:', err);
        }
    }
    async verificarTarjetaVIP(numeroTarjeta) {
        try {
            const tarjeta = await this.db.collection('vip-cards').findOne({ cardNumber: numeroTarjeta });
            return tarjeta !== null;
        } catch (error) {
            console.error("Error al verificar la tarjeta VIP:", error);
            return false;
        }
    }
    async comprarBoleto(resultSeats, descuento) {
        // Mostrar asientos disponibles
        console.log("Asientos Disponibles:");
        console.log(resultSeats);
    
        // Solicitar al usuario que ingrese el ID del asiento
        const seatId = readlineSync.question('Ingrese el ID del asiento que desea comprar: ');
    
        // Buscar el asiento en los datos proporcionados
        const asiento = resultSeats.find(seat => seat.seatId === parseInt(seatId));
    
        if (asiento) {
            // Cuando se va a realizar el pago:
            const precioOriginal = asiento.precio; // Asume que este es el precio base del boleto
            const precioFinal = precioOriginal * (1 - descuento);
    
            console.log(`Precio original del boleto: $${precioOriginal}`);
            if (descuento > 0) {
                console.log(`Descuento aplicado: ${descuento * 100}%`);
                console.log(`Precio final del boleto: $${precioFinal}`);
            }
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