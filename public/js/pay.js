const stripe = Stripe('pk_test_51Ps3CL06WcWl6cu4rSIEa3xDsewWmFuIG6nMsX0KI4aP7TvWDgCjNHDhHdgzMVpQ8njckUuzqJpTxKCfM4EPshgI002uxUT3Jc'); // Clave pública de Stripe
const elements = stripe.elements();

document.addEventListener('DOMContentLoaded', function () {
    const card = document.querySelector('#card-element')
    const add = document.querySelector('.add')
    const card2 = document.querySelector('.card')
    card2.style.display = 'none'
    add.style.display = 'none'

    card.style.display = 'none'
})

var style = {
    base: {
        color: '#fff',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '1rem',
        '::placeholder': {
            color: '#fff'
        },
        // Añadimos propiedades para el layout
        ':-webkit-autofill': {
            color: '#fff',
            fill: '#fff'  // Esto cambiará el color del input a blanco cuando el campo se autoguarda
        },
        '::-ms-clear': {
            display: 'none'
        },
        // Intentamos aplicar flexbox (nota: esto puede no funcionar directamente en el elemento de Stripe)
        display: 'flex',
        flexDirection: 'column'
    },
    invalid: {
        color: '#fff',
        iconColor: '#fff',  // Esto cambiará el color del icono a blanco cuando el campo sea inválido
        fill: '#fff'
    }
};




const cardElement = elements.create('card', { style: style });
cardElement.mount('#card-element');

const form = document.getElementById('payment-form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const urlParams = new URLSearchParams(window.location.search);
    const totalPrice = urlParams.get('totalPrice');
    
    // Crear el Payment Intent
    const fetchResponse = await fetch('/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            amount: Math.round(parseFloat(totalPrice) * 100),  // Convertir a centavos y redondear
            currency: 'cop'  // Moneda colombiana (COP)
        })
    });

    const response = await fetchResponse.json();

    // Verificar si hay una tarjeta guardada
    const savedPaymentMethodId = localStorage.getItem('savedPaymentMethodId');
    let paymentMethod;

    if (savedPaymentMethodId) {
        paymentMethod = { payment_method: savedPaymentMethodId };
    } else {
        paymentMethod = { payment_method: { card: cardElement } };
    }

    // Confirmar el pago
    const { error, paymentIntent } = await stripe.confirmCardPayment(response.clientSecret, paymentMethod);

    if (error) {
        document.getElementById('payment-result').textContent = `Error: ${error.message}`;
    } else if (paymentIntent.status === 'succeeded') {
        document.getElementById('payment-result').textContent = 'Payment successful!';
    }
});
const cerrar = document.querySelector('.cerrar')
cerrar.addEventListener('click', () => {
    const cerrar = document.querySelector('.cerrar')
    const card = document.querySelector('#card-element')
    cerrar.style.display = 'none'
    const add = document.querySelector('.add')
    add.style.display = 'none'
    card.style.display = 'none'
})

const addCard = document.querySelector('.addCard');
addCard.addEventListener('click', () => {
    // Añadir el elemento de tarjeta al formulario
    const cerrar = document.querySelector('.cerrar')
    const card = document.querySelector('#card-element')
    const privateElement = document.querySelector('.__PrivateStripeElement')
    const add = document.querySelector('.add')
    privateElement.style.height = '20px'
    add.style.display = 'flex'
    cerrar.style.display = 'block'
    card.style.display = 'flex'
})


const addButton = document.querySelector('.add');
addButton.addEventListener('click', saveCardDetails);
async function saveCardDetails(event) {
    event.preventDefault();

    try {
        // Crear el PaymentMethod
        const result = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (result.error) {
            // Mostrar error al usuario
            document.getElementById('payment-result').textContent = `Error: ${result.error.message}`;
        } else {
            // PaymentMethod creado exitosamente
            const paymentMethod = result.paymentMethod;
            const last4 = paymentMethod.card.last4;

            // Actualizar el HTML con los últimos 4 dígitos
            updateCardDisplay(last4);

            document.getElementById('payment-result').textContent = 'Card saved successfully!';

            // Guardar el paymentMethodId si lo necesitas después
            localStorage.setItem('savedPaymentMethodId', paymentMethod.id);

            // Opcional: enviar a tu servidor
            // await sendPaymentMethodToServer(paymentMethod.id);

            // Ocultar elementos relacionados con el formulario de tarjeta
            const card = document.querySelector('#card-element');
            const add = document.querySelector('.add');
            const card2 = document.querySelector('.card');
            const cerrar = document.querySelector('.cerrar');
            const addCard = document.querySelector('.addCard');
            const check = document.querySelector('.check');
            check.style.background = 'red'

            addCard.style.display = 'none';
            cerrar.style.display = 'none';
            add.style.display = 'none';
            card.style.display = 'none';
            card2.style.display = 'flex';
        }
    } catch (error) {
        document.getElementById('payment-result').textContent = 'Error: Could not save card.';
    }
}


