import readlineSync from 'readline-sync';
import Connection from '../db/connect/connect.js';

export async function conectarConMongoDB() {
    const user = readlineSync.question('Por favor, ingresa tu nombre de usuario: ');
    const pws = readlineSync.question('Por favor, ingresa tu contraseña: ', { hideEchoBack: true });

    if (!user || !pws) {
        console.error("El nombre de usuario y la contraseña son obligatorios.");
        return;
    }

    const connection = new Connection();
    await connection.login(user, pws);

    try {
        console.log("Intentando conectar a MongoDB...");
        const db = await connection.connect();
        console.log("Conexión a MongoDB establecida correctamente.");

        // Ejemplo: Listar las colecciones
        const collections = await db.listCollections().toArray();
        console.log("Colecciones en la base de datos:", collections);

        await connection.close();
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
    }
}
