import { getAuth } from 'https://www.gstatic.com/firebasejs/9.0.2/firebase-auth.js';

// Configura Firebase y la autenticación
const auth = getAuth();

// Función para verificar si el usuario está autenticado
function checkAuthentication() {
    return new Promise((resolve) => {
        auth.onAuthStateChanged(user => {
            if (user) {
                resolve(true); // Usuario autenticado
            } else {
                resolve(false); // Usuario no autenticado
            }
        });
    });
}

// Redirigir al login si no está autenticado
async function redirectIfNotAuthenticated() {
    const isAuthenticated = await checkAuthentication();
    if (!isAuthenticated) {
        window.location.href = '/login'; // Redirigir al login
    }
}

// Verificar autenticación al cargar el DOM
document.addEventListener('DOMContentLoaded', async function () {
    await redirectIfNotAuthenticated();
    loadMovies();
    loadMoviesComming();  
});



document.addEventListener('DOMContentLoaded', () => {
    // Obtener los elementos de la navegación
    const homeButton = document.querySelector('.bottom-nav .nav-item:nth-child(1)');
    const browseButton = document.querySelector('.bottom-nav .nav-item:nth-child(2)');
    const accountButton = document.querySelector('.bottom-nav .nav-item:nth-child(4)');
    const searchInput = document.getElementById('searchInput');

    // Función para redirigir al /movies
    function redirectToMovies() {
        window.location.href = '/movies';
    }

    // Función para enfocar el campo de búsqueda
    function focusSearchInput() {
        searchInput.focus();
    }

    function redirectAccound(){
        window.location.href = '/accound';
    }

    // Agregar eventos de clic
    homeButton.addEventListener('click', redirectToMovies);
    browseButton.addEventListener('click', focusSearchInput);
    accountButton.addEventListener('click', redirectAccound);
    
});


let swiper; // Variable global para la instancia de Swiper

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

// Función para mostrar las películas
function displayMovies(data) {
    const movieList = document.querySelector('.swiper-wrapper');
    const movieItems = data.map(movie => `
        <div class="swiper-slide movie" data-id="${movie._id}">
            <img src="${movie.image_url}" alt="${movie.title}">
            <p class='name'>${movie.title}</p>
            <p class='genre'>${Array.isArray(movie.genres) ? movie.genres.join(', ') : 'N/A'}</p>
        </div>
    `).join('');
    movieList.innerHTML = movieItems;
    initSwiper(); // Inicializar Swiper después de actualizar el contenido
}

// Función para mostrar las películas que vienen
function displayMoviesComing(data) {
    const movieList = document.querySelector('.movie-list-comming');
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
}

// Función para cargar películas
function loadMovies() {
    const movieList = document.querySelector('.swiper-wrapper');
    if (!movieList) {
        console.error('Error: No se encontró el elemento .swiper-wrapper');
        return;
    }
    movieList.innerHTML = ''; // Limpiar resultados anteriores

    // Intentar obtener los resultados del caché
    const cachedMovies = getFromCache('all_movies');
    if (cachedMovies) {
        displayMovies(cachedMovies);
        return;
    }

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
                saveToCache('all_movies', data); // Guardar en caché
                displayMovies(data);
            } else {
                movieList.innerHTML = '<p>No se encontraron películas.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching movies:', error);
            movieList.innerHTML = '<p>Error al obtener las películas.</p>';
        });
}

// Función para cargar películas que vienen
function loadMoviesComming() {
    const movieList = document.querySelector('.movie-list-comming');
    if (!movieList) {
        console.error('Error: No se encontró el elemento .movie-list-comming');
        return;
    }
    movieList.innerHTML = ''; // Limpiar resultados anteriores

    // Intentar obtener los resultados del caché
    const cachedMoviesComing = getFromCache('coming_movies');
    if (cachedMoviesComing) {
        displayMoviesComing(cachedMoviesComing);
        return;
    }

    fetch('/movies/v2/all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                saveToCache('coming_movies', data); // Guardar en caché
                displayMoviesComing(data);
            } else {
                movieList.innerHTML = '<p>No se encontraron películas.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching movies:', error);
            movieList.innerHTML = '<p>Error al obtener las películas.</p>';
        });
}

// Función para inicializar Swiper
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

function Swiperinit() {
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
        loop: false,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });
}

// Manejo de clic en las películas
document.addEventListener('DOMContentLoaded', function () {

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

// Función para realizar la búsqueda
function performSearch(searchInput) {
    // Convertir a minúsculas y eliminar espacios en blanco al inicio y al final
    searchInput = searchInput.toLowerCase().trim();
    // Eliminar espacios extra entre palabras
    searchInput = searchInput.replace(/\s+/g, ' ');
    // Capitalizar la primera letra de cada palabra
    searchInput = searchInput.replace(/\b\w/g, l => l.toUpperCase());

    const movieList = document.querySelector('.swiper-wrapper');
    const movieComming = document.querySelector('.comming');

    if (!movieList) {
        console.error('Error: No se encontró el elemento .swiper-wrapper');
        return;
    }
    movieList.innerHTML = '';
    movieComming.innerHTML = ''; // Limpiar resultados anteriores

    if (searchInput === '') {
        movieList.innerHTML = '<p>Por favor, ingrese un título de película.</p>';
        return;
    }

    // Intentar obtener los resultados del caché
    const cachedSearchResults = getFromCache(`search_results_${searchInput}`);
    if (cachedSearchResults) {
        displaySearchResults(cachedSearchResults);
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
                saveToCache(`search_results_${searchInput}`, movie); // Guardar en caché
                displaySearchResults(movie);
            } else if (Array.isArray(genre) && genre.length > 0) {
                saveToCache(`search_results_${searchInput}`, genre); // Guardar en caché
                displaySearchResults(genre);
            } else {
                movieList.innerHTML = '<p>No se encontraron películas.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching movie:', error);
            movieList.innerHTML = '<p>Error al obtener la película.</p>';
        });
}

function displaySearchResults(data) {
    const movieList = document.querySelector('.swiper-wrapper');
    const movieItems = data.map(m => `
        <div class="swiper-slide movie" data-id="${m._id}">
            <img src="${m.image_url}" alt="${m.title}">
            <p>${m.title}</p>
            <p>${Array.isArray(m.genres) ? m.genres.join(', ') : m.genres}</p>
        </div>`
    ).join('');
    movieList.innerHTML = movieItems;
    Swiperinit(); // Inicializar Swiper después de cargar las películas
}

// Evento de búsqueda en tiempo real
document.getElementById('searchInput').addEventListener('input', function () {
    performSearch(this.value);
});

// Evento de búsqueda al presionar Enter
document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();
    let searchInput = document.getElementById('searchInput').value;
    performSearch(searchInput);
    document.getElementById('searchInput').blur();
});



// Evento de búsqueda en tiempo real
document.getElementById('searchInput').addEventListener('input', function () {
    performSearch(this.value);
});

// Evento de búsqueda al presionar Enter
document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();
    let searchInput = document.getElementById('searchInput').value;
    performSearch(searchInput);
    document.getElementById('searchInput').blur();
});

