import Connection from '../../db/connect/connect.js';
import { MongoClient } from 'mongodb';

export default class Users {
    constructor() {
        this.connection = new Connection();
        this.client = null;
        this.db = null;
        this.adminUri = 'mongodb://mongo:QzTrGVnGyYjBHnmnBVuVcOtJNGxHvEAL@roundhouse.proxy.rlwy.net:17787/'
        this.dbName = 'cineCampus';
    }

    /**
 * Establece una conexión a la base de datos MongoDB si aún no se ha establecido.
 *
 * @async
 * @function connect
 * @returns {Promise<void>} - Resuelve cuando la conexión se establece o rechaza con un error.
 *
 * @throws Lanza un error si la conexión a la base de datos falla.
 *
 * @example
 * const user = new Users();
 * await user.connect();
 */
async connect() {
    if (!this.db) {
        try {
            // Usamos una conexión predefinida
            this.db = await this.connection.connect();
        } catch (err) {
            console.error('Error conectando a la base de datos:', err);
        }
    }
}

/**
 * Registra un nuevo usuario en la base de datos MongoDB.
 *
 * @async
 * @function registrarNuevoUsuario
 * @returns {Promise<string>} - Resuelve con una cadena vacía cuando el registro de usuario es exitoso,
 * o rechaza con un error.
 *
 * @throws Lanza un error si la conexión a la base de datos falla, si el registro de usuario falla,
 * o si hay un problema al cerrar la conexión a la base de datos.
 *
 * @example
 *
 */
async registrarNuevoUsuario() {
    try {
        // Conectar con el usuario administrador
        this.client = new MongoClient(this.adminUri);
        await this.client.connect();
        console.log("Conectado como administrador para crear nuevo usuario.");

        // Datos predefinidos
        const nombre = 'juanito'; // Nombre del nuevo usuario
        const contraseña = '1234'; // Contraseña del nuevo usuario

        const db = this.client.db(this.dbName);

        // Crear el nuevo usuario
        await db.command({
            createUser: nombre,
            pwd: contraseña,
            roles: [
                { role: "usuario", db: this.dbName }
            ]
        });

        const name = 'juanito';
        const email = 'juanitojuega@gmail.com';
        const numero = 319008921;
        const CC = 1097495849;
        const Estado = 'Estandar'
        const userNew = {
            username: name,
            email: email,
            numero: numero,
            CC: CC,
            Estado: Estado,
        };

        // Inserta el nuevo usuario en la colección 'users'
        await db.collection('users').insertOne(userNew);
        console.log(`Usuario ${nombre} creado exitosamente.`);

        // Cerrar la conexión de administrador
        await this.client.close();

    } catch (error) {
        console.error("Error:", error);
    } finally {
        if (this.client) {
            await this.client.close();
        }
    }
    return "";
}

/**
 * Actualiza el rol y la información personal de un usuario en la base de datos MongoDB.
 *
 * @async
 * @function updateRole
 * @returns {Promise<void>} - Resuelve cuando la actualización del usuario es exitosa o rechaza con un error.
 *
 * @throws Lanza un error si la conexión a la base de datos falla o si la actualización del usuario falla.
 *
 * @example
 * const user = new Users();
 * await user.updateRole();
 */
async updateRole(){
    try {
        // Conectarse como administrador
        this.client = new MongoClient(this.adminUri);
        await this.client.connect();
        console.log("Conectado como administrador para actualizar usuario.");

        // Datos predefinidos
        const nombre = 'pepe'; // Nombre del usuario a actualizar
        const contraseña = '1234'; // Nueva contraseña del usuario

        const db = this.client.db(this.dbName);

        // Actualizar el usuario existente
        await db.command({
            updateUser: nombre,
            pwd: contraseña,
            roles: [
                { role: "usuario", db: this.dbName },
                { role: "usuarioVip", db: this.dbName } // Añadir rol de usuario VIP
            ]
        });

        const email = 'juanitojuega@gmail.com';
        const numero = 319008921;
        const CC = 1097495849;
        const Estado = 'VIP'; // Cambiado a VIP

        // Actualizar el usuario en la colección 'users'
        const result = await db.collection('users').updateOne(
            { username: nombre },
            {
                $set: {
                    email: email,
                    numero: numero,
                    CC: CC,
                    Estado: Estado,
                }
            }
        );

        if (result.matchedCount === 0) {
            console.log(`Usuario ${nombre} no encontrado.`);
        } else if (result.modifiedCount === 0) {
            console.log(`No se realizaron cambios para el usuario ${nombre}.`);
        } else {
            console.log(`Usuario ${nombre} actualizado exitosamente.`);
        }

        // Cerrar la conexión de administrador
        await this.client.close();

    } catch (error) {
        console.error("Error:", error);
    } finally {
        if (this.client) {
            await this.client.close();
        }
    }
}

