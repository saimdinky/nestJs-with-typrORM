import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  CreatePermissionZod,
  UpdatePermissionZod,
  PermissionZod,
  PermissionsPaginationOptions,
  PaginatedPermissionsSchema,
} from '../common/types/permission.types';

const c = initContract();

const ErrorResponse = z.object({
  message: z.string(),
  error: z.string().optional(),
  statusCode: z.number(),
});

const SuccessMessage = z.object({
  message: z.string(),
});

export const permissionsContract = c.router(
  {
    create: {
      path: '/',
      method: 'POST',
      summary: 'Create a new permission',
      body: CreatePermissionZod,
      responses: {
        201: PermissionZod,
        400: ErrorResponse,
        409: ErrorResponse,
      },
    },
    findAll: {
      path: '/',
      method: 'GET',
      summary: 'Get all permissions with pagination',
      query: PermissionsPaginationOptions,
      responses: {
        200: PaginatedPermissionsSchema,
        400: ErrorResponse,
      },
    },
    findOne: {
      path: '/:id',
      method: 'GET',
      summary: 'Get permission by ID',
      pathParams: z.object({
        id: z.coerce.number(),
      }),
      responses: {
        200: PermissionZod,
        404: ErrorResponse,
      },
    },
    update: {
      path: '/:id',
      method: 'PATCH',
      summary: 'Update permission',
      pathParams: z.object({
        id: z.coerce.number(),
      }),
      body: UpdatePermissionZod,
      responses: {
        200: PermissionZod,
        400: ErrorResponse,
        404: ErrorResponse,
      },
    },
    delete: {
      path: '/:id',
      method: 'DELETE',
      summary: 'Delete permission',
      pathParams: z.object({
        id: z.coerce.number(),
      }),
      responses: {
        200: SuccessMessage,
        404: ErrorResponse,
      },
    },
  },
  { pathPrefix: '/permissions' },
);
