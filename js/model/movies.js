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
    /**
 * Recupera un documento de película por su título de la base de datos.
 *
 * @function getMovieForName
 * @memberof Movies
 * @instance
 * @async
 * @returns {Promise<Object|null>} - Una Promesa que resuelve al documento de película si se encuentra, o null si no se encuentra.
 * @throws Lanza un error si hay un problema al conectarse a la base de datos o al recuperar la película.
 *
 * @example
 * const pelicula = await peliculas.getMovieForName();
 * console.log(pelicula);
 */
async getMovieForName(){
    await this.connect();
    try {
        const collection = await this.db.collection('movies').findOne({ title: 'Avengers' });
        return collection;
    } catch (err) {
        console.error('Error al recuperar la película:', err);
    }
}
    /**
 * Recupera descripciones de películas de la base de datos y realiza una operación de combinación con la colección 'movie-description'.
 *
 * @function getMovie
 * @memberof Movies
 * @instance
 * @async
 * @returns {Promise<Array>} - Una Promesa que resuelve a un array de descripciones de películas.
 * @throws Lanza un error si hay un problema conectándose a la base de datos o recuperando las descripciones de películas.
 *
 * @example
 * const descripcionesPeliculas = await peliculas.getMovie();
 * console.log(descripcionesPeliculas);
 */
async getMovie() {
    await this.connect();
    try {
        const colecciones = await this.db.collection('movies').aggregate([
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
                    Título: '$title',
                    Género: '$Description.genre',
                    Duración: '$Description.duration',
                    Sinopsis: '$Description'
                }
            }
        ]).toArray();
        return colecciones;
    } catch (err) {
        console.error('Error al recuperar descripciones de películas:', err);
    }
}
   /**
 * Recupera información detallada de películas de la base de datos, incluyendo descripciones y programación de cine.
 * Realiza una operación de combinación entre las colecciones 'movies', 'movie-description' y 'cinemas'.
 *
 * @function getMoviesDescription
 * @memberof Movies
 * @instance
 * @async
 *
 * @returns {Promise<Array>} - Una Promesa que resuelve a un array de información detallada de películas.
 * Cada objeto en el array contiene el título de la película, género, duración y programación.
 *
 * @throws {Error} Lanza un error si hay un problema conectándose a la base de datos o recuperando descripciones de películas.
 *
 * @example
 * const descripcionesDetalladas = await peliculas.getMoviesDescription();
 * console.log(descripcionesDetalladas);
 */
async getMoviesDescription() {
    await this.connect();
    try {
        const colecciones = await this.db.collection('movies').aggregate([
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
                    Título: '$title',
                    Género: '$Description.genre',
                    Duración: '$Description.duration',
                    Programación: '$Programacion.functions'
                }
            }
        ]).toArray();
        return colecciones;
    } catch (err) {
        console.error('Error al recuperar descripciones detalladas de películas:', err);
    }
}

    /**
 * Añade una nueva película a la base de datos.
 *
 * @function agregarPelicula
 * @memberof Movies
 * @instance
 * @async
 *
 * @returns {Promise<string>} - Una Promesa que resuelve a un mensaje de éxito o un mensaje de error.
 *
 * @throws {Error} Lanza un error si hay un problema conectándose a la base de datos o añadiendo la película.
 *
 * @example
 * const resultado = await peliculas.agregarPelicula();
 * console.log(resultado);
 */
async agregarPelicula() {
    await this.connect();
    try {
        let movieId;
        let existingMovie;
        let title;
        let existingMovieName;

        // Datos predefinidos para pruebas
        const predefinedMovies = [
            { movieId: 1, title: 'Inception' },
            { movieId: 2, title: 'Interstellar' }
        ];

        // Simula la entrada del usuario
        movieId = 3; // Ejemplo
        existingMovie = predefinedMovies.find(movie => movie.movieId === movieId);

        if (existingMovie) {
            console.log('Error: Ya existe una película con este ID. Inténtelo de nuevo.');
            return 'Error: Ya existe una película con este ID.';
        }

        title = 'The Dark Knight'; // Ejemplo
        existingMovieName = predefinedMovies.find(movie => movie.title === title);

        if (existingMovieName) {
            console.log('Error: Ya existe una película con este título. Inténtelo de nuevo.');
            return 'Error: Ya existe una película con este título.';
        }

        const rating = 9.0; // Ejemplo
        const genre = 'Action'; // Ejemplo
        const duration = 152; // Ejemplo
        const description = 'Una película compleja y emocionante'; // Ejemplo

        // Obtiene la fecha y hora actual
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

    /**
 * Elimina una película de la base de datos.
 *
 * @function dropMovie
 * @memberof Movies
 * @instance
 * @async
 *
 * @returns {Promise<string>} - Una Promesa que resuelve a un mensaje de éxito o un mensaje de error.
 *
 * @throws {Error} Lanza un error si hay un problema conectándose a la base de datos o eliminando la película.
 *
 * @example
 * const resultado = await peliculas.dropMovie();
 * console.log(resultado);
 */
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
