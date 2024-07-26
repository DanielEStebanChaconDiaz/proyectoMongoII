
import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

const MONGO = process.env.MONGO; 
const DOMINIO = process.env.DOMINIO; 
const DB_NAME = process.env.DB_NAME; 

export default class Connection {
    constructor() {
        this.client = null;
        this.db = null;
    }

    async login(user, pws) {
        const uri = `${MONGO}${user}:${encodeURIComponent(pws)}${DOMINIO}${DB_NAME}?retryWrites=true&w=majority`;
        // console.log(`Connecting to MongoDB with URI: ${uri}`);
        this.client = new MongoClient(uri);
    }

    async connect() {
        if (!this.db) {
            try {
                await this.client.connect();
                this.db = this.client.db(DB_NAME);
            } catch (error) {
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
        return "";
    }
}