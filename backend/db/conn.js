import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.ATLAS_URI || "";

console.log(connectionString);

const client = new MongoClient(connectionString);

let conn;
try {
    conn = await client.connect();
    console.log("Connected to MongoDB Atlas");
} catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error);
}

let db = client.db("users");

export default db;

