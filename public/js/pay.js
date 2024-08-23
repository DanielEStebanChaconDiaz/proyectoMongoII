
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
      const dateObject = new Date(fechaCompleta+'z-5');

// Extraer y mostrar componentes individuales (números)
  const cadenaFechaHora = dateObject;
  console.log((new Date(dateObject+'z+0')).toISOString());
  console.log(dateObject.toLocaleDateString())
  
  console.log(cadenaFechaHora);

console.log(cadenaFechaHora);
  
  // Ejemplo de uso
 
  const fechaISO = new Date(dateObject+'z+0').toISOString();
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
                console.log (cinema)

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