    /**
 * Obtiene una lista de usuarios de la base de datos MongoDB con el rol 'cineCampus'.
 *
 * @async
 * @function getUsers
 * @returns {Promise<string>} - Resuelve con una cadena que contiene los nombres de los usuarios,
 * o rechaza con un error.
 *
 * @throws Lanza un error si hay un problema al recuperar los usuarios de la base de datos.
 *
 * @example
 * const user = new Users();
 * const listaUsuarios = await user.getUsers();
 * console.log(listaUsuarios);
 */
async getUsers() {
    await this.connect();
    try {
        let usuarios = '';

        const resultado = await this.db.command({ usersInfo: 1 });

        const usuariosCineCampus = resultado.users.filter(usuario =>
            usuario.roles.some(rol => rol.db === 'cineCampus')
        );
        usuariosCineCampus.forEach(usr => {
            usuarios += (`- nombre: ${usr.user}\n`);
        });

        return usuarios;
    } catch (err) {
        console.error('Error al recuperar usuarios:', err);
        throw err;
    }
}

    /**
 * Recupera una lista de descripciones de usuarios de la base de datos MongoDB.
 *
 * @async
 * @function getUsersDescription
 * @returns {Promise<Object[]>} - Resuelve con un array de descripciones de usuarios,
 * o rechaza con un error.
 *
 * @throws Lanza un error si hay un problema al recuperar usuarios de la base de datos.
 *
 * @example
 * const user = new Users();
 * const descripcionesUsuarios = await user.getUsersDescription();
 * console.log(descripcionesUsuarios);
 */
async getUsersDescription() {
    await this.connect();
    try {
        const collection = await this.db.collection('users').find().toArray();
        return collection;
    } catch (err) {
        console.error('Error al recuperar usuario:', err);
    }
}
    /**
 * Verifica si un número de tarjeta VIP dado existe en la base de datos MongoDB.
 * Si el número de tarjeta se encuentra, devuelve un mensaje que indica un 15% de descuento por ser cliente VIP.
 * Si el número de tarjeta no se encuentra, devuelve false.
 *
 * @async
 * @function verificarTarjetaVIP
 * @param {string} numeroTarjeta - El número de tarjeta VIP a verificar.
 * @returns {Promise<string|boolean>} - Resuelve con un mensaje que indica un 15% de descuento si el número de tarjeta se encuentra,
 * o false si el número de tarjeta no se encuentra. Rechaza con un error si hay un problema al verificar la tarjeta.
 *
 * @throws Lanza un error si hay un problema conectándose a la base de datos o verificando la tarjeta.
 *
 * @example
 * const user = new Users();
 * const tarjetaVIPMessage = await user.verificarTarjetaVIP('1234567890');
 * console.log(tarjetaVIPMessage);
 */
async verificarTarjetaVIP(numeroTarjeta) {
    await this.connect();
    try {
        const tarjeta = await this.db.collection('vip-cards').findOne({ cardNumber: numeroTarjeta });
        return 'Usted posee un 15% de descuento por ser cliente VIP';
    } catch (error) {
        console.error("Error al verificar la tarjeta VIP:", error);
        return false;
    }
}

    /**
 * Cierra la conexión a la base de datos MongoDB.
 *
 * @async
 * @function closeConnection
 * @returns {Promise<void>} - Resuelve cuando la conexión se cierra correctamente o rechaza con un error.
 *
 * @throws Lanza un error si hay un problema al cerrar la conexión a la base de datos.
 *
 * @example
 * const user = new Users();
 * await user.closeConnection();
 */
async closeConnection() {
    if (this.connection) {
        await this.connection.close();
        this.db = null;
    }
}
}
