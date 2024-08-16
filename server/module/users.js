const { MongoClient } = require('mongodb');
const admin = require('./firebase-admin'); // Asegúrate de que esta ruta sea correcta
require('dotenv').config(); // Para cargar variables de entorno desde .env
const bcrypt = require('bcrypt'); // Para el hashing de contraseñas

class Users {
    constructor() {
        this.mongoUri = process.env.MONGO_URI;
        this.dbName = process.env.DB_NAME;
        this.client = null;
    }

    async connect() {
        try {
            if (!this.client || !this.client.isConnected()) {
                this.client = new MongoClient(this.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
                await this.client.connect();
            }
            this.db = this.client.db(this.dbName);
        } catch (err) {
            console.error('Error connecting to the database:', err);
            throw err;
        }
    }

    async registerUser(idToken, nombre, contraseña) {
        try {
            // Verifica el token ID con Firebase
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            const uid = decodedToken.uid;
            const email = decodedToken.email;

            // Hashear la contraseña
            const hashedPassword = await bcrypt.hash(contraseña, 10);

            // Conéctate a la base de datos administrativa
            await this.connect();

            // Crear la base de datos específica para el usuario
            const userDbName = `${uid}_db`;
            const userDbUri = `${this.mongoUri}/${userDbName}`;
            const userClient = new MongoClient(userDbUri, { useNewUrlParser: true, useUnifiedTopology: true });

            await userClient.connect();
            const userDb = userClient.db(userDbName);

            // Crear el usuario en la base de datos específica con rol readWrite
            await userDb.command({
                createUser: nombre,
                pwd: hashedPassword,
                roles: [{ role: 'readWrite', db: userDbName }]
            });

            // Almacenar la información del usuario en la colección principal
            const usersCollection = this.db.collection('users');
            const userDoc = {
                uid: uid,
                email: email,
                nombre: nombre,
                contraseña: hashedPassword, // Considera almacenar solo el hash de la contraseña
                createdAt: new Date(),
                mongoUri: userDbUri
            };

            const result = await usersCollection.insertOne(userDoc);

            // Cerrar la conexión con la base de datos específica del usuario
            await userClient.close();

            return result.insertedId;
        } catch (err) {
            console.error('Error registering user:', err);
            throw new Error('User registration failed');
        } finally {
            if (this.client) {
                await this.client.close();
            }
        }
    }
}

module.exports = Users;
