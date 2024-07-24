import readlineSync from 'readline-sync';
import Connection from '../db/connect/connect.js';
import { Collection } from 'mongodb';
import { Users } from './model/users.js';
import { Movies } from './model/movies.js';

export class Login {
    async login() {
        console.log("Bienvenido a la Base de Datos MongoDB");
        console.log("1. Conectar como administrador");
        console.log('2. Conectar como Usuario');
        console.log('3. Conectar como Vip');

        const opcion = readlineSync.questionInt("Selecciona una opción: ");

        switch (opcion) {
            case 1:
                await conectarConMongoDB();
                break;
            // Agrega más casos aquí si es necesario
        }
    }
}

export async function conectarConMongoDB() {
    const user = readlineSync.question('Por favor, ingresa tu nombre de usuario: ');
    const pws = readlineSync.question('Por favor, ingresa tu contraseña: ', { hideEchoBack: true });
    console.clear();
    if (user === 'adminCineCampus' && pws === '1234') {
        if (!user || !pws) {
            console.error("El nombre de usuario y la contraseña son obligatorios.");
            return;
        }

        console.clear();

        try {
            console.log("Intentando conectar a MongoDB...");
            const movies = new Movies();
            const resultPelicuals = await movies.getMovies(user, pws);
            const resultDescription = await movies.getMoviesDescription(user, pws);
            const users = new Users();
            const resultUsers = await users.getUsers(user, pws);
            console.log("Conexión a MongoDB establecida correctamente.");
            mostrarMenuCRUD(resultPelicuals, resultUsers, resultDescription);
        } catch (error) {
            console.error("Error al conectar a MongoDB:", error);
        }
    } else {
        console.log("Nombre de usuario y contraseña incorrectos.");
    }
}

async function mostrarMenuCRUD(resultPelicuals, resultUsers,resultDescription) {
    let salir = false;

    while (!salir) {
        console.log("\nMenú CRUD:");
        console.log("1. Listar Peliculas");
        console.log("2. Lstar Descripcion de peliculas");
        console.log("3. Listar Users");

        const opcion = readlineSync.questionInt("Selecciona una opción: ");

        switch (opcion) {
            case 1:
                console.log("Listando colecciones:");
                console.log(resultPelicuals);
                break;
            case 2:
                console.log("Descripcion de peliculas:");
                console.log(resultDescription);
                break;
            case 3:
                console.log("Listando Usuarios:");
                console.log(resultUsers);
                break;
            default:
                console.log("Opción no válida. Intenta de nuevo.");
        }
    }
}