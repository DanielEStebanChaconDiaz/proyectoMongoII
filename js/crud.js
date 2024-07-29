import readlineSync from 'readline-sync';
import { Movies } from './model/movies.js';
import { Users } from './model/users.js';
import Connection from '../db/connect/connect.js';
import { MongoClient } from 'mongodb';

export class Login {
    constructor() {
        this.movies = new Movies();
        this.users = new Users();
        this.connection = new Connection();
        this.db = null;
        this.adminUri = 'mongodb://mongo:QzTrGVnGyYjBHnmnBVuVcOtJNGxHvEAL@roundhouse.proxy.rlwy.net:17787/'; // URI del admin
        this.dbName = 'cineCampus';
        this.client = null;

    }

    async login() {
        console.log("Bienvenido a la Base de Datos MongoDB");
        const opciones = ['Administrador', 'Usuario', 'Registrarme'];
        const index = readlineSync.keyInSelect(opciones, '¿Cómo deseas conectarte?', { cancel: 'Salir' });

        switch (index) {
            case 0:
                await this.conectarComoAdministrador();
                break;
            case 1:
                await this.conectarComoUsuario();
                break;
            case 2:
                await this.registrarNuevoUsuario();
                break;
            default:
            console.log("Saliendo del sistema...");
        }
    }

    async registrarNuevoUsuario() {
        try {
            // Conectar con el usuario administrador
            this.client = new MongoClient(this.adminUri);
            await this.client.connect();
            console.log("Conectado como administrador para crear nuevo usuario.");
    
            const nombre = readlineSync.question('Ingrese el nombre del nuevo usuario: ');
            const contraseña = readlineSync.question('Ingrese la contraseña del nuevo usuario: ', { hideEchoBack: true });
    
            const db = this.client.db('cineCampus');
    
            // Crear el nuevo usuario
            await db.command({
                createUser: nombre,
                pwd: contraseña,
                roles: [
                    { role: "readWrite", db: this.dbName }
                ]
            });
    
            console.log(`Usuario ${nombre} creado exitosamente.`);
    
            // Cerrar la conexión de administrador
            await this.client.close();
    
            // Reconectar con el nuevo usuario
            const newUserUri = `${process.env.MONGO}${nombre}:${encodeURIComponent(contraseña)}${process.env.DOMINIO}${process.env.DB_NAME}?retryWrites=true&w=majority`;
            this.client = new MongoClient(newUserUri);
            await this.client.connect();
            console.log(`Reconectado como ${nombre}.`);
    
            this.mostrarMenuUsuario();
    
        } catch (error) {
            console.error("Error:", error);
        } finally {
            if (this.client) {
                await this.client.close();
            }
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
                await this.mostrarMenuAdministrador(user, pws, resultPeliculas, resultUsers, resultDescription, close);
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
                'Eliminar Película'
            ];

            const index = readlineSync.keyInSelect(opciones, '¿Qué acción deseas realizar?', { cancel: 'Salir' });

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
                    await this.movies.dropMovie(user, pws);
                    break;
                default:
                    continuar =false
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
            console.log("Conectando como usuario...");
            const resultFunctions = await this.movies.getMoviesFunction(user, pws);
            const resultSeats = await this.users.getSeats(user, pws);
            console.log("Conexión establecida correctamente.");
            await this.mostrarMenuUsuario(resultFunctions, resultSeats);
        } catch (error) {
            console.error("Error al conectar:", error);
        }
    }

    
    async mostrarMenuUsuario(resultFunctions, resultSeats) {
        let continuar = true;

        while (continuar) {
            const opciones = [
                'Ver Películas Disponibles',
                'Comprar Boleto',
                'Cancelar Reservación'
            ];

            const index = readlineSync.keyInSelect(opciones, '¿Qué acción deseas realizar?', { cancel: 'Salir' });

            switch (index) {
                case 0:
                    console.log("Películas Disponibles:");
                    console.log(resultFunctions);
                    break;
                case 1:
                    console.log("Peliculas Disponibles:");
                    await this.procesarCompraOReserva(resultFunctions, resultSeats);
                    break;
                case 2:
                    await this.users.cancelarReserva();
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

    async procesarCompraOReserva(resultFunctions, resultSeats) {
        // Mostrar películas disponibles
        console.log("Películas Disponibles:");
        resultFunctions.forEach((pelicula, index) => {
            console.log(`${index + 1}. ${pelicula.title}`);
        });
    
        // Seleccionar película
        const peliculaIndex = readlineSync.questionInt('Selecciona el número de la película a la que quieres asistir: ') - 1;
        if (peliculaIndex < 0 || peliculaIndex >= resultFunctions.length) {
            console.log("Selección inválida.");
            return;
        }
    
        const peliculaSeleccionada = resultFunctions[peliculaIndex];
    
        // Verificar si el usuario tiene tarjeta VIP
        const tieneVIP = readlineSync.keyInYNStrict('¿Posees una tarjeta VIP?');
        let descuento = 0;
    
        if (tieneVIP) {
            const numeroTarjeta = readlineSync.question('Por favor, ingresa el número de tu tarjeta VIP: ');
            const esVIPValido = await this.users.verificarTarjetaVIP(numeroTarjeta);
            if (esVIPValido) {
                descuento = 0.15; // 15% de descuento
                console.log("¡Tarjeta VIP verificada! Se aplicará un 15% de descuento.");
            } else {
                console.log("Lo siento, no se pudo verificar la tarjeta VIP. No se aplicará descuento.");
            }
        }
    
        // Mostrar asientos disponibles
        console.log("Asientos Disponibles:");
        console.log(resultSeats);
    
        // Preguntar si quiere comprar o reservar
        const opcion = readlineSync.keyInSelect(['Comprar', 'Reservar'], '¿Deseas comprar o reservar el boleto?', { cancel: 'Cancelar' });
    
        switch (opcion) {
            case 0:
                await this.users.comprarBoleto(resultSeats, descuento);
                break;
            case 1:
                await this.users.reservarBoleto(resultSeats);
                break;
            default:
                console.log("Operación cancelada.");
        }
    }
    
}