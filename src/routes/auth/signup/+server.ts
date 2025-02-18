import type { RequestHandler } from './$types';
// import prisma
// importa todo el módulo, lo que implica que podemos acceder a todas las funciones y variables exportadas por el módulo
// por ejemplo, podríamos acceder a la función prisma.user.findUnique() como prisma.user.findUnique()

// import { prisma }
// importa solo la variable prisma y no todo el módulo
// por lo que no podríamos acceder a otras variables o funciones exportadas por el módulo
// por ejemplo, no podríamos acceder a la función prisma.user.findUnique() como prisma.user.findUnique()
// en su lugar, deberíamos acceder a ella como prisma.findUnique({ model: 'User', ... })
import { prisma } from '$lib/prisma';
import bcrypt from 'bcryptjs';

/** @type {import('./$types').RequestHandler} */
export const POST: RequestHandler = async ({ request }) => {
  try {
    // TODO: Añadir console.logs para validar que los datos se están recibiendo correctamente
    const { email, username, password } = await request.json();

    // Validaciones básicas
    if (!email || !username || !password) {
			return new Response(JSON.stringify({ error: 'Todos los campos son obligatorios' }), { status: 400 });
		}

    // Verificar si el username ya existe
    const existingUsername = await prisma.user.findUnique({ 
      where: { username } 
    });
		if (existingUsername) {
			return new Response(JSON.stringify({ error: 'El nombre de usuario ya está en uso' }), { status: 400 });
		}

    // Verificar si el email ya existe
    const existingEmail = await prisma.user.findUnique({
      where: { email }
    });
    if (existingEmail) {
      return new Response(JSON.stringify({ error: 'El email ya está registrado' }), { status: 400 });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario en la DB
    const user = await prisma.user.create({
			data: { email, username, password: hashedPassword }
		});

    return new Response(JSON.stringify({ message: 'Usuario registrado con éxito' }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error en el servidor' + error }), { status: 500 });
  }
}
