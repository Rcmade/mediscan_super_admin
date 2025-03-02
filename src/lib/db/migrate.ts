import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
// import "dotenv/config";

// PostgreSQL client configuration
const migrationClient = postgres(process.env.DATABASE_URL!, { max: 1 });

// Main function to run migrations
async function main() {
  try {
    // Initialize drizzle ORM with the PostgreSQL client
    await migrate(drizzle(migrationClient), {
      migrationsFolder: "./src/lib/db/migrations",
    });
    console.log("Migrations completed successfully!");
  } catch (error) {
    console.error("Error running migrations:", error);
  } finally {
    // Close the PostgreSQL client connection
    await migrationClient.end();
  }
}

// Run the main function
main();
