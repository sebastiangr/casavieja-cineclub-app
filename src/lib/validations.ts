import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email('Email inválido'),
  username: z.string()
    .min(3, 'El usuario debe tener al menos 3 caracteres')
    .regex(/^[A-Za-z0-9-_]+$/, 'El nombre de usuario solo puede contener letras (A-Z, a-z), números, guiones (-) y guiones bajos (_)'),
  fullName: z.string()
    .min(3, 'El nombre completo debe tener al menos 3 caracteres'),
    // .regex(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios')
    // .refine((val) => val.split(' ').length >= 2, 'Debe incluir al menos nombre y apellido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

export type SignupForm = z.infer<typeof signupSchema>;

// Schema for requesting a password reset
export const requestResetSchema = z.object({
  email: z.string().email('Por favor ingresa un email válido')
});

export type RequestResetForm = z.infer<typeof requestResetSchema>;

// Schema for resetting the password
export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token inválido'),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword']
});

export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

// Agregar una función de validación reutilizable
export function validateSignup(data: unknown) {
  return signupSchema.safeParse(data);
}

// Función para validar solicitud de restablecimiento de contraseña
export function validateRequestReset(data: unknown) {
  return requestResetSchema.safeParse(data);
}

// Función para validar el restablecimiento de contraseña
export function validateResetPassword(data: unknown) {
  return resetPasswordSchema.safeParse(data);
}
