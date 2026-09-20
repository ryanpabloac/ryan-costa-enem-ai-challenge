import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase() {
    try {
        await mongoose.connect(env.DB_URL);
        console.log("Database MongoDB connected");
    } catch(error) {
        console.error("Database connection error:", error);
        process.exit(1);
    }
}

export async function disconnectDatabase() {
    try {
        await mongoose.disconnect()
        console.log("Database MongoDB disconnected");
    } catch(error) {
        console.error("Database disconnection error:", error);
        process.exit(1);
    }
}