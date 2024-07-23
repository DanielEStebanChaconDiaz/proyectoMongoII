import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;

export default class Connection {
    constructor(){
        this.client = new MongoClient(uri);
    }

    async connect() {
        if (!this.db){
            try {
                await this.client.connect();
                this.db = this.client.db(process.env.DB_NAME);
            }
            catch (error) {
                console.error("Error connecting to MongoDB:", error);
                throw error;
            }
        }
        return this.db;
    }

    getDb() {
        if (!this.db) {
            throw new Error("MongoDB connection not established");
        }
        return this.db;
    }

    async close() {
        if (this.client) {
            await this.client.close();
            console.log("MongoDB connection closed");
        }
    }
}
