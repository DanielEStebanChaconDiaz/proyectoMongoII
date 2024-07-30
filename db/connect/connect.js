import { MongoClient } from "mongodb";
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.MONGO_URI;

/**
 * Manages a MongoDB connection.
 */
export default class Connection {
    /**
     * Creates a new instance of Connection.
     */
    constructor(){
        this.client = new MongoClient(uri);
    }

    /**
     * Connects to MongoDB.
     *
     * @returns {Promise<import("mongodb").Db>} The connected MongoDB database.
     * @throws {Error} If there is an error connecting to MongoDB.
     */
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

    /**
     * Returns the connected MongoDB database.
     *
     * @returns {import("mongodb").Db} The connected MongoDB database.
     * @throws {Error} If the MongoDB connection is not established.
     */
    getDb() {
        if (!this.db) {
            throw new Error("MongoDB connection not established");
        }
        return this.db;
    }

    /**
     * Closes the MongoDB connection.
     */
    async close() {
        if (this.client) {
            await this.client.close();
            console.log("MongoDB connection closed");
        }
    }
}