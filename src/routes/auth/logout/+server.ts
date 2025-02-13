import type { RequestHandler } from './$types';
import { serialize } from 'cookie';

export const POST: RequestHandler = async () => {
  // Eliminar la cookie de sesión
  const cookie = serialize('session', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });

  return new Response(JSON.stringify({ message: 'Sesión cerrada' }), {
    status: 200,
    headers: { 'Set-Cookie': cookie },
  });
}
