document.addEventListener('DOMContentLoaded', function() {
    // Llama a la función para cargar todas las películas cuando la página se carga
    loadMovies();
});

function loadMovies() {
    const movieList = document.querySelector('.movie-list');
    movieList.innerHTML = ''; // Limpiar resultados anteriores

    // Realizar la solicitud al servidor para obtener todas las películas
    fetch('/movies/v1/all')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Intenta parsear la respuesta como JSON
        })
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                // Mostrar todas las películas
                const movieItems = data.map(movie => `
                    <div class="movie">
                        <img src="${movie.image_url}" alt="${movie.title}">
                        <p>${movie.title}</p>
                        <p>${movie.genre}</p>
                    </div>
                `).join('');
                movieList.innerHTML = movieItems;
            } else {
                movieList.innerHTML = '<p>No se encontraron películas.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching movies:', error);
            movieList.innerHTML = '<p>Error al obtener las películas.</p>';
        });
}

document.getElementById('searchForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
    
    const searchInput = document.getElementById('searchInput').value.trim();
    const movieList = document.querySelector('.movie-list');
    movieList.innerHTML = ''; // Limpiar resultados anteriores

    // Verificar que el campo de búsqueda no esté vacío
    if (searchInput === '') {
        movieList.innerHTML = '<p>Por favor, ingrese un título de película.</p>';
        return;
    }

    // Realizar la solicitud al servidor
    fetch(`/movies/v1?title=${encodeURIComponent(searchInput)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Intenta parsear la respuesta como JSON
        })
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                // Mostrar los resultados de la búsqueda
                const movieItems = data.map(movie => `
                    <div class="movie">
                        <img src="${movie.image_url}" alt="${movie.title}">
                        <p>${movie.title}</p>
                        <p>${movie.genre}</p>
                    </div>
                `).join('');
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
