import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';

/**
 * GET /api/user-votes
 * Devuelve un array con los IDs de todas las películas que el usuario actual ha votado
 */
export const GET: RequestHandler = async ({ locals }) => {
  // Verificar si el usuario está autenticado
  if (!locals.user) {
    return json({ votedMovieIds: [] }, { status: 401 });
  }

  try {
    // Obtener el ID del usuario de la sesión
    const userId = locals.user.userId;

    // Consultar la base de datos para obtener todos los votos del usuario
    const userVotes = await prisma.vote.findMany({
      where: {
        userId: userId
      },
      select: {
        movieId: true
      }
    });

    // Extraer solo los IDs de películas del resultado
    const votedMovieIds = userVotes.map((vote: { movieId: any; }) => vote.movieId);

    // Devolver la lista de IDs como JSON
    return json({ votedMovieIds });
  } catch (error) {
    console.error('Error al obtener votos del usuario:', error);
    return json(
      { error: 'Error al obtener votos del usuario', votedMovieIds: [] },
      { status: 500 }
    );
  }
};
