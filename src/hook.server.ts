import type { Handle } from '@sveltejs/kit';
import { parse } from 'cookie';
import { verifyToken } from '$lib/jwt';

declare global {
	namespace App {
		interface Locals {
			user: any;
		}
	}
}

export const handle: Handle = async ({ event, resolve }) => {
  const cookies = parse(event.request.headers.get('cookie') || '');
  const token = cookies.session;

	if (token) {
		const decoded = verifyToken(token);
		if (decoded) {
			event.locals.user = decoded;
		}
	}

  // Redirigir si intenta acceder a `/dashboard` sin estar autenticado
  if (!event.locals.user && event.url.pathname.startsWith('/dashboard')) {
		return new Response(null, { status: 302, headers: { Location: '/' } });
	}

  return resolve(event);
}