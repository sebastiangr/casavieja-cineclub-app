import { redirect, type Handle } from '@sveltejs/kit';
import { parse } from 'cookie';
import { verifyToken } from '$lib/jwt';


declare global {
	namespace App {
		interface Locals {			
      user?: { userId: string; username: string, fullName: string } | null;
		}
	}
}

export const handle: Handle = async ({ event, resolve }) => {
  const cookies = parse(event.request.headers.get('cookie') || '');
  const token = cookies.session;

  if (token) {
		const decoded = verifyToken(token);
    if (decoded && typeof decoded === 'object' && 'userId' in decoded && 'username' in decoded) {
      // Verificar y asignar fullName solo si existe
      // const fullName = 'fullName' in decoded ? decoded.fullName : 'Usuario';
      event.locals.user = { 
        userId: decoded.userId, 
        username: decoded.username, 
        fullName: decoded.fullName 
      };
      console.log("🟢 Usuario autenticado en locals:", event.locals.user);
    } else {
      event.locals.user = null;
      console.log("🔴 Token inválido, eliminando usuario.");
    }
		// if (decoded && typeof decoded === 'object' && 'userId' in decoded && 'username' in decoded) {
		// 	event.locals.user = { userId: decoded.userId, username: decoded.username };
		// } else {
		// 	event.locals.user = null;
		// }
	} else {
		event.locals.user = null;
    console.log("🔴 No hay token, usuario no autenticado.");
	}

  // Redirigir si intenta acceder a `/dashboard` sin estar autenticado
  // if (!event.locals.user && event.url.pathname.startsWith('/dashboard')) {
	// 	// return new Response(null, { status: 302, headers: { Location: '/' } });
  //   console.log("🔴 Acceso no autorizado, redirigiendo al inicio...");
  //   throw redirect(303, '/'); // Usar redirect() en lugar de Response()
	// }

  return resolve(event);
}