function updateCardDisplay(last4) {
    const infoElement = document.querySelector('.card .info');
    if (infoElement) {
        infoElement.textContent = `**** **** **** ${last4}`;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    function generateRandomOrderNumber() {
        return Math.floor(100000000 + Math.random() * 900000000);
    }

    // Obtener el elemento con la clase 'number'
    const orderNumberElement = document.querySelector('.number');
    if (orderNumberElement) {
        // Asignar un número de orden aleatorio
        orderNumberElement.textContent = generateRandomOrderNumber();
    }

    const urlParams = new URLSearchParams(window.location.search);

    const movieId = urlParams.get('movieId');
    const cinemaId = urlParams.get('cinemaId');
    const totalSeats = urlParams.get('totalSeats');
    const totalPrice = urlParams.get('totalPrice');
    const showtimeDate = urlParams.get('showtimeDate');
    const showtimeHour = urlParams.get('showtimeHour');
    // Deserializar el array seatDetails que fue serializado como JSON string
    const seatDetails = JSON.parse(urlParams.get('seat'));

    function convertirAFecha(cadenaFecha) {
        const [dia, mes, ano] = cadenaFecha.split(' de ');
        const meses = {
            'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
            'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
        };

        return new Date(ano, meses[mes.toLowerCase()], parseInt(dia));
    }

    function convertirAHora(cadenaHora) {
        const horaLimpia = cadenaHora.trim();
        const [horas, minutos] = horaLimpia.split(':');
        return { horas: parseInt(horas, 10), minutos: parseInt(minutos, 10) };
    }

    function crearFechaCompleta(cadenaFecha, cadenaHora) {
        const fecha = convertirAFecha(cadenaFecha);
        const { horas, minutos } = convertirAHora(cadenaHora);

        fecha.setHours(horas);
        fecha.setMinutes(minutos);
        fecha.setSeconds(0);
        fecha.setMilliseconds(0);

        return fecha;
    }

    const fechaCompleta = crearFechaCompleta(showtimeDate, showtimeHour);
    console.log(fechaCompleta);
    const dateObject = new Date(fechaCompleta + 'z-5');

    // Extraer y mostrar componentes individuales (números)
    const cadenaFechaHora = dateObject;
    console.log((new Date(dateObject + 'z+0')).toISOString());
    console.log(dateObject.toLocaleDateString())

    console.log(cadenaFechaHora);

    console.log(cadenaFechaHora);

    // Ejemplo de uso

    const fechaISO = new Date(dateObject + 'z+0').toISOString();
    console.log(fechaISO);






    console.log('Datos importados desde la URL:', {
        movieId,
        cinemaId,
        totalSeats,
        totalPrice,
        showtimeDate,
        showtimeHour,
        seatDetails
    });

    const comprar = document.querySelector('.comprar');
    comprar.addEventListener('click', function () {
        // Construir un array de objetos con los detalles de cada asiento
        console.log(seatDetails)
        const seatsToUpdate = seatDetails.map(seat => ({
            movieId: movieId,
            cinemaId: cinemaId,
            date: fechaISO, // Convertimos la fecha en objeto Date
            rowLetter: seat.rowLetter,
            seatNumber: seat.seatNumber
        }));
        console.log(seatsToUpdate);
        console.log(JSON.stringify(seatsToUpdate))
        // Enviar el array de asientos al servidor en una sola petición
        fetch('/seats/update-seat', {
            method: 'POST', // Usamos POST
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(seatsToUpdate) // Serializamos el array como JSON
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la red');
                }
                return response.json();
            })
            .then(data => {
                console.log('Respuesta del servidor:', data);
                // Manejar la respuesta, como mostrar un mensaje de éxito
            })
            .catch(error => {
                console.error('Hubo un problema con la petición:', error);
            });
    });


    // Aquí puedes mostrar los datos en la página o usarlos como desees
    function loadMovies() {
        const movieImg = document.querySelector('.movie-img');
        const movieText = document.querySelector('.text');
        const orderDate = document.querySelector('.orderDate');
        if (!movieImg || !movieText) {
            console.error('Error: No se encontraron los elementos .movie-img o .text');
            return;
        }

        fetch(`/movies/v3?movieId=${movieId}`)

            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                let cinemaName = 'Nombre del Cine no disponible';
                const cinemas = data[0].cinemas; // Array de cines asociados a la película
                if (cinemas && Array.isArray(cinemas)) {
                    // Recorrer el array de cines y buscar el cine con el id correcto
                    for (let i = 0; i < cinemas.length; i++) {
                        if (cinemas[i]._id === cinemaId) {
                            cinemaName = cinemas[i].direccion; // Asignar el nombre del cine correspondiente
                            break; // Romper el bucle una vez encontrado
                        }
                    }
                }
                const movieTitle = data[0].title || 'Título no disponible';
                const movieGenre = data[0].genres || 'Género no disponible';
                const movieImage = data[0].image_url;
                const cinema = data[0].cinemas._id === cinemaId;
                console.log(cinema)

                // Actualizar el contenido HTML
                movieImg.innerHTML = `<img src="${movieImage}" alt="${movieTitle}">`;
                movieText.innerHTML = `
                    <h2 class="title">${movieTitle}</h2>
                    <p class="genre">${movieGenre}</p>
                    <h2 class="cine-name">${cinemaName}</h2>
                    <p class="date">Fecha: ${showtimeDate} Hora: ${showtimeHour}</p>
                `;
                const seatMap = {};

                seatDetails.forEach(seat => {
                    const seatKey = 'REGULAR SEAT'; // Asumiendo que todos los asientos son del mismo tipo
                    if (!seatMap[seatKey]) {
                        seatMap[seatKey] = [];
                    }
                    seatMap[seatKey].push(`${seat.rowLetter}${seat.seatNumber}`);
                });

                let ticketsHTML = '';

                // Construir el HTML para cada tipo de asiento
                for (const [type, seats] of Object.entries(seatMap)) {
                    ticketsHTML += `
                        <div class="orderDate1">
                            <p class="ticketInfo">${seats.length} TICKET${seats.length > 1 ? 'S' : ''}</p>
                            <p class="ubi">${seats.join(', ')}</p>
                        </div>
                        <div class="orderDate1">
                            <p class="tipeTicket">${type}</p>
                            <p class="price">$${(totalPrice / totalSeats).toFixed(2)} x ${totalSeats}</p>
                        </div>
                    `;
                }

                // Añadir la información de las tarifas de servicio
                ticketsHTML += `
                    <div class="orderDate1">
                        <p class="service">SERVICE FEE</p>
                        <p class="price">$1.99 x 1</p>
                    </div>
                `;

                // Actualizar el contenido del contenedor orderDate
                orderDate.innerHTML = ticketsHTML;

            })
            .catch(error => {
                console.error('Error fetching movies:', error);
                movieList.innerHTML = '<p>Error al obtener las películas.</p>';
            });
    }
    loadMovies();

    const backButton = document.getElementById('atras');
    if (backButton) {
        backButton.addEventListener('click', function () {
            window.history.back();
        });
    } else {
        console.warn('Advertencia: No se encontró el botón de retroceso con el id "atras".');
    }

});



