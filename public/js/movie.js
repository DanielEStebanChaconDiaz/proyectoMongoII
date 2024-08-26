// Variable global para almacenar el ID del cine seleccionado
let selectedCinemaId = null;

// Función para reproducir el tráiler
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

// Función para obtener el ID de la película de la URL
function getMovieId() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id'); // Obtiene el parámetro 'id' de la URL
    if (movieId) {
        return movieId;
    } else {
        console.warn('No movie ID found in URL');
        return null;
    }
}
export { getMovieId }

// Función para cargar la película
function loadMovie(movieId) {
    const movieList = document.querySelector('.card');
    if (!movieList) {
        console.warn('Advertencia: No se encontró el elemento .card');
        return;
    }
    movieList.innerHTML = ''; // Limpiar resultados anteriores

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
                    let cineId = cinema._id;
                    console.log(cineId);
                    cinemasHTML += `
                      <div class="cine" data-id="${cineId}">
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
                            </div>
                           <div class='comprar2'> <button id='playButton' class="button">Book Now</button> </div>
                    </div>
                `;

                // Inserta el HTML generado en el contenedor
                movieList.innerHTML = movieItem;

                const trailerButton = document.querySelector('.trailer');
                if (trailerButton) {
                    trailerButton.addEventListener('click', function (event) {
                        const iframeHtml = this.getAttribute('data-trailer-iframe');
                        playTrailer(iframeHtml);
                    });
                }
                setupBookNowButton(); // Configura el botón "Book Now"
            }
        })
        .catch(error => {
            console.error('Error fetching movies:', error);
            movieList.innerHTML = '<p>Error al obtener las películas.</p>';
        });
    
    const backButton = document.getElementById('atras');
    if (backButton) {
        backButton.addEventListener('click', function () {
            window.location.href = '/movies';
        });
    } else {
        console.warn('Advertencia: No se encontró el botón de retroceso con el id "atras".');
    }
}

// Función para configurar el botón "Book Now"
function setupBookNowButton() {
    const bookButton = document.querySelector('.button');
    if (bookButton) {
        bookButton.addEventListener('click', function () {
            const movieElement = document.querySelector('.swiper-slide');
            if (movieElement && selectedCinemaId) {
                const movieId = movieElement.getAttribute('data-id');
                window.location.href = `/seats/${movieId}/${selectedCinemaId}`;
            } else {
                console.error('No se encontró el elemento de película o no se ha seleccionado un cine.');
            }
        });
    } else {
        console.error('No se encontró el botón con la clase .button');
    }
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

    // Evento para capturar el ID del cine al hacer clic en él
    document.addEventListener('click', function (event) {
        const cinemaElement = event.target.closest('.cine');
        if (cinemaElement) {
            selectedCinemaId = cinemaElement.getAttribute('data-id');
            console.log('Cine seleccionado:', selectedCinemaId);
        }
    });
});
