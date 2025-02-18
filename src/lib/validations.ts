// import { z } from 'zod';

// export const signupSchema = z.object({
//   email: z.string().email('Email inválido'),
//   username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
//   password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
// });

// export type SignupForm = z.infer<typeof signupSchema>;





import { z } from 'zod';

const baseSignupSchema = z.object({
  email: z.string().email('Email inválido'),
  username: z.string().min(3, 'El usuario debe tener al menos 3 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres')
});

export const signupSchema = Object.assign(baseSignupSchema, {
  superFormValidationLibrary: 'zod',
  validate: (data: unknown) => baseSignupSchema.safeParse(data)
});

export type SignupForm = z.infer<typeof baseSignupSchema>;