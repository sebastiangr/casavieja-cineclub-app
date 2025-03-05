import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';

export const GET: RequestHandler = async ({ url, locals }) => {
  if (!locals.user) return json({ error: 'No autorizado' }, { status: 401 });

  const movieId = url.searchParams.get('movieId');
  if (!movieId) return json({ error: 'Falta el ID de la película' }, { status: 400 });

  try {
    const vote = await prisma.vote.findUnique({
      where: {
        userId_movieId: {
          userId: locals.user.userId,
          movieId
        }
      }
    });

    return json({ hasVoted: !!vote });
  } catch (error) {
    console.error('Error al verificar el voto:', error);
    return json({ error: 'Error al verificar el voto' }, { status: 500 });
  }
};