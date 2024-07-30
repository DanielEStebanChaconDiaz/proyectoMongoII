import Connection from '../../db/connect/connect.js';
import { MongoClient } from 'mongodb';

export default class Users {
    constructor() {
        this.connection = new Connection();
        this.client = null;
        this.db = null;
        this.adminUri = 'mongodb://mongo:QzTrGVnGyYjBHnmnBVuVcOtJNGxHvEAL@roundhouse.proxy.rlwy.net:17787/'
        this.dbName = 'cineCampus';
    }

    async connect() {
        if (!this.db) {
            try {
                // Usamos una conexión predefinida
                this.db = await this.connection.connect();
            } catch (err) {
                console.error('Error connecting to the database:', err);
            }
        }
    }

    async registrarNuevoUsuario() {
        try {
            // Conectar con el usuario administrador
            this.client = new MongoClient(this.adminUri);
            await this.client.connect();
            console.log("Conectado como administrador para crear nuevo usuario.");

            // Datos predefinidos
            const nombre = 'juanito'; // Nombre del nuevo usuario
            const contraseña = '1234'; // Contraseña del nuevo usuario

            const db = this.client.db(this.dbName);

            // Crear el nuevo usuario
            await db.command({
                createUser: nombre,
                pwd: contraseña,
                roles: [
                    { role: "usuario", db: this.dbName }
                ]
            });

            const name = 'juanito';
            const email = 'juanitojuega@gmail.com';
            const numero = 319008921;
            const CC = 1097495849;
            const Estado = 'Estandar'
            const userNew = {
                username: name,
                email: email,
                numero: numero,
                CC: CC,
                Estado: Estado,
            };

            // Inserta el nuevo usuario en la colección 'users'
            await db.collection('users').insertOne(userNew);
            console.log(`Usuario ${nombre} creado exitosamente.`);

            // Cerrar la conexión de administrador
            await this.client.close();

        } catch (error) {
            console.error("Error:", error);
        } finally {
            if (this.client) {
                await this.client.close();
            }
        }
        return "";
    }

    async updateRole(){
        try {
            // Conectar con el usuario administrador
            this.client = new MongoClient(this.adminUri);
            await this.client.connect();
            console.log("Conectado como administrador para actualizar usuario.");
        
            // Datos predefinidos
            const nombre = 'pepe'; // Nombre del usuario a actualizar
            const contraseña = '1234'; // Nueva contraseña del usuario
        
            const db = this.client.db(this.dbName);
        
            // Actualizar el usuario existente
            await db.command({
                updateUser: nombre,
                pwd: contraseña,
                roles: [
                    { role: "usuario", db: this.dbName },
                    { role: "usuarioVip", db: this.dbName } // Añadir rol de usuario VIP
                ]
            });
        
            const email = 'juanitojuega@gmail.com';
            const numero = 319008921;
            const CC = 1097495849;
            const Estado = 'VIP'; // Cambiado a VIP
        
            // Actualizar el usuario en la colección 'users'
            const result = await db.collection('users').updateOne(
                { username: nombre },
                {
                    $set: {
                        email: email,
                        numero: numero,
                        CC: CC,
                        Estado: Estado,
                    }
                }
            );
        
            if (result.matchedCount === 0) {
                console.log(`Usuario ${nombre} no encontrado.`);
            } else if (result.modifiedCount === 0) {
                console.log(`No se realizaron cambios para el usuario ${nombre}.`);
            } else {
                console.log(`Usuario ${nombre} actualizado exitosamente.`);
            }
        
            // Cerrar la conexión de administrador
            await this.client.close();
        
        } catch (error) {
            console.error("Error:", error);
        } finally {
            if (this.client) {
                await this.client.close();
            }
        }
    }

    async getUsers() {
        await this.connect();
        try {
            let users = '';

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
        }
    }

    async getUsersDescription() {
        await this.connect();
        try {
            const collection = await this.db.collection('users').find().toArray();
            return collection;
        } catch (err) {
            console.error('Error fetching user:', err);
        }
    }
    async verificarTarjetaVIP(numeroTarjeta) {
        await this.connect();
        try {
            const tarjeta = await this.db.collection('vip-cards').findOne({ cardNumber: numeroTarjeta });
            return 'Usted posee un 15% de descuento por ser cliente vip';
        } catch (error) {
            console.error("Error al verificar la tarjeta VIP:", error);
            return false;
        }
    }

    async closeConnection() {
        if (this.connection) {
            await this.connection.close();
            this.db = null;
        }
    }
}
