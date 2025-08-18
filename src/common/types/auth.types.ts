import { z } from "zod";

// Login Schema
export const LoginZod = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Register Schema
export const RegisterZod = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Change Password Schema
export const ChangePasswordZod = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

// Login Response Schema
export const LoginResponseZod = z.object({
  access_token: z.string(),
  user: z.object({
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
            })
          )
          .optional(),
      })
    ),
  }),
});

// Type exports
export type LoginDto = z.infer<typeof LoginZod>;
export type RegisterDto = z.infer<typeof RegisterZod>;
export type ChangePasswordDto = z.infer<typeof ChangePasswordZod>;
export type LoginResponse = z.infer<typeof LoginResponseZod>;
