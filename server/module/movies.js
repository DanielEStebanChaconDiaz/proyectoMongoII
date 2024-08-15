const { ObjectId } = require('mongodb');
const Connection = require('../helpers/connect');

module.exports = class Movie {
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

    async getMoviesForTitle(title) {
        try {
            // Asegúrate de que showtime_id sea una cadena de 24 caracteres hexadecimales válidos

            await this.connect(); // Asegúrate de que la conexión se establezca primero

            // Busca documentos en 'seats' donde showtime_id coincida
            const result = await this.db.collection('movies').aggregate([
                {
                    $match: { title: title }
                }
            ]).toArray();

            return result;
        } catch (err) {
            console.error('Error al encontrar peliculas:', err);
            throw err; // Propaga el error para que pueda ser manejado adecuadamente en otros lugares
        }
    }
    async getMoviesForGenre(title) {
        try {
            // Conexión a la base de datos
            await this.connect(); 
    
            // Filtra documentos en 'movies' donde 'genre' contenga 'title'
            const result = await this.db.collection('movies').aggregate([
                {
                    $unwind: '$genres'
                },
                {
                    $match: { genres: title } // Comprueba si 'title' está en el arreglo 'genre'
                }
            ]).toArray();
    
            return result;
        } catch (err) {
            console.error('Error al encontrar películas:', err);
            throw err; // Propaga el error para que pueda ser manejado adecuadamente en otros lugares
        }
    }
    
    async getMovies(){
        try {
            await this.connect(); // Asegúrate de que la conexión se establezca primero

            // Busca todos los documentos en la colección 'movies'
            const result = await this.db.collection('movies').aggregate(
                [
                    {
                      $match: {
                        release_date: { $lte: new Date() }  // Películas cuya fecha de estreno es menor o igual a la fecha actual
                      }
                    },
                    {
                      $project: {
                        title: 1,
                        image_url: 1,
                        genres: 1,
                        release_date: 1,
                        year: { $year: "$release_date" }
                      }
                    }
                  ]
                  
            ).toArray();

            return result;
        } catch (err) {
            console.error('Error al recuperar peliculas:', err);
            throw err; // Propaga el error para que pueda ser manejado adecuadamente en otros lugares
        }
    }
    async getMoviesComming(){
        try {
            await this.connect(); // Asegúrate de que la conexión se establezca primero

            // Busca todos los documentos en la colección 'movies'
            const result = await this.db.collection('movies').aggregate(
                [{
                    $match: {
                      release_date: { $gt: new Date() }
                    }
                  },
                  {
                    $project: {
                      title: 1,
                      image_url: 1,
                      genre: 1,
                      release_date: 1,
                      year: { $year: "$release_date" }
                    }
                  }]
            ).toArray();

            return result;
        } catch (err) {
            console.error('Error al recuperar peliculas:', err);
            throw err; // Propaga el error para que pueda ser manejado adecuadamente en otros lugares
        }
    }
    async getMoviesForId(movieId){
        try {
            await this.connect(); // Asegúrate de que la conexión se establezca primero

            // Busca todos los documentos en la colección 'movies'
            const result = await this.db.collection('movies').aggregate(
                [
                    {
                      $match: {
                        _id: new ObjectId(movieId)  // Filtra la película por ID
                      }
                    },
                    {
                      $lookup: {
                        from: "actors",           // Nombre de la colección de actores
                        localField: "actors.actor_id", // Campo en la colección de películas que se usará para hacer la referencia
                        foreignField: "_id",     // Campo en la colección de actores que coincide con el campo local
                        as: "movie_actors"       // Nombre del campo en el resultado que contendrá la información de los actores
                      }
                    },
                    {
                      $unwind: "$movie_actors"    // Descompone el array de actores para obtener un documento por actor
                    },
                    {
                      $group: {
                        _id: "$_id",               // Agrupa por el ID de la película
                        title: { $first: "$title" },
                        image_url: { $first: "$image_url" },
                        genres: { $first: "$genres" },
                        release_date: { $first: "$release_date" },
                        year: { $first: { $year: "$release_date" } },
                        synopsis: { $first: "$synopsis" },
                        movie_actors: {            // Agrupa todos los actores en un solo array
                          $push: {
                            name: "$movie_actors.name",
                            image_url: "$movie_actors.image_url",
                            role: "$movie_actors.role"
                          }
                        },
                        trailerUrl: { $first: "$trailerUrl" }
                      }
                    },
                    {
                      $lookup: {
                        from: "cinemas",            // Nombre de la colección de cines
                        localField: "_id",        // ID de la película que estamos buscando
                        foreignField: "peliculas", // Campo en la colección de cines que contiene el array de IDs de películas
                        as: "cinemas"             // Nombre del campo en el resultado que contendrá la información de los cines
                      }
                    },
                    {
                      $project: {
                        _id: 1,
                        title: 1,
                        image_url: 1,
                        trailerUrl: 1,         // Muestra el array de actores agrupados
                        genres: 1,
                        release_date: 1,
                        year: 1,
                        synopsis: 1,
                        movie_actors: 1,  
                        cinemas: 3, 
                      }
                    }
                  ]
                  
                  
            ).toArray();

            return result;
        } catch (err) {
            console.error('Error al recuperar peliculas:', err);
            throw err; // Propaga el error para que pueda ser manejado adecuadamente en otros lugares
        }
    }
}