import type { RequestHandler, RequestEvent } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import { json } from '@sveltejs/kit';
import { requestResetSchema } from '$lib/validations';
import crypto from 'crypto';
import { sendResetEmail } from '$lib/email';

export const POST: RequestHandler = async ({ request }: RequestEvent) => {
  try {
    const { email } = await request.json();
    
    // Validate email
    requestResetSchema.parse({ email });
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    // Always return success even if user doesn't exist (security best practice)
    // if (!user) {
    //   return json({ message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña' }, { status: 200 });
    // }

		if (!user) {
			console.log('!!!!!! ERROR: Usuario no existe');
			return new Response(JSON.stringify({ error: 'El usuario no existe.' }), { status: 401 });
		} else {
    
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now
      
      // Save token to database
      await prisma.user.update({
        where: { id: user.id },
        data: {
          resetToken,
          resetTokenExpiry
        }
      });
      
      // Send email with reset link
      await sendResetEmail(user.email, resetToken);
      
      // return json({ message: 'Si el email existe, recibirás un enlace para restablecer tu contraseña' }, { status: 200 });
      
      return new Response(JSON.stringify({ success: 'Se ha enviado un enlace para restablecer la contraseña a tu correo electrónico.' }), { status: 200 });
    }
  } catch (error) {
    console.error('Error requesting password reset:', error);
    return json({ error: 'Error en el servidor' }, { status: 500 });
  }
};