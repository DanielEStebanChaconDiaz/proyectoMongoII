import Connection from '../../db/connect/connect.js';
import { ObjectId } from 'mongodb';

export class Users{
    async getUsers(){
        const connection = new Connection();
        try {
            const db = await connection.connect();
            const user = db.collection('users');
            const result = await user.find().toArray();
            return result;
        } catch (err) {
            console.error(err);
        } finally {
            await connection.close();
        }
    }
}