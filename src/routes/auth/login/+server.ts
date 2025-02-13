import type { RequestHandler } from './$types';
import { prisma } from '$lib/prisma';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import { generateToken } from '$lib/jwt';


export const POST: RequestHandler = async ({ request }) => {
	try {
		const { email, password } = await request.json();

    // Buscar usuario
		const user = await prisma.user.findUnique({ 
      where: { email } 
    });
    // Verificar usuario y contraseña
		if (!user || !(await bcrypt.compare(password, user.password))) {
			return new Response(JSON.stringify({ error: 'Credenciales incorrectas' }), { status: 401 });
		}

    // Generar token JWT
		const token = generateToken({ userId: user.id, username: user.username });

    // Crear sesión (cookie segura)
		const cookie = serialize('session', token, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
			maxAge: 60 * 60 * 2 // 2 horas
		});

    return new Response(JSON.stringify({ token }), { 
      status: 200, 
      headers: { 'Set-Cookie': cookie } 
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error en el servidor' }), { status: 500 });
  }
}

