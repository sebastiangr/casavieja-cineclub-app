import type { RequestHandler } from '@sveltejs/kit';
import { verifyToken } from '$lib/jwt';

export const GET: RequestHandler = async ({ request }) => {
	const authHeader = request.headers.get('Authorization');
	const token = authHeader?.split(' ')[1];

	if (!token) {
		return new Response(JSON.stringify({ error: 'No autenticado' }), { status: 401 });
	}

	const decoded = verifyToken(token);
	if (!decoded) {
		return new Response(JSON.stringify({ error: 'Token inválido o expirado' }), { status: 401 });
	}

	return new Response(JSON.stringify({ username: decoded.username }), { status: 200 });
};