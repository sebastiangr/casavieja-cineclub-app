import type { RequestHandler } from '@sveltejs/kit';
import { verifyToken } from '$lib/jwt';
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import { parse } from 'cookie';

export const GET: RequestHandler = async ({ request }) => {
  const cookies = parse(request.headers.get('cookie') || '');
  const token = cookies.session;

  if (!token) {
    console.log('User: server.ts - No hay token 401');
    return json({ error: 'No autenticado' }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    console.log('User: server.ts - Token inválido 401');
    return json({ error: 'Token inválido o expirado' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { username: true, fullName: true }
  });

  if (!user) {
    console.log('User: server.ts - Usuario no encontrado 404');
    return json({ error: 'Usuario no encontrado' }, { status: 404 });
  }

  console.log('Response server.ts:', user);
  return json(user, { status: 200 });
};