import { z } from "zod";
import { PaginationOptions } from "./common.types";

// Create User Schema
export const CreateUserZod = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  roleIds: z.array(z.number()).optional(),
});

// Update User Schema
export const UpdateUserZod = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email format").optional(),
  roleIds: z.array(z.number()).optional(),
});

// User Response Schema
export const UserZod = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  enable: z.boolean(),
  deleted: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  roles: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        permissions: z
          .array(
            z.object({
              id: z.number(),
              name: z.string(),
              url: z.string(),
              regex: z.string(),
            })
          )
          .optional(),
      })
    )
    .optional(),
});

// Users Pagination Options
export const UsersPaginationOptions = PaginationOptions.extend({
  name: z.string().optional(),
  email: z.string().optional(),
  roleId: z.coerce.number().optional(),
});

// Paginated Users Schema
export const PaginatedUsersSchema = z.object({
  items: z.array(UserZod),
  meta: z.object({
    totalItems: z.number(),
    itemCount: z.number(),
    itemsPerPage: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
  }),
});

// Type exports
export type CreateUserDto = z.infer<typeof CreateUserZod>;
export type UpdateUserDto = z.infer<typeof UpdateUserZod>;
export type UserResponse = z.infer<typeof UserZod>;
export type UsersPaginationOptions = z.infer<typeof UsersPaginationOptions>;
export type PaginatedUsersResponse = z.infer<typeof PaginatedUsersSchema>;
