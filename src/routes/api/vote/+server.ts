// src/routes/api/vote/+server.ts
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';

export async function POST({ request }) {
  const { movieId, userId } = await request.json();

  try {
    const vote = await prisma.vote.findFirst({
      where: {
        userId: userId,
        movieId: movieId,
      },
    });
    console.log('VOTE: Voto encontrado:', vote);
    console.log('VOTE: MovieID:', movieId);
    console.log('VOTE: UserID:', userId);

    if (vote) {
      // Eliminar el voto
      await prisma.vote.delete({
        where: { id: vote.id },
      });
      // Restar 1 del contador de votos
      await prisma.movie.update({
        where: { id: movieId },
        data: { votes: { decrement: 1 } },
      });
    } else {
      // Agregar un nuevo voto
      await prisma.vote.create({
        data: { userId, movieId },
      });
      // Sumar 1 al contador de votos
      await prisma.movie.update({
        where: { id: movieId },
        data: { votes: { increment: 1 } },
      });
    }

    return json({ message: 'Voto actualizado con éxito' });
  } catch (error) {
    console.error(error);
    return json({ message: 'Error al actualizar el voto' }, { status: 500 });
  }
}