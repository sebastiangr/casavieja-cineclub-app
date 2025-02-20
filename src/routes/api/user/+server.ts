import type { RequestHandler } from '@sveltejs/kit';
import { verifyToken } from '$lib/jwt';
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';

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
	
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { username: true, fullName: true }
  });

  if (!user) {
    return json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  return json(user, { status: 200 });
};