import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Email inválido'),
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

export type SignupForm = z.infer<typeof signupSchema>;

// Agregar una función de validación reutilizable
export function validateSignup(data: unknown) {
  return signupSchema.safeParse(data);
}