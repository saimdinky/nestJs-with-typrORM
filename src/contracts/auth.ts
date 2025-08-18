import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import {
  LoginZod,
  RegisterZod,
  LoginResponseZod,
  ChangePasswordZod,
} from '../common/types/auth.types';

const c = initContract();

// Error response schemas
const ErrorResponse = z.object({
  message: z.string(),
  error: z.string().optional(),
  statusCode: z.number(),
});

const SuccessMessage = z.object({
  message: z.string(),
});

export const authContract = c.router(
  {
    login: {
      path: '/login',
      method: 'POST',
      summary: 'User login',
      body: LoginZod,
      responses: {
        200: LoginResponseZod,
        400: ErrorResponse,
        401: ErrorResponse,
      },
    },
    register: {
      path: '/register',
      method: 'POST',
      summary: 'User registration',
      body: RegisterZod,
      responses: {
        201: LoginResponseZod,
        400: ErrorResponse,
        409: ErrorResponse,
      },
    },
    profile: {
      path: '/profile',
      method: 'GET',
      summary: 'Get user profile',
      responses: {
        200: z.object({
          id: z.number(),
          name: z.string(),
          email: z.string(),
          roles: z.array(
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
                  }),
                )
                .optional(),
            }),
          ),
        }),
        401: ErrorResponse,
      },
    },
    changePassword: {
      path: '/change-password',
      method: 'POST',
      summary: 'Change password',
      body: ChangePasswordZod,
      responses: {
        200: SuccessMessage,
        400: ErrorResponse,
        401: ErrorResponse,
      },
    },
  },
  { pathPrefix: '/auth' },
);
