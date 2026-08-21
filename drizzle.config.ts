import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/db/mr", // Destination folder for the pulled schema files
  dialect: "postgresql", // Use 'mysql' or 'sqlite' depending on your DB
  dbCredentials: {
    url: process.env.DATABASE_URI!, // Your live database connection string
  },
});
