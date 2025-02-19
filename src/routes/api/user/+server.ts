import type { RequestHandler } from '@sveltejs/kit';
import { verifyToken } from '$lib/jwt';
import { json } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }) => {
	const authHeader = request.headers.get('Authorization');
	const token = authHeader?.split(' ')[1];

	if (!token) {
    return json({ error: 'No autenticado' }, { status: 401 });		
	}

	const decoded = verifyToken(token);
	if (!decoded) {
    return json({ error: 'Token inválido o expirado' }, { status: 401 });		
	}
	
  return json({ username: decoded.username }, { status: 200 });
};