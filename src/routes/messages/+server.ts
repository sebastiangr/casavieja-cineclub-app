import { prisma } from '$lib/prisma';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  const messages = await prisma.message.findMany({
    include: { user: true }, // Incluir datos del usuario que publicó
    orderBy: { createdAt: 'desc' }
  });

  return json(messages);
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) return json({ error: 'No autorizado' }, { status: 401 });

  const { content } = await request.json();
  if (!content) return json({ error: 'El mensaje no puede estar vacío' }, { status: 400 });

  const message = await prisma.message.create({
    data: {
      content,
      userId: locals.user.userId
    }
  });

  return json(message);
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) return json({ error: 'No autorizado' }, { status: 401 });

  const { id } = await request.json();
  const message = await prisma.message.findUnique({ where: { id } });

  if (!message || message.userId !== locals.user.userId) {
    return json({ error: 'No puedes eliminar este mensaje' }, { status: 403 });
  }

  await prisma.message.delete({ where: { id } });
  return json({ success: true });
};
