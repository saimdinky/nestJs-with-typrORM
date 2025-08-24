import { DataSource } from "typeorm";
import { Permission } from "../../modules/permissions/entities/permission.entity";
import { CustomLoggerService } from "../../modules/logger/logger.service";

export async function createPermissions(
  dataSource: DataSource,
  logger?: CustomLoggerService
): Promise<void> {
  const permissionRepository = dataSource.getRepository(Permission);

  // Check if permissions already exist
  const existingPermissions = await permissionRepository.count();
  if (existingPermissions > 0) {
    const message = "Permissions already exist, skipping...";
    logger ? logger.log(message) : console.log(message);
    return;
  }

  const permissions = [
    {
      name: "all:*",
      url: "*",
      regex: ".*",
    },
    {
      name: "users:read",
      url: "/api/users",
      regex: "^/api/users$",
    },
    {
      name: "users:write",
      url: "/api/users",
      regex: "^/api/users.*$",
    },
    {
      name: "roles:read",
      url: "/api/roles",
      regex: "^/api/roles$",
    },
    {
      name: "roles:write",
      url: "/api/roles",
      regex: "^/api/roles.*$",
    },
    {
      name: "permissions:read",
      url: "/api/permissions",
      regex: "^/api/permissions$",
    },
    {
      name: "permissions:write",
      url: "/api/permissions",
      regex: "^/api/permissions.*$",
    },
  ];

  for (const permissionData of permissions) {
    const permission = permissionRepository.create(permissionData);
    await permissionRepository.save(permission);
    const message = `Created permission: ${permission.name}`;
    logger ? logger.log(message) : console.log(message);
  }

  const successMessage = "✅ Permissions seeded successfully";
  logger ? logger.log(successMessage) : console.log(successMessage);
}
