import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Email inválido'),
  username: z.string()
    .min(3, 'El usuario debe tener al menos 3 caracteres')
    .regex(/^[A-Za-z0-9-_]+$/, 'El nombre de usuario solo puede contener letras básicas (A-Z, a-z), números, guiones (-) y guiones bajos (_)'),
  fullName: z.string()
    .min(5, 'El nombre completo debe tener al menos 5 caracteres'),
    // .regex(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios')
    // .refine((val) => val.split(' ').length >= 2, 'Debe incluir al menos nombre y apellido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

export type SignupForm = z.infer<typeof signupSchema>;

// Agregar una función de validación reutilizable
export function validateSignup(data: unknown) {
  return signupSchema.safeParse(data);
}