import Connection from "../../db/connect/connect.js";
import { Seats } from "./seats.js";

export class Tickets {
    constructor() {
        this.connection = new Connection();
        this.db = null;
        this.seats = new Seats();
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
    async comprarBoleto() {
        await this.connect();
        // Datos predefinidos
        const resultSeats = await this.seats.getSeats();
        const seatId = 1; // Asume que el ID del asiento a comprar es 1
        const descuento = 0.15; // Asume un 15% de descuento

        // Buscar el asiento en los datos proporcionados
        const asiento = resultSeats.find(seat => seat.seatId === Number(seatId));


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
                        { seatId: seatId }, // Filtro para encontrar el asiento
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
            console.log(`El asiento ${seatId} no está disponible`);
        }
        return ""
    }
    async reservarBoleto() {
        await this.connect();
        // Datos predefinidos
        const resultSeats = await this.seats.getSeats();
        const seatId = 5; // Asume que el ID del asiento a reservar es 1
        const descuento = 0.15; // Asume un 15% de descuento
        const nombre = 'John Doe'; // Nombre del usuario para reserva
        const email = 'johndoe@example.com'; // Email del usuario para reserva

        // Mostrar asientos disponibles
        console.log("Asientos Disponibles:");
        console.log(resultSeats);

        // Buscar el asiento en los datos proporcionados
        const asiento = resultSeats.find(seat => seat.seatId === seatId);

        if (asiento) {
            if (asiento.estado === 'disponible') {
                // Cuando se va a realizar la reserva:
                const precioOriginal = asiento.precio; // Asume que este es el precio base del boleto
                const precioFinal = precioOriginal * (1 - descuento);

                console.log(`Precio original del boleto: $${precioOriginal}`);
                console.log(`Descuento: ${descuento}`);
                if (descuento > 0) {
                    console.log(`Descuento aplicado: ${descuento * 100}%`);
                    console.log(`Precio final del boleto: $${precioFinal}`);
                }

                // Generar un código de reserva único
                const codigoReserva = Math.random().toString(36).substring(2, 10).toUpperCase();

                // Actualizar el estado del asiento a 'reservado'
                try {
                    const result = await this.db.collection('seats').updateOne(
                        { seatId: seatId },
                        {
                            $set: {
                                estado: 'reservado',
                                reservadoPor: {
                                    nombre: nombre,
                                    email: email,
                                    codigoReserva: codigoReserva
                                }
                            }
                        }
                    );

                    if (result.modifiedCount > 0) {
                        console.log(`
                        Reserva realizada con éxito:
                        - Asiento: ${seatId}
                        - Nombre: ${nombre}
                        - Email: ${email}
                        - Código de reserva: ${codigoReserva}
                        - Precio final: $${precioFinal}
                        `);
                        console.log("Por favor, guarde su código de reserva. Lo necesitará para canjear su boleto en taquilla.");
                    } else {
                        console.log('No se pudo actualizar el estado del asiento. Inténtalo de nuevo.');
                    }
                } catch (err) {
                    console.error('Error al actualizar el estado del asiento:', err);
                }
            } else {
                console.log(`El asiento ${seatId} no está disponible para la reserva.`);
            }
        } else {
            console.log('ID de asiento no válido.');
        }
    }
    /**
     * Cancels a seat reservation based on the provided reservation code.
     *
     * @param {string} codigo - The reservation code to cancel.
     * @returns {Promise<void>} - A promise that resolves when the cancellation is successful or rejects with an error.
     */
    async cancelarReserva(codigo) {
        await this.connect();
        // Assumed predefined data
        const codigoReserva = codigo; // Assumes a reservation code to cancel

        try {
            // Search for the reserved seat using the reservation code
            const asientoReservado = await this.db.collection('seats').findOne({ 'reservadoPor.codigoReserva': codigoReserva });

            if (asientoReservado) {
                // Update the seat state to 'disponible' and remove reservation information
                const result = await this.db.collection('seats').updateOne(
                    { seatId: asientoReservado.seatId },
                    { $set: { estado: 'disponible' }, $unset: { reservadoPor: "" } }
                );

                if (result.modifiedCount > 0) {
                    console.log(`
                Reserva cancelada con éxito:
                - Asiento: ${asientoReservado.seatId}
                - Código de reserva: ${codigoReserva}
                `);
                } else {
                    console.log('No se pudo actualizar el estado del asiento. Inténtalo de nuevo.');
                }
            } else {
                console.log('Código de reserva no válido o no encontrado.');
            }
        } catch (err) {
            console.error('Error al cancelar la reserva:', err);
        }
    }
}