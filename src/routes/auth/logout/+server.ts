import type { RequestHandler } from './$types';
import { serialize } from 'cookie';
import { json } from '@sveltejs/kit';
import { userStore } from '$lib/stores/userStore';

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

  // Clean userStore
  userStore.set(null);

  return json({ message: 'Sesión cerrada' }, { // No redirigir aquí
    status: 200,
    headers: { 'Set-Cookie': cookie }
  });

}
