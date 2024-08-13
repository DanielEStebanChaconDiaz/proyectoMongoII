    document.addEventListener('DOMContentLoaded', function() {
        loadMovies();
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
                if (Array.isArray(data) && data.length > 0) {
                    const movieItems = data.map(movie => `
                        <div class="swiper-slide movie">
                            <img src="${movie.image_url}" alt="${movie.title}">
                            <p>${movie.title}</p>
                            <p>${movie.genre}</p>
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
            loop: false,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    }

    document.getElementById('searchForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const searchInput = document.getElementById('searchInput').value.trim();
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
                if (Array.isArray(data) && data.length > 0) {
                    const movieItems = data.map(movie => `
                        <div class="swiper-slide movie">
                            <img src="${movie.image_url}" alt="${movie.title}">
                            <p>${movie.title}</p>
                            <p>${movie.genre}</p>
                        </div>
                    `).join('');
                    movieList.innerHTML = movieItems;

                    initSwiper();
                } else {
                    movieList.innerHTML = '<p>No se encontraron películas.</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching movie:', error);
                movieList.innerHTML = '<p>Error al obtener la película.</p>';
            });
    });