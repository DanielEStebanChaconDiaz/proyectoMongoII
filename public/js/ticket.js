document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('userName'); // Obtiene el parámetro 'orderId' de la URL

    if (orderId) {
        loadOrder(orderId); // Carga la información de la orden
        console.log(orderId);
    } else {
        console.warn('No order ID found in URL');
    }

    const backButton = document.getElementById('atras');
    if (backButton) {
        backButton.addEventListener('click', function () {
            window.history.back();
        });
    } else {
        console.warn('Advertencia: No se encontró el botón de retroceso con el id "atras".');
    }
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

function loadOrder(orderId) {
    const movieList = document.querySelector('.card1'); // Cambié el selector para un contenedor general de los tickets.
    if (!movieList) {
        console.warn('Advertencia: No se encontró el elemento .tickets-container');
        return;
    }

    fetch(`/tickets/v2?userName=${orderId}`) // Envía solo el ID de la orden en la URL
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Verifica la estructura de los datos

            if (Array.isArray(data) && data.length > 0) {
                movieList.innerHTML = ''; // Limpia el contenedor antes de añadir los tickets.

                data.forEach(ticket => {
                    const movieId = ticket.moviId; // Obtenemos el movieId de la orden
                    const cinemaId = ticket.cinemaId; // Obtenemos el cinemaId de la orden

                    // Formateo de fecha y hora
                    const showtimeDate = new Date(ticket.showtimeDate);
                    const formattedDate = showtimeDate.toISOString().split('T')[0];
                    const formattedTime = showtimeDate.toTimeString().split(':').slice(0, 2).join(':');

                    // Crea un contenedor para cada ticket
                    const ticketElement = document.createElement('div');
                    ticketElement.classList.add('card');

                    // Inserción de datos de la orden en el HTML para cada ticket
                    ticketElement.innerHTML = `
                        <div class="image">
                            <img src="${ticket.movieImage}" alt="Movie Image">
                            <div class="text">
                                <h2 class="title">Inception</h2> <!-- Cambia si el título es dinámico -->
                                <p class="textTicket">Show this ticket at the entrance</p>
                            </div>
                        </div>
                        <div class="details">
                            <div class="info">
                                <div class="infotext">
                                    <p class="cinema">Cinema</p>
                                    <h2 class="cinemaTitle">${ticket.cinemaDireccion}</h2>
                                </div>
                                <div class="img">
                                    <img src="https://i.ibb.co/K96x0kR/cinema.png" alt="Cinema Icon">
                                </div>
                            </div>
                            <div class="info" style="margin-top: 2rem;">
                                <div class="infotext">
                                    <p class="date">Date</p>
                                    <h2 class="dateTitle">${formattedDate}</h2>
                                </div>
                                <div class="time">
                                    <p class="timeT">Time</p>
                                    <h2 class="timeTitle">${formattedTime}</h2>
                                </div>
                            </div>
                            <div class="info">
                                <div class="infotext">
                                    <p class="cinemaHall">Cinema Hall #</p>
                                    <h2 class="cinemaHallTitle">Cinema A</h2> <!-- Cambia si es dinámico -->
                                </div>
                                <div class="seats">
                                    <p class="seat">Seat</p>
                                    <h2 class="seatPurchase">${ticket.seats}</h2>
                                </div>
                            </div>
                            <div class="info">
                                <div class="infotext">
                                    <p class="price">Cost</p>
                                    <h2 class="priceTitle">$${ticket.totalPrice}</h2>
                                </div>
                                <div class="payment">
                                    <p class="paymentT">OrderId</p>
                                    <h2 class="order">${ticket.order}</h2>
                                </div>
                            </div>
                        </div>
                        <div class="barcode"></div> <!-- Contenedor del código de barras -->
                    `;

                    movieList.appendChild(ticketElement);

                    // Generar el código de barras para cada ticket
                    generateBarcode(ticket.order, ticketElement.querySelector('.barcode'));

                    // Llamamos a loadMovie con el movieId y cinemaId para cargar los detalles de la película
                    loadMovie(movieId, cinemaId, ticketElement);
                });
            } else {
                movieList.innerHTML = '<p>No se encontraron datos de la orden.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching order:', error);
            movieList.innerHTML = '<p>Error al obtener la orden.</p>';
        });
}

function loadMovie(movieId, cinemaId, ticketElement) {
    fetch(`/movies/v3?movieId=${movieId}`) // Envía solo el ID de la película en la URL
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

                // Verifica que cinemas sea un array
                const cinemas = Array.isArray(movie.cinemas) ? movie.cinemas : [];

                // Busca el cine que coincida con el cinemaId
                const selectedCinema = cinemas.find(cinema => cinema._id === cinemaId);
                const cinemaImage = ticketElement.querySelector('.img');

                if (cinemaImage && selectedCinema) {
                    cinemaImage.innerHTML = `<img src="${selectedCinema.imagen_url}" alt="Cinema Icon"></img>`;
                } else {
                    console.warn('No se encontró la imagen del cine con el ID proporcionado.');
                }

                // Inserta el nombre del cine en el HTML adecuado
                const cinemaContainer = ticketElement.querySelector('.cinemaHallTitle');
                if (cinemaContainer && selectedCinema) {
                    cinemaContainer.innerHTML = `<p class="cinemaHallTitle">${selectedCinema.nombre}</p>`;
                } else {
                    console.warn('No se encontró el cine con el ID proporcionado.');
                }
            } else {
                console.warn('No se encontraron datos de la película.');
            }
        })
        .catch(error => {
            console.error('Error fetching movie:', error);
        });
}

function generateBarcode(orderId, barcodeContainer) {
    if (barcodeContainer) {
        const validOrderId = String(orderId);

        if (!/^[0-9A-Za-z]+$/.test(validOrderId)) {
            console.error(`El orderId "${validOrderId}" no es válido para el formato CODE128.`);
            return;
        }

        const barcodeSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        barcodeSvg.id = 'barcode';
        barcodeContainer.appendChild(barcodeSvg);

        JsBarcode(barcodeSvg, validOrderId, {
            format: "CODE128",
            lineColor: "#000",
            width: 3,
            height: 50,
            displayValue: true
        });
    } else {
        console.warn('Advertencia: No se encontró el contenedor de código de barras.');
    }
}
