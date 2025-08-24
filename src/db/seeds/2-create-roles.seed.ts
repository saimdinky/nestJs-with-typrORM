import { DataSource } from "typeorm";
import { Role } from "../../modules/roles/entities/role.entity";
import { Permission } from "../../modules/permissions/entities/permission.entity";
import { CustomLoggerService } from "../../modules/logger/logger.service";

export async function createRoles(
  dataSource: DataSource,
  logger?: CustomLoggerService
): Promise<void> {
  const roleRepository = dataSource.getRepository(Role);
  const permissionRepository = dataSource.getRepository(Permission);

  // Check if roles already exist
  const existingRoles = await roleRepository.count();
  if (existingRoles > 0) {
    const message = "Roles already exist, skipping...";
    logger ? logger.log(message) : console.log(message);
    return;
  }

  // Get the all:* permission
  const allPermission = await permissionRepository.findOne({
    where: { name: "all:*" },
  });

  if (!allPermission) {
    throw new Error(
      'Permission "all:*" not found. Please run permissions seed first.'
    );
  }

  // Get user-related permissions
  const userReadPermission = await permissionRepository.findOne({
    where: { name: "users:read" },
  });
  const userWritePermission = await permissionRepository.findOne({
    where: { name: "users:write" },
  });

  const roles = [
    {
      name: "super_admin",
      permissions: [allPermission], // Super admin gets all permissions
    },
    {
      name: "admin",
      permissions: [userReadPermission, userWritePermission].filter(Boolean),
    },
    {
      name: "user",
      permissions: [userReadPermission].filter(Boolean),
    },
  ];

  for (const roleData of roles) {
    const role = roleRepository.create({
      name: roleData.name,
      permissions: roleData.permissions,
    });
    await roleRepository.save(role);
    const message = `Created role: ${role.name} with ${roleData.permissions.length} permissions`;
    logger ? logger.log(message) : console.log(message);
  }

  const successMessage = "✅ Roles seeded successfully";
  logger ? logger.log(successMessage) : console.log(successMessage);
}
