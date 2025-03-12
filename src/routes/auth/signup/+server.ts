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
import { signupSchema } from '$lib/validations';
import { json } from '@sveltejs/kit';

// TODO: Hay que validar que fullName y username no pueda ser solo espacios "___".

/** @type {RequestHandler} */
export const POST: RequestHandler = async ({ request }) => {
  try {
    // TODO: Añadir console.logs para validar que los datos se están recibiendo correctamente
    const { email, username, fullName, password } = await request.json();

    // Validar que username y fullName no sean solo espacios en blanco
    if (/^\s*$/.test(username)) {
      return new Response(JSON.stringify({ error: 'El nombre de usuario no puede estar compuesto solo por espacios.' }), { status: 400 });
    }
    if (/^\s*$/.test(fullName)) {
      return new Response(JSON.stringify({ error: 'El nombre completo no puede estar compuesto solo por espacios.' }), { status: 400 });
    }

    // Validar los datos usando Zod
    signupSchema.parse({ email, username, fullName, password });

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
    await prisma.user.create({
      data: { email, username, fullName, password: hashedPassword }
    });    

    return json({ message: 'Usuario registrado con éxito' }, { status: 201 });    
  } catch (error) {    
    return json({ error: 'Error en el servidor' }, { status: 500 });
  }
}
