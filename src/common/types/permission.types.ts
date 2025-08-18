import { z } from 'zod';
import { PaginationOptions } from './common.types';

// Permission Schema
export const PermissionZod = z.object({
  id: z.number(),
  name: z.string(),
  url: z.string(),
  regex: z.string(),
  enable: z.boolean(),
  deleted: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Create Permission Schema
export const CreatePermissionZod = z.object({
  name: z.string().min(2, 'Permission name must be at least 2 characters'),
  url: z.string().min(1, 'URL is required'),
  regex: z.string().min(1, 'Regex pattern is required'),
});

// Update Permission Schema
export const UpdatePermissionZod = z.object({
  name: z
    .string()
    .min(2, 'Permission name must be at least 2 characters')
    .optional(),
  url: z.string().min(1, 'URL is required').optional(),
  regex: z.string().min(1, 'Regex pattern is required').optional(),
});

// Permissions Pagination Options
export const PermissionsPaginationOptions = PaginationOptions.extend({
  name: z.string().optional(),
  url: z.string().optional(),
});

// Paginated Permissions Schema
export const PaginatedPermissionsSchema = z.object({
  items: z.array(PermissionZod),
  meta: z.object({
    totalItems: z.number(),
    itemCount: z.number(),
    itemsPerPage: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
  }),
});

// Type exports
export type PermissionResponse = z.infer<typeof PermissionZod>;
export type CreatePermissionDto = z.infer<typeof CreatePermissionZod>;
export type UpdatePermissionDto = z.infer<typeof UpdatePermissionZod>;
export type PermissionsPaginationOptions = z.infer<
  typeof PermissionsPaginationOptions
>;
export type PaginatedPermissionsResponse = z.infer<
  typeof PaginatedPermissionsSchema
>;
