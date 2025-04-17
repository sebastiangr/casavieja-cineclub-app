import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import { json } from '@sveltejs/kit';
import { resetPasswordSchema } from '$lib/validations';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const POST: RequestHandler = async ({ request }: { request: Request }) => {
  try {
    // const { token, password } = await request.json();
 
    // // Validate token and password
    // resetPasswordSchema.parse({ token, password, confirmPassword: password });

    const resetPasswordSchema = z.object({
      token: z.string(),
      newPassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
      confirmPassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    });
    
    const { token, newPassword, confirmPassword } = await request.json();

    try {
      resetPasswordSchema.parse({ token, newPassword, confirmPassword });
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.log('Validation error:', err.errors);
        return json({ 
          error: 'Invalid request',
          details: err.errors 
        }, { status: 400 });
      }
    }

    // Find user with this token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date()
        }
      }
    });
    
    if (!user) {
      console.log('User not found with this token');
      return json({ error: 'El enlace para restablecer la contraseña es inválido o ha expirado' }, { status: 400 });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });
    
    console.log('Password updated successfully');
    return json({ message: 'Contraseña actualizada con éxito' }, { status: 200 });
  } catch (error) {
    console.error('Error resetting password:', error);
    return json({ error: 'Error en el servidor' }, { status: 500 });
  }
};
