document.addEventListener('DOMContentLoaded', function () {
    loadMovies();
    loadMoviesComming();    
});

let swiper; // Variable global para la instancia de Swiper

function loadMovies() {
    const movieList = document.querySelector('.swiper-wrapper');
    if (!movieList) {
        console.error('Error: No se encontró el elemento .swiper-wrapper');
        return;
    }
    movieList.innerHTML = ''; // Limpiar resultados anteriores

    fetch('/movies/v1/all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if (Array.isArray(data) && data.length > 0) {
                const movieItems = data.map(movie => `
                        <div class="swiper-slide movie" data-id="${movie._id}">
                            <img src="${movie.image_url}" alt="${movie.title}">
                            <p class='name'>${movie.title}</p>
                            <p class='genre'>${Array.isArray(movie.genres) ? movie.genres.join(', ') : 'N/A'}</p>
                        </div>
                    `).join('');
                    
                movieList.innerHTML = movieItems;

                initSwiper(); // Inicializar Swiper después de actualizar el contenido
            } else {
                movieList.innerHTML = '<p>No se encontraron películas.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching movies:', error);
            movieList.innerHTML = '<p>Error al obtener las películas.</p>';
        });
}

function loadMoviesComming() {
    const movieList = document.querySelector('.movie-list-comming');
    if (!movieList) {
        console.error('Error: No se encontró el elemento .movie-list-comming');
        return;
    }
    movieList.innerHTML = ''; // Limpiar resultados anteriores

    fetch('/movies/v2/all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                const movieItems = data.map(movie => `
                        <div class="movie-comming" data-id="${movie._id}">
                            <img src="${movie.image_url}" alt="${movie.title}">
                            <div>
                            <p class='name-comming'>${movie.title} (${movie.year})</p>
                            <p class='genre-comming'>${Array.isArray(movie.genre) ? movie.genre.join(', ') : 'N/A'}</p>
                            </div>
                        </div>
                    `).join('');
                movieList.innerHTML = movieItems;

                initSwiper();
            } else {
                movieList.innerHTML = '<p>No se encontraron películas.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching movies:', error);
            movieList.innerHTML = '<p>Error al obtener las películas.</p>';
        });
}

function initSwiper() {
    if (swiper) {
        swiper.destroy();
    }
    swiper = new Swiper('.mySwiper', {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
            rotate: 0,
            stretch: 0,
            depth: 0,
            modifier: 1,
            slideShadows: false,
        },
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
}

// Manejo de clic en las películas
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');

    // Usando delegación de eventos
    document.addEventListener('click', function(event) {
        const movieElement = event.target.closest('.swiper-slide.movie') || event.target.closest('.movie-comming');
        if (movieElement) {
            const movieId = movieElement.getAttribute('data-id');
            if (movieId) {
                localStorage.setItem('selectedMovie', movieId);
                window.location.href = `/movie?id=${movieId}`; // Redirige a movie.html con el movieId como parámetro de consulta
            }
        }
    });
});


document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();

    let searchInput = document.getElementById('searchInput').value;
    // Convertir a minúsculas y eliminar espacios en blanco al inicio y al final
    searchInput = searchInput.toLowerCase().trim();
    // Eliminar espacios extra entre palabras
    searchInput = searchInput.replace(/\s+/g, ' ');
    // Capitalizar la primera letra de cada palabra
    searchInput = searchInput.replace(/\b\w/g, l => l.toUpperCase());

    const movieList = document.querySelector('.swiper-wrapper');
    if (!movieList) {
        console.error('Error: No se encontró el elemento .swiper-wrapper');
        return;
    }
    movieList.innerHTML = '';

    if (searchInput === '') {
        movieList.innerHTML = '<p>Por favor, ingrese un título de película.</p>';
        return;
    }

    fetch(`/movies/v1?title=${encodeURIComponent(searchInput)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const [movie, genre] = data; // Desestructurar la respuesta en movie y genre

            if (Array.isArray(movie) && movie.length > 0) {
                const movieItems = movie.map(m => `
                    <div class="swiper-slide movie" data-id="${m._id}">
                        <img src="${m.image_url}" alt="${m.title}">
                        <p>${m.title}</p>
                        <p>${Array.isArray(m.genres) ? m.genres.join(', ') : m.genres}</p>
                    </div>`
                ).join('');
                movieList.innerHTML = movieItems;

                initSwiper(); // Inicializar Swiper después de cargar las películas
            } else if (Array.isArray(genre) && genre.length > 0) {
                const movieItems = genre.map(m => `
                    <div class="swiper-slide movie" data-id="${m._id}">
                        <img src="${m.image_url}" alt="${m.title}">
                        <p>${m.title}</p>
                        <p>${Array.isArray(m.genres) ? m.genres.join(', ') : m.genres}</p>
                    </div>`
                ).join('');
                movieList.innerHTML = movieItems;
            } else {
                movieList.innerHTML = '<p>No se encontraron películas.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching movie:', error);
            movieList.innerHTML = '<p>Error al obtener la película.</p>';
        });
});