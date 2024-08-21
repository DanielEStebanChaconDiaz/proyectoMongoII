document.addEventListener('DOMContentLoaded', function () {
    const pathSegments = window.location.pathname.split('/').filter(segment => segment);
    const movieId = pathSegments[1];
    const cinemaId = pathSegments[2];

    if (movieId && cinemaId) {
        loadShowtime(movieId, cinemaId);
    } else {
        console.warn('Movie ID or Cinema ID not found in URL');
    }

    function generateSeats(seats) {
        const rows = document.querySelectorAll('.row');
        const totalPriceElement = document.getElementById('total'); // Elemento para mostrar el precio total
        

        // Limpiar filas existentes
        rows.forEach(row => row.innerHTML = '');

        const container = document.querySelectorAll('.screen');
        

        // Crear un objeto para almacenar los asientos por fila
        const seatsByRow = {};
        seats.forEach(seat => {
            const rowLetter = seat.seat_row.charAt(0).toUpperCase();
            if (!seatsByRow[rowLetter]) {
                seatsByRow[rowLetter] = [];
            }
            seatsByRow[rowLetter].push(seat);
        });

        // Recorremos cada fila para asignar números a los asientos
        rows.forEach((row, rowIndex) => {
            const rowLetter = String.fromCharCode('A'.charCodeAt(0) + rowIndex);
            const seatsInRow = seatsByRow[rowLetter] || [];

            // Limitar solo la primera fila a 5 asientos
            let seatsToDisplay = rowIndex === 0 ? seatsInRow.slice(0, 5) : seatsInRow;

            // Agregar una letra al inicio de la fila
            const rowLetterDiv = document.createElement('div');
            rowLetterDiv.textContent = rowLetter;
            rowLetterDiv.classList.add('row-letter'); // Opcional, para dar estilo a la letra
            rowLetterDiv.style.fontWeight = 'bold'; // Opcional, para resaltar la letra
            row.appendChild(rowLetterDiv);

            // Recorremos todos los asientos para esa fila
            seatsToDisplay.forEach((seat, seatIndex) => {
                // ... (resto del código sigue igual)
                const seatDiv = document.createElement('div');
                seatDiv.dataset.seatNumber = seatIndex + 1; // Añadimos el número del asiento como data-atributo

                // Configura la clase del asiento según el estado del asiento
                if (seat.estado === 'disponible') {
                    seatDiv.classList.add('seat-available');
                } else {
                    seatDiv.classList.add('seat-unavailable');
                }

                // Crear un div para el número del asiento, inicialmente oculto
                const seatNumberDiv = document.createElement('div');
                seatNumberDiv.classList.add('seat-number');
                seatNumberDiv.textContent = seatIndex + 1;
                seatNumberDiv.style.display = 'none';
                // Añadir el div del número al asiento
                seatDiv.appendChild(seatNumberDiv);

                seatDiv.addEventListener('click', () => {
                    if (seatDiv.classList.contains('seat-available')) {
                        seatDiv.classList.replace('seat-available', 'seat-selected');
                        seatDiv.style.backgroundColor = 'red'; // Cambia el color a rojo
                        seatNumberDiv.style.display = 'block'; // Mostrar el número
                        totalPrice += 8500; // Agregar el precio del asiento al total
                    } else if (seatDiv.classList.contains('seat-selected')) {
                        seatDiv.classList.replace('seat-selected', 'seat-available');
                        seatDiv.style.backgroundColor = ''; // Restaura el color
                        seatNumberDiv.style.display = 'none'; // Ocultar el número
                        totalPrice -= 8500; // Restar el precio del asiento del total
                    }
                    totalPriceElement.textContent = totalPrice.toLocaleString('es-ES', { minimumFractionDigits: 2 }); // Actualizar el precio total con punto como separador de miles
                });

                row.appendChild(seatDiv);
            });
        });
    }

    function loadShowtime(movieId, cinemaId) {
        fetch(`/seats/v2?movie_id=${movieId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching showtimes');
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    const showtime = data[0];
                    const funciones = Array.isArray(showtime.showtimes) ? showtime.showtimes : [];

                    const groupedShowtimes = {};

                    funciones.forEach(funcion => {
                        const fecha = new Date(funcion.date);
                        const weekday = fecha.toLocaleDateString([], { weekday: 'short' });
                        const dayOfMonth = fecha.getDate();
                        const dateKey = `${weekday}-${dayOfMonth}`;

                        if (!groupedShowtimes[dateKey]) {
                            groupedShowtimes[dateKey] = [];
                        }

                        groupedShowtimes[dateKey].push({
                            hora: fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            formato: funcion.format,
                            seats: funcion.seats // Añadimos los asientos
                        });
                    });

                    let fechasHTML = '';
                    let horariosHTML = '';

                    // Agrupamos todos los horarios por fecha
                    Object.keys(groupedShowtimes).forEach((dateKey, index) => {
                        const [weekday, dayOfMonth] = dateKey.split('-');

                        fechasHTML += `
                        <label id="d${index + 1}" class="dates-item">
                            <div class="day">${weekday}</div>
                            <div class="date">${dayOfMonth}</div>
                        </label>
                    `;

                        horariosHTML += `
                        <div id="t${index + 1}" class="time-container" style="display: none;">
                            ${groupedShowtimes[dateKey].map(showtime => `
                                <label id="h${index + 1}_${showtime.hora}" class="time-item" data-seats='${JSON.stringify(showtime.seats)}'>
                                    <div class="hour">${showtime.hora}</div>
                                    <div class="type">${showtime.formato}</div>
                                </label>
                            `).join('')}
                        </div>
                    `;
                    });

                    const weekContainer = document.querySelector('.week');
                    const timeContainer = document.querySelector('.time');
                    const screen = document.querySelector('.screen');
                    const movie = document.querySelector('.movie-container')
                    screen.style.display = 'none'; // Ocultar el número inicialmente
                    movie.style.display = 'none'; // Mostrar el número inicialmente


                    if (weekContainer && timeContainer) {
                        weekContainer.innerHTML = fechasHTML;
                        timeContainer.innerHTML = horariosHTML;
                    } else {
                        console.warn('No se encontraron los contenedores .week o .time en el DOM');
                    }

                    let selectedDate = null;
                    document.querySelectorAll('.dates-item').forEach((dateItem, index) => {
                        dateItem.addEventListener('click', () => {
                            if (selectedDate) {
                                if (selectedDate === dateItem) {
                                    selectedDate.classList.replace('dates-item-select', 'dates-item');
                                    selectedDate = null;
                                    document.querySelectorAll('.time-container').forEach(container => {
                                        container.style.display = 'none';
                                    });
                                    screen.style.display = 'none';
                                    movie.style.display = 'none';
                                    selectedTime.classList.replace('time-item-selected', 'time-item');
                                    generateSeats()
                                } else {
                                    selectedDate.classList.replace('dates-item-select', 'dates-item');
                                    dateItem.classList.replace('dates-item', 'dates-item-select');
                                    selectedDate = dateItem;

                                    const timeContainerToShow = document.querySelector(`#t${index + 1}`);
                                    document.querySelectorAll('.time-container').forEach(container => {
                                        if (container !== timeContainerToShow) {
                                            container.style.display = 'none';
                                        }
                                    });
                                    timeContainerToShow.style.display = 'flex';
                                }
                            } else {
                                dateItem.classList.replace('dates-item', 'dates-item-select');
                                selectedDate = dateItem;

                                const timeContainerToShow = document.querySelector(`#t${index + 1}`);
                                timeContainerToShow.style.display = 'flex';
                            }
                        });
                    });

                    let selectedTime = null;
                    document.querySelectorAll('.time-item').forEach(timeItem => {
                        timeItem.addEventListener('click', () => {
                            const seats = JSON.parse(timeItem.dataset.seats);

                            if (selectedTime) {
                                if (selectedTime === timeItem) {
                                    selectedTime.classList.replace('time-item-selected', 'time-item');
                                    selectedTime = null;
                                    totalPrice = 0
                                    const totalPriceElement = document.getElementById('total'); // Resetear el precio a 0
                                    totalPriceElement.textContent = totalPrice.toLocaleString('es-ES', { minimumFractionDigits: 2 }); // Actualizar el precio total en la UI
                                    console.log(totalPrice)
                                    screen.style.display = 'none';
                                    movie.style.display = 'none';

                                    // Limpiar asientos si se deselecciona el horario
                                    generateSeats();
                                } else {
                                    selectedTime.classList.replace('time-item-selected', 'time-item');
                                    timeItem.classList.replace('time-item', 'time-item-selected');
                                    selectedTime = timeItem;
                                }
                            } else {
                                timeItem.classList.replace('time-item', 'time-item-selected');
                                selectedTime = timeItem;
                            }
                            screen.style.display = 'flex';
                            movie.style.display = 'flex';

                            // Generar los divs de los asientos
                            generateSeats(seats);
                        });
                    });

                } else {
                    console.warn('No se encontraron datos válidos.');
                }
            })
            .catch(error => {
                console.error('Error loading showtimes:', error);
            });
    }

    let totalPrice = 0; // Variable para almacenar el precio total


    const backButton = document.getElementById('atras');
    if (backButton) {
        backButton.addEventListener('click', function () {
            window.history.back();
        });
    } else {
        console.warn('Advertencia: No se encontró el botón de retroceso con el id "atras".');
    }
});
