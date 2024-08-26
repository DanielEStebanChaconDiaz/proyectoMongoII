document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId'); // Obtiene el parámetro 'orderId' de la URL

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

function loadOrder(orderId) {
    const movieList = document.querySelector('.card');
    if (!movieList) {
        console.warn('Advertencia: No se encontró el elemento .card');
        return;
    }

    fetch(`/paid/v1?orderId=${orderId}`) // Envía solo el ID de la orden en la URL
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Verifica la estructura de los datos

            if (Array.isArray(data) && data.length > 0) {
                const movie = data[0]; // Asumimos que data contiene un único objeto de orden
                const movieId = movie.moviId; // Obtenemos el movieId de la orden
                const cinemaId = movie.cinemaId; // Obtenemos el cinemaId de la orden
                console.log(cinemaId)

                // Llamamos a loadMovie con el movieId y cinemaId para cargar los detalles de la película
                loadMovie(movieId, cinemaId);

                // Formateo de fecha y hora
                const showtimeDate = new Date(movie.showtimeDate);
                const formattedDate = showtimeDate.toISOString().split('T')[0];
                const formattedTime = showtimeDate.toTimeString().split(':').slice(0, 2).join(':');

                // Inserción de datos de la orden en el HTML
                movieList.innerHTML = `
                    <div class="image">
                        <img src="${movie.movieImage}" alt="Movie Image">
                        <div class="text">
                            <h2 class="title">Inception</h2> <!-- Cambia si el título es dinámico -->
                            <p class="textTicket">Show this ticket at the entrance</p>
                        </div>
                    </div>
                    <div class="details">
                        <div class="info">
                            <div class="infotext">
                                <p class="cinema">Cinema</p>
                                <h2 class="cinemaTitle">${movie.cinemaDireccion}</h2>
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
                                <h2 class="seatPurchase">${movie.seats}</h2>
                            </div>
                        </div>
                        <div class="info">
                            <div class="infotext">
                                <p class="price">Cost</p>
                                <h2 class="priceTitle">$${movie.totalPrice}</h2>
                            </div>
                            <div class="payment">
                                <p class="paymentT">OrderId</p>
                                <h2 class="order">${movie.order}</h2>
                            </div>
                        </div>
                    </div>
                    <div class="barcode"></div> <!-- Contenedor del código de barras -->
                `;

                // Generar el código de barras
                generateBarcode(orderId);
            } else {
                movieList.innerHTML = '<p>No se encontraron datos de la orden.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching order:', error);
            movieList.innerHTML = '<p>Error al obtener la orden.</p>';
        });
}

function loadMovie(movieId, cinemaId) {
    const movieList = document.querySelector('.card');
    if (!movieList) {
        console.warn('Advertencia: No se encontró el elemento .card');
        return;
    }

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
                console.log(cinemas)
                
                // Busca el cine que coincida con el cinemaId
                const selectedCinema = cinemas.find(cinema => cinema._id === cinemaId);
                const cinemaImage = document.querySelector('.img')
                if (cinemaImage && selectedCinema) {
                    cinemaImage.innerHTML = `<img src="${selectedCinema.imagen_url}" alt="Cinema Icon"></img>`;
                } else {
                    console.warn('No se encontró la imagen del cine con el ID proporcionado.');
                }
                // Inserta el nombre del cine en el HTML adecuado
                const cinemaContainer = document.querySelector('.cinemaHallTitle');
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

function generateBarcode(orderId) {
    const barcodeDiv = document.querySelector('.barcode');
    
    if (barcodeDiv) {
        // Asegúrate de que el orderId sea una cadena
        const validOrderId = String(orderId);

        // Verifica si el orderId es válido para CODE128
        if (!/^[0-9A-Za-z]+$/.test(validOrderId)) {
            console.error(`El orderId "${validOrderId}" no es válido para el formato CODE128.`);
            return;
        }

        // Crea un nuevo elemento SVG para el código de barras
        const barcodeSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        barcodeSvg.id = 'barcode';
        barcodeDiv.appendChild(barcodeSvg);

        // Usa JsBarcode para generar el código de barras en el SVG
        JsBarcode("#barcode", validOrderId, {
            format: "CODE128",
            lineColor: "#000",
            width: 3,
            height: 50,
            displayValue: true
        });
    } else {
        console.warn('Advertencia: No se encontró el contenedor .barcode');
    }
}



