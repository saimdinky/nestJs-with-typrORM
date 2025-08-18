import { z } from 'zod';
import { PaginationOptions } from './common.types';

// Role Schema
export const RoleZod = z.object({
  id: z.number(),
  name: z.string(),
  enable: z.boolean(),
  deleted: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  permissions: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        url: z.string(),
        regex: z.string(),
      }),
    )
    .optional(),
});

// Create Role Schema
export const CreateRoleZod = z.object({
  name: z.string().min(2, 'Role name must be at least 2 characters'),
  permissionIds: z.array(z.number()).optional(),
});

// Update Role Schema
export const UpdateRoleZod = z.object({
  name: z.string().min(2, 'Role name must be at least 2 characters').optional(),
  permissionIds: z.array(z.number()).optional(),
});

// Roles Pagination Options
export const RolesPaginationOptions = PaginationOptions.extend({
  name: z.string().optional(),
});

// Paginated Roles Schema
export const PaginatedRolesSchema = z.object({
  items: z.array(RoleZod),
  meta: z.object({
    totalItems: z.number(),
    itemCount: z.number(),
    itemsPerPage: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
  }),
});

// Type exports
export type RoleResponse = z.infer<typeof RoleZod>;
export type CreateRoleDto = z.infer<typeof CreateRoleZod>;
export type UpdateRoleDto = z.infer<typeof UpdateRoleZod>;
export type RolesPaginationOptions = z.infer<typeof RolesPaginationOptions>;
export type PaginatedRolesResponse = z.infer<typeof PaginatedRolesSchema>;
