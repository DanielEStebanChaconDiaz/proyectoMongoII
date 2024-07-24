// models/movies.js
import Connection from '../../db/connect/connect.js';

export class Movies {
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

    async getMovies(user, pws) {
        await this.connect(user, pws);
        try {
            const collections = await this.db.collection('movies').find().toArray();
            return collections;
        } catch (err) {
            console.error('Error fetching movies:', err);
        }
    }

    async getMoviesDescription(user, pws) {
        await this.connect(user, pws);
        try {
            const collections = await this.db.collection('movies').aggregate([
                {
                    $lookup: {
                        from: 'movie-description',
                        localField: 'movieId',
                        foreignField: 'movieId',
                        as: 'Description'
                    }
                },
                {
                    $unwind: '$Description'
                },
                {
                    $project: {
                        Title: '$title',
                        Description: '$Description.description',
                        Genre: '$Description.genre',
                        Duration: '$Description.duration'
                    }
                }
            ]).toArray();
            return collections;
        } catch (err) {
            console.error('Error fetching movie descriptions:', err);
        }
    }
    async agregarPelicula(user, pws, titulo, descripcion, precio) {
        await this.connect(user, pws);
        try {
            const nuevaPelicula = {
                title: titulo,
                description: descripcion,
                price: precio
            };
    
            const result = await this.db.collection('movies').insertOne(nuevaPelicula);
            return result;
        } catch (err) {
            console.error('Error al agregar la película:', err);
            throw err;
        } finally {
            await this.closeConnection();
        }
    }

    async closeConnection() {
        if (this.connection) {
            await this.connection.close();
            this.db = null;
        }
    }
}