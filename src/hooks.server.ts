import type { Handle } from '@sveltejs/kit';
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

	// if (token) {
	// 	const decoded = verifyToken(token);
	// 	if (decoded) {
	// 		event.locals.user = decoded;
	// 	}
	// }

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
      console.log('User saved in event.locals:', event.locals.user);
    } else {
      event.locals.user = null;
      console.log('Invalid token structure');
    }
		// if (decoded && typeof decoded === 'object' && 'userId' in decoded && 'username' in decoded) {
		// 	event.locals.user = { userId: decoded.userId, username: decoded.username };
		// } else {
		// 	event.locals.user = null;
		// }
	} else {
		event.locals.user = null;
    console.log('User NOT saved in event.locals:');
	}

  // Redirigir si intenta acceder a `/dashboard` sin estar autenticado
  if (!event.locals.user && event.url.pathname.startsWith('/dashboard')) {
		return new Response(null, { status: 302, headers: { Location: '/' } });
	}

  return resolve(event);
}