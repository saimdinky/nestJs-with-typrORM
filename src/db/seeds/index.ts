import { DataSource } from "typeorm";
import { createPermissions } from "./1-create-permissions.seed";
import { createRoles } from "./2-create-roles.seed";
import { createUsers } from "./3-create-users.seed";
import { CustomLoggerService } from "../../modules/logger/logger.service";

export async function runSeeds(
  dataSource: DataSource,
  logger?: CustomLoggerService
): Promise<void> {
  const message = "🌱 Starting database seeding...";
  logger ? logger.log(message) : console.log(message);

  try {
    // Run seeds in order
    await createPermissions(dataSource, logger);
    await createRoles(dataSource, logger);
    await createUsers(dataSource, logger);

    const successMessage = "🎉 Database seeding completed successfully!";
    logger ? logger.log(successMessage) : console.log(successMessage);
  } catch (error) {
    const errorMessage = "❌ Error during seeding:";
    logger
      ? logger.error(errorMessage, error)
      : console.error(errorMessage, error);
    throw error;
  }
}
