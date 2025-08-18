import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  CreateRoleZod,
  UpdateRoleZod,
  RoleZod,
  RolesPaginationOptions,
  PaginatedRolesSchema,
} from '../common/types/role.types';

const c = initContract();

const ErrorResponse = z.object({
  message: z.string(),
  error: z.string().optional(),
  statusCode: z.number(),
});

const SuccessMessage = z.object({
  message: z.string(),
});

export const rolesContract = c.router(
  {
    create: {
      path: '/',
      method: 'POST',
      summary: 'Create a new role',
      body: CreateRoleZod,
      responses: {
        201: RoleZod,
        400: ErrorResponse,
        409: ErrorResponse,
      },
    },
    findAll: {
      path: '/',
      method: 'GET',
      summary: 'Get all roles with pagination',
      query: RolesPaginationOptions,
      responses: {
        200: PaginatedRolesSchema,
        400: ErrorResponse,
      },
    },
    findOne: {
      path: '/:id',
      method: 'GET',
      summary: 'Get role by ID',
      pathParams: z.object({
        id: z.coerce.number(),
      }),
      responses: {
        200: RoleZod,
        404: ErrorResponse,
      },
    },
    update: {
      path: '/:id',
      method: 'PATCH',
      summary: 'Update role',
      pathParams: z.object({
        id: z.coerce.number(),
      }),
      body: UpdateRoleZod,
      responses: {
        200: RoleZod,
        400: ErrorResponse,
        404: ErrorResponse,
      },
    },
    delete: {
      path: '/:id',
      method: 'DELETE',
      summary: 'Delete role',
      pathParams: z.object({
        id: z.coerce.number(),
      }),
      responses: {
        200: SuccessMessage,
        404: ErrorResponse,
      },
    },
  },
  { pathPrefix: '/roles' },
);
