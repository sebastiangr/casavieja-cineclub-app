import { type Handle } from '@sveltejs/kit';
import { parse } from 'cookie';
import { verifyToken } from '$lib/jwt';

// Extend SvelteKit's App.Locals interface to include user data
declare global {
  namespace App {
    interface Locals {			
      user?: { userId: string; username: string; fullName: string; email: string } | null;
    }
  }
}

// Main server hook function that runs on every request
export const handle: Handle = async ({ event, resolve }) => {
  // Step 1: Parse cookies from the incoming request headers
  const cookies = parse(event.request.headers.get('cookie') || '');
  // Step 2: Extract the session token from cookies
  const token = cookies.session;

  // Step 3: Check if a token exists
  if (token) {
    // Step 4: Verify the token using the JWT verification function
		const decoded = verifyToken(token);

    // Step 5: Validate the decoded token structure
    if (decoded && typeof decoded === 'object' && 'userId' in decoded && 'username' in decoded) {
      // Verificar y asignar fullName solo si existe
      // const fullName = 'fullName' in decoded ? decoded.fullName : 'Usuario';
      // Step 6: If token is valid, set user data in event.locals
      event.locals.user = { 
        userId: decoded.userId, 
        username: decoded.username, 
        fullName: decoded.fullName,
        email: decoded.email, 
      };
      console.log("🟢 Usuario autenticado en locals:", event.locals.user);
    } else {
      // Step 7: If token is invalid, clear user data
      event.locals.user = null;
      console.log("🔴 Token inválido, eliminando usuario.");
    }
		// if (decoded && typeof decoded === 'object' && 'userId' in decoded && 'username' in decoded) {
		// 	event.locals.user = { userId: decoded.userId, username: decoded.username };
		// } else {
		// 	event.locals.user = null;
		// }
	} else {
    // Step 8: If no token exists, clear user data
		event.locals.user = null;
    console.log("🔴 No hay token, usuario no autenticado.");
	}

  // Redirigir si intenta acceder a `/dashboard` sin estar autenticado
  // if (!event.locals.user && event.url.pathname.startsWith('/dashboard')) {
	// 	// return new Response(null, { status: 302, headers: { Location: '/' } });
  //   console.log("🔴 Acceso no autorizado, redirigiendo al inicio...");
  //   throw redirect(303, '/'); // Usar redirect() en lugar de Response()
	// }
  // Step 9: Continue with the request handling
  return resolve(event);
}