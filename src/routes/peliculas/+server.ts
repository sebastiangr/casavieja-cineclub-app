import { json, type RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/prisma'; // Asegúrate de que la ruta sea correcta


export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) return json({ error: 'No autorizado' }, { status: 401 });
  const { title, poster_path, release_date, director } = await request.json();

  try {
    const newMovie = await prisma.movie.create({
      data: {
        title,
        poster_path,
        release_date,
        director,
        recommendedAt: new Date(),
        recommendedBy: locals.user.userId,
        recommendedByFullName: locals.user.fullName,
        recommendedByUsername: locals.user.username,
      },
    });
    console.log('POST: Película agregada:', newMovie);

    return json(newMovie);
  } catch (error) {
    console.error('Error al agregar la película:', error);
    return json({ error: 'Error al agregar la película' }, { status: 500 });
  }
};

export async function GET() {
  try {
    const movies = await prisma.movie.findMany(); // Obtener todas las películas
    return json(movies);
  } catch (error) {
    console.error('Error al cargar las películas:', error);
    return json({ error: 'Error al cargar las películas' }, { status: 500 });
  }
}

export async function DELETE({ request }: { request: Request }) { // Definir el tipo de params
  console.log('DELETE function called');
  const { id } = await request.json();

  try {
    await prisma.movie.delete({
      where: { id: id }, // Asegurarse de que el ID sea un string
    });
    console.log('Película eliminada:', id);
    return json({ message: 'Película eliminada' });
  } catch (error) {
    console.error('Error al eliminar la película:', error);
    return json({ error: 'Error al eliminar la película' }, { status: 500 });
  }
}

// export async function DELETE({ params }: { params: { id: string } }) { // Definir el tipo de params
//   const { id } = params;
//   try {
//     await prisma.movie.delete({ where: { id } });
//     return json({ success: true });
//   } catch (error) {
//     console.error('Error al eliminar la película:', error);
//     return json({ error: 'Error al eliminar la película' }, { status: 500 });
//   }
// }






// export async function POST({ request, locals }) {
//   const { title, poster_path, release_date, director, userId } = await request.json();

//   try {
//     console.log('POST: Datos recibidos:', { title, poster_path, release_date, director, userId });
//     const newMovie = await prisma.movie.create({
//       data: {
//         title,
//         poster_path,
//         release_date,
//         director,
//         recommendedAt: new Date(),
//         recommendedBy: locals.user.userId,
//         // recommendedBy: userId, // Usar el ID del usuario que recomendó
//       },
//     });
//     console.log('POST: Película agregada:', newMovie);
//     return json(newMovie);
//   } catch (error) {
//     console.error('Error al agregar la película:', error);
//     return json({ error: 'Error al agregar la película' }, { status: 500 });
//   }
// }

