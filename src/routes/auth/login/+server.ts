import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
const prisma = new PrismaClient();

export interface LoginRequestBody {
  email: string;
  password: string;
  rememberMe: boolean;
}

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }: { request: Request }): Promise<Response> {
  try {
    const data: LoginRequestBody = await request.json();
    const { email, password, rememberMe } = data;

    // Buscar usuario
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), { status: 404 });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return new Response(JSON.stringify({ error: 'Contraseña incorrecta' }), { status: 401 });
    }

    // Crear sesión (cookie segura)
    const sessionCookie = serialize('session', JSON.stringify({ userId: user.id, username: user.username }), {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: rememberMe ? 60 * 60 * 24 * 7 : 60 * 60 * 2, // 7 días si se marcó "Recordar sesión"
    });

    return new Response(JSON.stringify({ message: 'Login exitoso' }), {
      status: 200,
      headers: { 'Set-Cookie': sessionCookie },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error en el servidor' }), { status: 500 });
  }
}

