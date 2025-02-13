import { serialize } from 'cookie';

/** @type {import('./$types').RequestHandler} */
export async function POST() {
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
