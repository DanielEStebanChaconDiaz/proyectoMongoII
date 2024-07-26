// models/movies.js
import Connection from '../../db/connect/connect.js';
import readlineSync from 'readline-sync';

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
    async agregarPelicula(user, pws) {
        await this.connect(user, pws);
        try {
            let movieId;
            let existingMovie;
            let title;
            let existingMovieName;
    
            do {
                movieId = parseInt(readlineSync.question('Ingrese el ID de la película: '));
                existingMovie = await this.db.collection('movies').findOne({ movieId: movieId });
                if (existingMovie) {
                    console.log('Error: Ya existe una película con este ID. Inténtelo de nuevo.');
                    continue;
                }
    
                title = readlineSync.question('Ingrese el título de la película: ');
                existingMovieName = await this.db.collection('movies').findOne({ title: title });
                if (existingMovieName) {
                    console.log('Error: Ya existe una película con este título. Inténtelo de nuevo.');
                }
            } while (existingMovie || existingMovieName);
    
            const rating = parseFloat(readlineSync.question('Ingrese el rating de la película (0-10): '));
            const genre = readlineSync.question('Ingrese el género de la película: ');
            const duration = parseInt(readlineSync.question('Ingrese la duración de la película (en minutos): '));
            const description = readlineSync.question('Ingrese la descripción de la película: ');
    
            // Obtener la fecha y hora actual
            const creationDate = new Date();
    
            const movieDocument = {
                movieId: movieId,
                title: title,
                creationDate: creationDate, // Fecha y hora de creación del registro
                rating: rating,
            };
    
            const descriptionDocument = {
                movieId: movieId,
                description: description,
                genre: genre,
                duration: duration
            };
    
            await this.db.collection('movies').insertOne(movieDocument);
            await this.db.collection('movie-description').insertOne(descriptionDocument);
    
            console.log('Película agregada exitosamente.');
            return `Película agregada: ${title} (Creada el ${creationDate.toLocaleString()})`;
        } catch (err) {
            console.error('Error al agregar la película:', err);
            return 'Error al agregar la película: ' + err.message;
        }
    }
    async dropMovie(user, pws) {
        await this.connect(user, pws);
        try {
            const movieId = parseInt(readlineSync.question('Ingrese el ID de la película que desea eliminar: '));
            const existingMovie = await this.db.collection('movies').findOne({ movieId: movieId });
    
            if (existingMovie) {
                await this.db.collection('movies').deleteOne({ movieId: movieId });
                await this.db.collection('movie-description').deleteOne({ movieId: movieId });
                console.log('Película eliminada con éxito.');
                return `Película con ID ${movieId} eliminada con éxito.`;
            } else {
                console.log('No se encontró la película con el ID ingresado.');
                return `No se encontró la película con ID ${movieId}.`;
            }
        } catch (err) {
            console.error('Error al eliminar la película:', err);
            return 'Error al eliminar la película: ' + err.message;
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
    
    
    async closeConnection() {
        if (this.connection) {
            await this.connection.close();
            this.db = null;
        }
    }
}