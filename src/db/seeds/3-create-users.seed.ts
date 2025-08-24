import { DataSource } from "typeorm";
import * as bcrypt from "bcrypt";
import { User } from "../../modules/users/entities/user.entity";
import { Role } from "../../modules/roles/entities/role.entity";
import { CustomLoggerService } from "../../modules/logger/logger.service";

export async function createUsers(
  dataSource: DataSource,
  logger?: CustomLoggerService
): Promise<void> {
  const userRepository = dataSource.getRepository(User);
  const roleRepository = dataSource.getRepository(Role);

  // Check if users already exist
  const existingUsers = await userRepository.count();
  if (existingUsers > 0) {
    const message = "Users already exist, skipping...";
    logger ? logger.log(message) : console.log(message);
    return;
  }

  // Get roles
  const superAdminRole = await roleRepository.findOne({
    where: { name: "super_admin" },
    relations: ["permissions"],
  });
  const adminRole = await roleRepository.findOne({
    where: { name: "admin" },
    relations: ["permissions"],
  });
  const userRole = await roleRepository.findOne({
    where: { name: "user" },
    relations: ["permissions"],
  });

  if (!superAdminRole || !adminRole || !userRole) {
    throw new Error("Required roles not found. Please run roles seed first.");
  }

  // Hash passwords
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash("password123", saltRounds);

  const users = [
    {
      name: "Super Administrator",
      email: "superadmin@example.com",
      password: hashedPassword,
      roles: [superAdminRole],
    },
    {
      name: "Administrator",
      email: "admin@example.com",
      password: hashedPassword,
      roles: [adminRole],
    },
    {
      name: "Regular User",
      email: "user@example.com",
      password: hashedPassword,
      roles: [userRole],
    },
    {
      name: "Test User",
      email: "test@example.com",
      password: hashedPassword,
      roles: [userRole],
    },
  ];

  for (const userData of users) {
    const user = userRepository.create(userData);
    await userRepository.save(user);
    const message = `Created user: ${user.email} with roles: ${userData.roles.map((r) => r.name).join(", ")}`;
    logger ? logger.log(message) : console.log(message);
  }

  const successMessage = "✅ Users seeded successfully";
  logger ? logger.log(successMessage) : console.log(successMessage);
}
