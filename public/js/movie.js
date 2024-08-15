document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id'); // Obtiene el parámetro 'id' de la URL

    if (movieId) {
        loadMovie(movieId);
        console.log(movieId)
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
                    let actorsHTML = ''; // Inicializa variable para acumular actores
    
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
                            <img src="${movie.image_url}" alt="${movie.title}" class= 'movie-img'>
                            <div class='title'>
                                <h2>${movie.title}</h2>
                                <button class='trailer'><i class='bx bx-play'></i>Watch trailer</button>
                                <p class="genre">${movie.genres}</p>
                            </div>
                            <p class="synopsis">${movie.synopsis}</p>
    
                            <!-- Añade los actores -->
                            <h1 class='cast-title'>Cast</h1>
                            <div class="cast">
                            
                                ${actorsHTML}
                            </div>
    
                            <button class="button">Book Now</button>
                        </div>
                    `;
    
                    // Inserta el HTML generado en el contenedor
                    movieList.innerHTML = movieItem;
                }
            })
            .catch(error => {
                console.error('Error fetching movies:', error);
                movieList.innerHTML = '<p>Error al obtener las películas.</p>';
            });
    }
})    
    // Asegúrate de que el elemento .back-button existe en el DOM
    const backButton = document.getElementById('atras');
    if (backButton) {
        backButton.addEventListener('click', function () {
            window.history.back();  // O puedes usar window.history.go(-1);
        });    
    } else {
        console.warn('Advertencia: No se encontró el botón de retroceso con el id "atras".');
    }
    