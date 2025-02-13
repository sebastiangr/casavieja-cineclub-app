import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }: { request: Request }): Promise<Response> {
  try {
    const data = await request.json();
    const { email, username, password } = data as { email: string; username: string; password: string };

    // Validaciones básicas
    if (!email || !username || !password) {
      return new Response(JSON.stringify({ error: 'Todos los campos son obligatorios' }), { status: 400 });
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(JSON.stringify({ error: 'El usuario ya existe' }), { status: 400 });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario en la DB
    const user = await prisma.user.create({
      data: { email, username, password: hashedPassword },
    });

    return new Response(JSON.stringify({ message: 'Usuario registrado con éxito' }), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error en el servidor' }), { status: 500 });
  }
}
