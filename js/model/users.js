// models/users.js
import Connection from '../../db/connect/connect.js';

export class Users {
    constructor() {
        this.connection = new Connection();
        this.db = null;
    }

    async connect(user, pws) {
        if (!this.db) {
            try {
                await this.connection.login(user, pws);
                this.db = await this.connection.connect();
            } catch (err) {
                console.error('Error connecting to the database:', err);
            }
        }
    }

    async getUsers(user, pws) {
        await this.connect(user, pws);
        try {
            const collections = await this.db.collection('users').find().toArray();
            return collections;
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    }

    async closeConnection() {
        if (this.connection) {
            await this.connection.close();
            this.db = null;
        }
    }
}