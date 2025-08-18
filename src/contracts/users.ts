import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  CreateUserZod,
  UpdateUserZod,
  UserZod,
  UsersPaginationOptions,
  PaginatedUsersSchema,
} from '../common/types/user.types';

const c = initContract();

const ErrorResponse = z.object({
  message: z.string(),
  error: z.string().optional(),
  statusCode: z.number(),
});

const SuccessMessage = z.object({
  message: z.string(),
});

export const usersContract = c.router(
  {
    create: {
      path: '/',
      method: 'POST',
      summary: 'Create a new user',
      body: CreateUserZod,
      responses: {
        201: UserZod,
        400: ErrorResponse,
        409: ErrorResponse,
      },
    },
    findAll: {
      path: '/',
      method: 'GET',
      summary: 'Get all users with pagination',
      query: UsersPaginationOptions,
      responses: {
        200: PaginatedUsersSchema,
        400: ErrorResponse,
      },
    },
    findOne: {
      path: '/:id',
      method: 'GET',
      summary: 'Get user by ID',
      pathParams: z.object({
        id: z.coerce.number(),
      }),
      responses: {
        200: UserZod,
        404: ErrorResponse,
      },
    },
    update: {
      path: '/:id',
      method: 'PATCH',
      summary: 'Update user',
      pathParams: z.object({
        id: z.coerce.number(),
      }),
      body: UpdateUserZod,
      responses: {
        200: UserZod,
        400: ErrorResponse,
        404: ErrorResponse,
      },
    },
    delete: {
      path: '/:id',
      method: 'DELETE',
      summary: 'Delete user',
      pathParams: z.object({
        id: z.coerce.number(),
      }),
      responses: {
        200: SuccessMessage,
        404: ErrorResponse,
      },
    },
  },
  { pathPrefix: '/users' },
);
