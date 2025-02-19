import type { RequestHandler } from './$types';
import { prisma } from '$lib/prisma';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import { generateToken } from '$lib/jwt';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { username, password } = await request.json();
		console.log('Username y password: ', username, password);

    // Buscar usuario por username
		const user = await prisma.user.findUnique({ 
      where: { username } 
    });
		console.log('Usuario encontrado: ', user);

    // Verificar usuario y contraseña
		if (!user) {
			console.log('Usuario no existe');
			return new Response(JSON.stringify({ error: 'El usuario no existe.' }), { status: 401 });
		}

		if (!(await bcrypt.compare(password, user.password))) {
			console.log('Contraseña incorrecta');
			return new Response(JSON.stringify({ error: 'La contraseña es incorrecta.' }), { status: 401 });
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
    
    return json({ token }, { 
      status: 200, 
      headers: { 'Set-Cookie': cookie } 
    });
  } catch (error) {
    console.log('Error en el servidor: ', error);
    return json({ error: 'Error en el servidor' }, { status: 500 });    
  }
}

