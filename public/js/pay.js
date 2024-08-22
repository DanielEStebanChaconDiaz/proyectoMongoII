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