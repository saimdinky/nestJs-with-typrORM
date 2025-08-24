import "reflect-metadata";
import { DataSource } from "typeorm";
import { runSeeds } from "./index";
import AppDataSource from "../../config/database.config";
import { CustomLoggerService } from "../../modules/logger/logger.service";

async function main() {
  const logger = new CustomLoggerService("SeedRunner");

  logger.log("🌱 Running database seeds...");

  try {
    // Initialize the data source
    await AppDataSource.initialize();
    logger.log("✅ Database connection established");

    // Run the seeds
    await runSeeds(AppDataSource, logger);

    logger.log("🎉 Seeding completed successfully!");
  } catch (error) {
    logger.error("❌ Error during seeding:", error);
    process.exit(1);
  } finally {
    // Close the connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      logger.log("📝 Database connection closed");
    }
  }
}

main();
