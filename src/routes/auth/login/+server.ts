import type { RequestHandler } from './$types';
import { prisma } from '$lib/prisma';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import { generateToken } from '$lib/jwt';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { email, password } = await request.json();
		console.log('Email y password: ', email, password);

    // TODO: Cambiar email por username
    // Buscar usuario
		const user = await prisma.user.findUnique({ 
      where: { email } 
    });
		console.log('Usuario encontrado: ', user);

    // Verificar usuario y contraseña
		if (!user) {
			console.log('Usuario no existe');
			return new Response(JSON.stringify({ error: 'El usuario no existe' }), { status: 401 });
		}

		if (!(await bcrypt.compare(password, user.password))) {
			console.log('Contraseña incorrecta');
			return new Response(JSON.stringify({ error: 'La contraseña a es incorrecta' }), { status: 401 });
		}

    // Generar token JWT
		const token = generateToken({ userId: user.id, username: user.username });
		console.log('Token generado: ', token);

    // Crear sesión (cookie segura)
		const cookie = serialize('session', token, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
			maxAge: 60 * 60 * 2 // 2 horas
		});
		console.log('Cookie generada: ', cookie);

    return new Response(JSON.stringify({ token }), { 
      status: 200, 
      headers: { 'Set-Cookie': cookie } 
    });
  } catch (error) {
    console.log('Error en el servidor: ', error);
    return new Response(JSON.stringify({ error: 'Error en el servidor' + error }), { status: 500 });
  }
}

