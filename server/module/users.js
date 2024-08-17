const { MongoClient } = require('mongodb');
const Connection = require('../helpers/connect');
const bcrypt = require('bcrypt'); // Para el hashing de contraseñas

module.exports = class Users {
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

    async registerUser(nombre, email, password) {
        try {
            // Conectar a la base de datos
            const db = await this.connect();
            const usersCollection = db.collection('users');
    
            // Hash de la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // Inserta los datos del usuario en la colección 'users'
            const result = await usersCollection.insertOne({
                nombre: nombre,
                email: email,
                contraseña: hashedPassword,
                createdAt: new Date(),
            });
    
            console.log(`Usuario registrado con ID: ${result.insertedId}`);
            return result;
    
        } catch (err) {
            console.error('Error registering user:', err);
            throw new Error('User registration failed');
        }
    }
    
    async getUsersFroEmail(email) {
        try {
            // Asegúrate de que showtime_id sea una cadena de 24 caracteres hexadecimales válidos

            await this.connect(); // Asegúrate de que la conexión se establezca primero

            // Busca documentos en 'seats' donde showtime_id coincida
            const result = await this.db.collection('users').aggregate([
              {
                $match: {
                    email: email
                }
              }
            ]).toArray();

            return result;
        } catch (err) {
            console.error('Error al encontrar peliculas:', err);
            throw err; // Propaga el error para que pueda ser manejado adecuadamente en otros lugares
        }
    }
};
