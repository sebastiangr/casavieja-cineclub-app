import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';

export const PUT: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) return json({ error: 'No autorizado' }, { status: 401 });

  const { movieId } = await request.json();
  const userId = locals.user.userId;

  try {
    // Verificamos si el usuario ya votó por la película
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_movieId: {
          userId,
          movieId
        }
      }
    });

    if (existingVote) {
      // Si ya votó, eliminar el voto y restar 1 al contador de votos
      await prisma.vote.delete({
        where: { id: existingVote.id }
      });

      await prisma.movie.update({
        where: { id: movieId },
        data: { votes: { decrement: 1 } }
      });

      return json({ message: 'Voto eliminado', hasVoted: false });
    } else {
      // Si no ha votado, agregar el voto y sumar 1 al contador de votos
      await prisma.vote.create({
        data: { userId, movieId }
      });

      await prisma.movie.update({
        where: { id: movieId },
        data: { votes: { increment: 1 } }
      });

      return json({ message: 'Voto añadido', hasVoted: true });
    }
  } catch (error) {
    console.error('Error al procesar el voto:', error);
    return json({ error: 'Error al procesar el voto' }, { status: 500 });
  }
};


// OLD PROPOSAL

// // src/routes/api/vote/+server.ts
// import { json } from '@sveltejs/kit';
// import { prisma } from '$lib/prisma';

// export async function POST({ request }) {
//   const { movieId, userId } = await request.json();

//   try {
//     const vote = await prisma.vote.findFirst({
//       where: {
//         userId: userId,
//         movieId: movieId,
//       },
//     });
//     console.log('VOTE: Voto encontrado:', vote);
//     console.log('VOTE: MovieID:', movieId);
//     console.log('VOTE: UserID:', userId);

//     if (vote) {
//       // Eliminar el voto
//       await prisma.vote.delete({
//         where: { id: vote.id },
//       });
//       // Restar 1 del contador de votos
//       await prisma.movie.update({
//         where: { id: movieId },
//         data: { votes: { decrement: 1 } },
//       });
//     } else {
//       // Agregar un nuevo voto
//       await prisma.vote.create({
//         data: { userId, movieId },
//       });
//       // Sumar 1 al contador de votos
//       await prisma.movie.update({
//         where: { id: movieId },
//         data: { votes: { increment: 1 } },
//       });
//     }

//     return json({ message: 'Voto actualizado con éxito' });
//   } catch (error) {
//     console.error(error);
//     return json({ message: 'Error al actualizar el voto' }, { status: 500 });
//   }
// }