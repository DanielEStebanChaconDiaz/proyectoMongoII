import readlineSync from 'readline-sync';
import { Movies } from './model/movies.js';
import { Users } from './model/users.js';

export class Login {
    constructor() {
        this.movies = new Movies();
        this.users = new Users();
    }

    async login() {
        console.log("Bienvenido a la Base de Datos MongoDB");
        const opciones = ['Administrador', 'Usuario Regular', 'Usuario VIP'];
        const index = readlineSync.keyInSelect(opciones, '¿Cómo deseas conectarte?', {cancel: 'Salir'});
        
        switch(index) {
            case 0:
                await this.conectarComoAdministrador();
                break;
            case 1:
                await this.conectarComoUsuario();
                break;
            case 2:
                await this.conectarComoVip();
                break;
            default:
                console.log("Saliendo del sistema...");
        }
    }

    async conectarComoAdministrador() {
        const user = readlineSync.question('Por favor, ingresa tu nombre de usuario: ');
        const pws = readlineSync.question('Por favor, ingresa tu contraseña: ', { hideEchoBack: true });
        console.clear();
    
        if (user === 'adminCineCampus' && pws === '1234') {
            try {
                console.log("Conectando a MongoDB...");
                const resultPeliculas = await this.movies.getMovies(user, pws);
                const resultDescription = await this.movies.getMoviesDescription(user, pws);
                const resultUsers = await this.users.getUsers(user, pws);
                console.log("Conexión a MongoDB establecida correctamente.");
                await this.mostrarMenuAdministrador(user, pws, resultPeliculas, resultUsers, resultDescription);
            } catch (error) {
                console.error("Error al conectar a MongoDB:", error);
            }
        } else {
            console.log("Nombre de usuario o contraseña incorrectos.");
        }
    }

    async mostrarMenuAdministrador(user, pws, resultPeliculas, resultUsers, resultDescription) {
        let continuar = true;

        while (continuar) {
            const opciones = [
                'Listar Películas',
                'Listar Descripción de películas',
                'Listar Usuarios',
                'Agregar Película',
                'Editar Película',
                'Eliminar Película'
            ];

            const index = readlineSync.keyInSelect(opciones, '¿Qué acción deseas realizar?', {cancel: 'Salir'});

            switch (index) {
                case 0:
                    console.log("Listando películas:");
                    console.log(resultPeliculas);
                    break;
                case 1:
                    console.log("Descripción de películas:");
                    console.log(resultDescription);
                    break;
                case 2:
                    console.log("Listando Usuarios:");
                    console.log(resultUsers);
                    break;
                case 3:
                    console.log("Agregar película:");
                    await this.movies.agregarPelicula(user, pws);
                    break;
                case 4:
                    // Implementar edición de película
                    break;
                case 5:
                    await this.movies.dropMovie(user, pws);
                    break;
                default:
                    continuar = false;
                    console.log("Saliendo del menú de administrador...");
            }

            if (continuar) {
                readlineSync.question('Presiona Enter para continuar...');
            }
        }
    }

    // ... (resto de los métodos sin cambios)

    async conectarComoUsuario() {
        const user = readlineSync.question('Por favor, ingresa tu nombre de usuario: ');
        const pws = readlineSync.question('Por favor, ingresa tu contraseña: ', { hideEchoBack: true });
        console.clear();

        try {
            // Aquí deberías verificar las credenciales del usuario en tu base de datos
            console.log("Conectando como usuario regular...");
            const resultPeliculas = await this.movies.getMovies(user, pws);
            console.log("Conexión establecida correctamente.");
            await this.mostrarMenuUsuario(resultPeliculas);
        } catch (error) {
            console.error("Error al conectar:", error);
        }
    }

    async conectarComoVip() {
        const user = readlineSync.question('Por favor, ingresa tu nombre de usuario VIP: ');
        const pws = readlineSync.question('Por favor, ingresa tu contraseña: ', { hideEchoBack: true });
        console.clear();

        try {
            // Aquí deberías verificar las credenciales del usuario VIP en tu base de datos
            console.log("Conectando como usuario VIP...");
            const resultPeliculas = await this.movies.getMovies(user, pws);
            console.log("Conexión establecida correctamente.");
            await this.mostrarMenuVip(resultPeliculas);
        } catch (error) {
            console.error("Error al conectar:", error);
        }
    }

    async mostrarMenuUsuario(resultPeliculas) {
        let continuar = true;

        while (continuar) {
            const opciones = [
                'Ver Películas Disponibles',
                'Comprar Boleto',
                'Reservar Boleto',
                'Cancelar Reservación'
            ];

            const index = readlineSync.keyInSelect(opciones, '¿Qué acción deseas realizar?', {cancel: 'Salir'});

            switch (index) {
                case 0:
                    console.log("Películas Disponibles:");
                    console.log(resultPeliculas);
                    break;
                case 1:
                    await this.comprarBoleto();
                    break;
                case 2:
                    await this.reservarBoleto();
                    break;
                case 3:
                    await this.cancelarReservacion();
                    break;
                default:
                    continuar = false;
                    console.log("Cerrando sesión...");
            }

            if (continuar) {
                readlineSync.question('Presiona Enter para continuar...');
            }
        }
    }

    async mostrarMenuVip(resultPeliculas) {
        let continuar = true;

        while (continuar) {
            const opciones = [
                'Ver Películas Disponibles',
                'Comprar Boleto con Descuento VIP',
                'Reservar Boleto',
                'Cancelar Reservación',
                'Ver Beneficios VIP'
            ];

            const index = readlineSync.keyInSelect(opciones, '¿Qué acción deseas realizar?', {cancel: 'Salir'});

            switch (index) {
                case 0:
                    console.log("Películas Disponibles:");
                    console.log(resultPeliculas);
                    break;
                case 1:
                    await this.comprarBoletoVIP();
                    break;
                case 2:
                    await this.reservarBoleto();
                    break;
                case 3:
                    await this.cancelarReservacion();
                    break;
                case 4:
                    this.verBeneficiosVIP();
                    break;
                default:
                    continuar = false;
                    console.log("Cerrando sesión...");
            }

            if (continuar) {
                readlineSync.question('Presiona Enter para continuar...');
            }
        }
    }

    verBeneficiosVIP() {
        console.log("Beneficios VIP:");
        console.log("1. Descuento del 15% en todas las compras de boletos");
        console.log("2. Acceso anticipado a estrenos");
        console.log("3. Snacks gratis en cada visita");
    }
}