let time = 5 * 60;

const timerElement = document.getElementById('timer');

function startTimer() {
    const interval = setInterval(() => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;

        // Añadir un cero delante de los segundos si es menor de 10
        seconds = seconds < 10 ? '0' + seconds : seconds;

        // Actualizar el contenido del temporizador
        timerElement.textContent = `${minutes}:${seconds}`;

        // Reducir el tiempo
        time--;

        // Cuando el tiempo se acabe
        if (time < 0) {
            clearInterval(interval);
            timerElement.textContent = "Time is up!";
        }
    }, 1000);
}

// Iniciar el temporizador
startTimer();


const comprar = document.querySelector('.comprar')
import { loadUserName } from './name.js';

const CACHE_KEY = 'userData'; // Clave para almacenar los datos del usuario en el almacenamiento local


console.log(loadUserName())
const email = await loadUserName()

const response = await fetch(`/register-user/v1?email=${email}`);
if (!response.ok) {
    throw new Error('Network response was not ok');
}

// Parsear la respuesta JSON y obtener los datos del usuario
const data = await response.json();
const nombre = data[0].nombre;
console.log(nombre)
comprar.addEventListener('click', async () => {
    // Crear el Payment Intent
    const urlParams = new URLSearchParams(window.location.search);
    const totalPrice = urlParams.get('totalPrice');
    const fetchResponse = await fetch('/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            amount: Math.round(parseFloat(totalPrice) * 100),  // Convertir a centavos y redondear
            currency: 'cop'  // Moneda colombiana (COP)
        })
    });

    const response = await fetchResponse.json();

    const { error, paymentIntent } = await stripe.confirmCardPayment(response.clientSecret, {
        payment_method: {
            card: cardElement,
        }
    });

    if (error) {
        document.getElementById('payment-result').textContent = `Error: ${error.message}`;
    } else if (paymentIntent.status === 'succeeded') {
        document.getElementById('payment-result').textContent = 'Payment successful!';
        // Llamar a la función obtenerDetallesCompra solo si el pago es exitoso
        obtenerDetallesCompra();
    }
    function obtenerDetallesCompra() {

        // Obtener los parámetros de la URL
        console.log(email);
        const urlParams = new URLSearchParams(window.location.search);

        // Extraer los valores relevantes de los parámetros de la URL
        const movieId = urlParams.get('movieId');
        const cinemaId = urlParams.get('cinemaId');
        const totalSeats = urlParams.get('totalSeats');
        const totalPrice = urlParams.get('totalPrice');
        const showtimeDate = urlParams.get('showtimeDate');
        const showtimeHour = urlParams.get('showtimeHour');

        function convertirAFecha(cadenaFecha) {
            const [dia, mes, ano] = cadenaFecha.split(' de ');
            const meses = {
                'enero': 0, 'febrero': 1, 'marzo': 2, 'abril': 3, 'mayo': 4, 'junio': 5,
                'julio': 6, 'agosto': 7, 'septiembre': 8, 'octubre': 9, 'noviembre': 10, 'diciembre': 11
            };

            return new Date(ano, meses[mes.toLowerCase()], parseInt(dia));
        }

        function convertirAHora(cadenaHora) {
            const horaLimpia = cadenaHora.trim();
            const [horas, minutos] = horaLimpia.split(':');
            return { horas: parseInt(horas, 10), minutos: parseInt(minutos, 10) };
        }

        function crearFechaCompleta(cadenaFecha, cadenaHora) {
            const fecha = convertirAFecha(cadenaFecha);
            const { horas, minutos } = convertirAHora(cadenaHora);

            fecha.setHours(horas);
            fecha.setMinutes(minutos);
            fecha.setSeconds(0);
            fecha.setMilliseconds(0);

            return fecha;
        }

        const fechaCompleta = crearFechaCompleta(showtimeDate, showtimeHour);
        console.log(fechaCompleta);
        const dateObject = new Date(fechaCompleta + 'z-5');

        // Extraer y mostrar componentes individuales (números)
        const cadenaFechaHora = dateObject;
        console.log((new Date(dateObject + 'z+0')).toISOString());
        console.log(dateObject.toLocaleDateString())

        console.log(cadenaFechaHora);

        console.log(cadenaFechaHora);

        // Ejemplo de uso

        const fechaISO = new Date(dateObject + 'z+0').toISOString();
        console.log(fechaISO);





        const seatDetails = JSON.parse(urlParams.get('seat')); // Convertir el JSON de los asientos
        let orderId = setTimeout(function () {
            orderId += document.querySelector('.number').textContent;
            // Aquí puedes continuar con la lógica que necesites usar después de obtener el Order ID
            console.log('Order ID:', orderId);
        }, 500); // 500 milisegundos (ajusta este valor según lo necesites)
        // Obtener el ID de la orden

        // Fetch para obtener los detalles de la película
        return fetch(`/movies/v3?movieId=${movieId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los detalles de la película');
                }
                return response.json();
            })
            .then(data => {
                const movie = data[0];

                // Obtener el nombre del cine
                let cinemaDireccion = 'Dirección del Cine no disponible';
                const cinemas = movie.cinemas;
                if (cinemas && Array.isArray(cinemas)) {
                    const cinema = cinemas.find(c => c._id === cinemaId);
                    cinemaDireccion = cinema ? cinema.direccion : cinemaDireccion;
                }
                console.log(cinemas)

                // Extraer los detalles relevantes
                const movieId = movie._id || 'Título no disponible';
                const movieImage = movie.image_url || '';
                const seatsPurchase = seatDetails.map(seat => `${seat.rowLetter}${seat.seatNumber}`).join(', ');

                // Crear un objeto con todos los detalles relevantes
                const detallesCompra = {
                    movieId: movieId,
                    cinemaId: cinemaId,
                    seatsPurchase: seatsPurchase,
                    cinemaDireccion: cinemaDireccion,
                    movieImage: movieImage,
                    totalPrice: totalPrice,
                    orderDate: fechaISO,
                    orderId: orderId,
                    userName: nombre

                };

                fetch('/payment/facture', {
                    method: 'POST', // Usamos POST
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(detallesCompra) // Serializamos el array como JSON
                })

                window.location.href = `/paid?orderId=${orderId}`
                return detallesCompra; // Devolver el objeto con los detalles
            })
            .catch(error => {
                console.error('Error al obtener los detalles de la compra:', error);
                return null;
            });

    }

    // Ejemplo de uso
    obtenerDetallesCompra().then(detalles => {
        if (detalles) {
            console.log('Detalles de la compra:', detalles);
            // Puedes hacer lo que desees con los detalles obtenidos
        }
    });




})