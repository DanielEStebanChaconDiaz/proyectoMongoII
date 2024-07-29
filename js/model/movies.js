import Connection from '../../db/connect/connect.js';

export class Movies {
    constructor() {
        this.connection = new Connection();
        this.db = null;
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
    async getMovieForName(){
        await this.connect();
        try {
            const collection = await this.db.collection('movies').findOne({ title: 'Avengers' });
            return collection;
        } catch (err) {
            console.error('Error fetching movie:', err);
        }
    }
    async getMovie() {
        await this.connect();
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
                    $project: {
                        Title: '$title',
                        Genre: '$Description.genre',
                        Duration: '$Description.duration',
                        Sinopsis: '$Description'
                    }
                }
            ]).toArray();
            return collections;
        } catch (err) {
            console.error('Error fetching movie descriptions:', err);
        }
    }
    async getMoviesDescription() {
        await this.connect();
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
                    $lookup: {
                      from: 'cinemas',
                      localField: 'movieId',
                      foreignField: 'functions.movieId',
                      as: 'Programacion'
                    }
                  },
                {
                    $unwind: '$Description'
                },
                {
                    $unwind: '$Programacion'
                },
                {
                    $project: {
                        Title: '$title',
                        Genre: '$Description.genre',
                        Duration: '$Description.duration',
                        Programacion: '$Programacion.functions'
                    }
                }
            ]).toArray();
            return collections;
        } catch (err) {
            console.error('Error fetching movie descriptions:', err);
        }
    }

    async agregarPelicula() {
        await this.connect();
        try {
            let movieId;
            let existingMovie;
            let title;
            let existingMovieName;
    
            // Datos predefinidos para prueba
            const predefinedMovies = [
                { movieId: 1, title: 'Inception' },
                { movieId: 2, title: 'Interstellar' }
            ];
    
            // Simula la entrada del usuario
            movieId = 3; // Por ejemplo
            existingMovie = predefinedMovies.find(movie => movie.movieId === movieId);
    
            if (existingMovie) {
                console.log('Error: Ya existe una película con este ID. Inténtelo de nuevo.');
                return 'Error: Ya existe una película con este ID.';
            }
    
            title = 'The Dark Knight'; // Por ejemplo
            existingMovieName = predefinedMovies.find(movie => movie.title === title);
    
            if (existingMovieName) {
                console.log('Error: Ya existe una película con este título. Inténtelo de nuevo.');
                return 'Error: Ya existe una película con este título.';
            }
    
            const rating = 9.0; // Por ejemplo
            const genre = 'Action'; // Por ejemplo
            const duration = 152; // Por ejemplo
            const description = 'A complex and thrilling movie'; // Por ejemplo
    
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

    async dropMovie() {
        await this.connect();
        try {
            // Datos predefinidos para prueba
            const predefinedMovieId = 3; // Por ejemplo
    
            const existingMovie = await this.db.collection('movies').findOne({ movieId: predefinedMovieId });
    
            if (existingMovie) {
                await this.db.collection('movies').deleteOne({ movieId: predefinedMovieId });
                await this.db.collection('movie-description').deleteOne({ movieId: predefinedMovieId });
                console.log('Película eliminada con éxito.');
                return `Película con ID ${predefinedMovieId} eliminada con éxito.`;
            } else {
                console.log('No se encontró la película con el ID ingresado.');
                return `No se encontró la película con ID ${predefinedMovieId}.`;
            }
        } catch (err) {
            console.error('Error al eliminar la película:', err);
            return 'Error al eliminar la película: ' + err.message;
        }
    }

    async closeConnection() {
        if (this.connection) {
            await this.connection.close();
            this.db = null;
        }
    }
}
