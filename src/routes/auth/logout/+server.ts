import type { RequestHandler } from './$types';
import { serialize } from 'cookie';
import { json, redirect } from '@sveltejs/kit';

export const POST: RequestHandler = async () => {
  console.log("🟢 Cerrando sesión..."); // Verificar que la solicitud llega
  // Eliminar la cookie de sesión
  const cookie = serialize('session', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
  });
  
  console.log("🔴 Cookie de sesión eliminada:", cookie);

  // return new Response(null, {
  //   status: 303,
  //   headers: { 'Set-Cookie': cookie, 'Location': '/' }
  // });

  return json({ message: 'Sesión cerrada' }, { // ✅ No redirigir aquí
    status: 200,
    headers: { 'Set-Cookie': cookie }
  });


  // const cookie = serialize('session', '', {
  //   httpOnly: true,
  //   secure: true,
  //   sameSite: 'strict',
  //   path: '/',
  //   maxAge: 0,
  // });

  // throw redirect(303, '/');
}
