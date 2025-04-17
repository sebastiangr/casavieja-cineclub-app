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


// Este endpoint hace lo siguiente:

// Verifica si el usuario está autenticado
// Obtiene el ID del usuario desde locals.user
// Consulta la base de datos para encontrar todos los votos del usuario actual
// Extrae solo los IDs de las películas votadas
// Devuelve estos IDs como un array en formato JSON
// La respuesta tendrá este formato:
// {
//   "votedMovieIds": ["movie-id-1", "movie-id-2", "movie-id-3"]
// }
// Este endpoint es mucho más eficiente que hacer consultas individuales para cada película, ya que realiza una sola consulta a la base de datos para obtener todos los votos del usuario.