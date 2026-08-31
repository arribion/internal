import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const DATABASE_URI = process.env.DATABASE_URI;

if (!DATABASE_URI) {
  throw new Error("DATABASE_URI is missing in environment variables.");
}

// Create the driver client
const sql = neon(DATABASE_URI);

// The modern API safely reads the client driver along with your structured schemas
export const db = drizzle({ client: sql });
export default db;

// Execute a simple query to test the raw Neon client connection
export const TestDBconnection = async () => {
  try {
    const result = await sql`SELECT NOW();`;
    console.log("Database connection successful:", result);
    return result;
  } catch (error) {
    console.error("Database connection failed:", error);
    throw error;
  }
};