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

    async registerUser(name, email, password) {
        try {
            // Conectar a la base de datos
            const db = await this.connect();
            const usersCollection = db.collection('users');
    
            // Hash de la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // Inserta los datos del usuario en la colección 'users'
            const result = await usersCollection.insertOne({
                nombre: name,
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

    
    
};
