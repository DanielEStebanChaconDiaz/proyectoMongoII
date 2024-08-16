// Función para guardar datos en caché
function saveToCache(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Función para obtener datos del caché
function getFromCache(key) {
    const cachedData = localStorage.getItem(key);
    return cachedData ? JSON.parse(cachedData) : null;
}

// Función para eliminar datos del caché (opcional)
function removeFromCache(key) {
    localStorage.removeItem(key);
}

function playTrailer(videoId) {
    const movieContainer = document.querySelector('.swiper-slide');

    if (!movieContainer) {
        console.error('Movie container not found');
        return;
    }

    const img = movieContainer.querySelector('.movie-img');

    if (!img) {
        console.error('Image element not found');
        return;
    }

    // Crear un contenedor para el lite-youtube
    const trailerContainer = document.createElement('div');
    trailerContainer.classList.add('trailer-container');

    // Insertar el componente lite-youtube con el ID del video
    trailerContainer.innerHTML = `<lite-youtube videoid="${videoId}"></lite-youtube>`;

    // Ajustar el tamaño del lite-youtube si es necesario
    const liteYoutube = trailerContainer.querySelector('lite-youtube');
    if (liteYoutube) {
        setTimeout(() => {
            liteYoutube.click(); // Simular un clic para iniciar el video
        }, 500);
    }

    // Reemplazar la imagen con el contenedor del trailer
    img.parentNode.replaceChild(trailerContainer, img);
}

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id'); // Obtiene el parámetro 'id' de la URL

    if (movieId) {
        loadMovie(movieId);
        console.log(movieId);
    } else {
        console.warn('No movie ID found in URL');
    }

    function loadMovie(movieId) {
        const movieList = document.querySelector('.card');
        if (!movieList) {
            console.warn('Advertencia: No se encontró el elemento .card');
            return;
        }
        movieList.innerHTML = ''; // Limpiar resultados anteriores

        // Intentar obtener los resultados del caché
        const cachedMovie = getFromCache(`movie_${movieId}`);
        if (cachedMovie) {
            console.log('Datos obtenidos del caché');
            displayMovie(cachedMovie);
            return;
        }

        fetch(`/movies/v3?movieId=${movieId}`) // Envía solo el ID en la URL
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data); // Verifica la estructura de los datos

                if (Array.isArray(data) && data.length > 0) {
                    const movie = data[0]; // Asumimos que data contiene un único objeto de película

                    // Verifica que movie.movie_actors sea un array
                    const actors = Array.isArray(movie.movie_actors) ? movie.movie_actors : [];
                    const cinemas = Array.isArray(movie.cinemas) ? movie.cinemas : [];
                    let cinemasHTML = ''; // Inicializa variable para acumular cines
                    let actorsHTML = ''; // Inicializa variable para acumular actores

                    for (let i = 0; i < cinemas.length; i++) {
                        const cinema = cinemas[i];
                        const nombre = cinema.nombre;
                        const direccion = cinema.direccion;
                        const image = cinema.imagen_url;
                        cinemasHTML += `
                          <div class="cine">
                            <div class="cine-info">
                              <p class="cine-name">${nombre}</p>
                              <p class="cine-role">${direccion}</p>
                            </div>
                            <div class="cine-image">
                              <img src="${image}" alt="${nombre}">
                            </div>
                          </div>
                        `;
                    }

                    for (let i = 0; i < actors.length; i++) {
                        const actor = actors[i];
                        const image = actor.image_url;
                        const name = actor.name;
                        const role = actor.role;

                        // Acumula el HTML de los actores
                        actorsHTML += `
                          <div class="actor">
                            <div class="actor-image">
                              <img src="${image}" alt="${name}">
                            </div>
                            <div class="actor-info">
                              <p class="actor-name">${name}</p>
                              <p class="actor-role">${role}</p>
                            </div>
                          </div>
                        `;
                    }

                    // Genera el HTML para la película, incluyendo los actores acumulados
                    const movieItem = `
                        <div class="swiper-slide" data-id="${movie._id}">
                            <img src="${movie.image_url}" alt="${movie.title}" class='movie-img'>
                            <div class='title'>
                                <h2>${movie.title}</h2>
                                <button class='trailer' data-trailer-iframe="${movie.trailerUrl}">
                                    <i class='bx bx-play'></i>Watch trailer
                                </button>
                                <p class="genre">${movie.genres}</p>
                            </div>
                            <p class="synopsis">${movie.synopsis}</p>

                            <!-- Añade los actores -->
                            <h1 class='cast-title'>Cast</h1>
                            <div class="cast">
                                ${actorsHTML}
                            </div>
                            <h1 class='cast-title'>Cinemas</h1>
                            <div class="cinemas">
                                ${cinemasHTML}
                                <button id='playButton' class="button">Book Now</button>
                            </div>
                        </div>
                    `;

                    // Inserta el HTML generado en el contenedor
                    movieList.innerHTML = movieItem;

                    // Guardar en caché
                    saveToCache(`movie_${movieId}`, {
                        movieItem,
                        trailerUrl: movie.trailerUrl
                    });

                    const trailerButton = document.querySelector('.trailer');
                    if (trailerButton) {
                        trailerButton.addEventListener('click', function (event) {
                            const iframeHtml = this.getAttribute('data-trailer-iframe');
                            playTrailer(iframeHtml);
                        });
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching movies:', error);
                movieList.innerHTML = '<p>Error al obtener las películas.</p>';
            });
    }

    function displayMovie(cachedMovie) {
        const movieList = document.querySelector('.card');
        if (!movieList) {
            console.warn('Advertencia: No se encontró el elemento .card');
            return;
        }
        movieList.innerHTML = cachedMovie.movieItem;

        const trailerButton = document.querySelector('.trailer');
        if (trailerButton) {
            trailerButton.addEventListener('click', function (event) {
                const iframeHtml = this.getAttribute('data-trailer-iframe');
                playTrailer(iframeHtml);
            });
        }
    }

    // Asegúrate de que el elemento .back-button existe en el DOM
    const backButton = document.getElementById('atras');
    if (backButton) {
        backButton.addEventListener('click', function () {
            window.history.back();  // O puedes usar window.history.go(-1);
        });
    } else {
        console.warn('Advertencia: No se encontró el botón de retroceso con el id "atras".');
    }
});
