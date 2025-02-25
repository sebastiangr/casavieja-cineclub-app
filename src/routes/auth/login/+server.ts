import type { RequestHandler } from './$types';
import { prisma } from '$lib/prisma';
import bcrypt from 'bcryptjs';
import { serialize } from 'cookie';
import { generateToken } from '$lib/jwt';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { username, password } = await request.json();
		console.log('Username y password: ', username, password);

    // Buscar usuario por username -------------------------------------
		const user = await prisma.user.findUnique({ 
      where: { username } 
    });
		console.log('>>>>>> USUARIO ENCONTRADO: ', user);

    // Verificar usuario y contraseña ------------------------------------------
		if (!user) {
			console.log('!!!!!! ERROR: Usuario no existe');
			return new Response(JSON.stringify({ error: 'El usuario no existe.' }), { status: 401 });
		}

		if (!(await bcrypt.compare(password, user.password))) {
			console.log('!!!!!! ERROR: Contraseña incorrecta');
			return new Response(JSON.stringify({ error: 'La contraseña es incorrecta.' }), { status: 401 });
		}

    // Generar token JWT ------------------------------------------------------
		const token = generateToken({ userId: user.id, username: user.username, fullName: user.fullName });
		console.log('>>>>>> TOKEN GENERADO: ', token);

    // Crear sesión (cookie segura) --------------------------------------------
		const cookie = serialize('session', token, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			path: '/',
			maxAge: 60 * 60 * 2 // 2 horas
		});
		console.log('>>>>> COOKIE GENERADA: ', cookie);

    // Actualizar el userStore 

    // Establecer el usuario en el store --------------------------------------------
    // The spread operator {...user} is used to create a shallow copy of the user object, 
    // ensuring that all existing properties of user are included in the new object. 
    // The fullName property is then explicitly set. 
    // The expression user.fullName || '' is a logical OR operation that assigns an 
    // empty string to fullName if user.fullName is null, undefined, or any other falsy value. 
    // This ensures that fullName is always a string, preventing potential issues that could 
    // arise from it being undefined or another falsy value.
    // setUser({...user, fullName: user.fullName || ''});
    // if () {

    // }
    // TODO: Pensarle bien a la lógica de setUser, acá está el problema.
    // FIXME: No se está guardando el fullName en el store (creo).

    // User Store ---------------------------------------------
    // Le tengo que pasar un objeto de tipo User, que es lo que recibe el userStore, 
    // y está recibiendo una constante user, que es lo que devuelve el prisma.user.findUnique().
    // ...................
    // Esto es un problema, porque el userStore no está recibiendo el fullName, que es
    // lo que quiero guardar en el store.
    // userStore.setUser(user);
    // Este es el objeto que recibe y al que hay que convertirlo:        
    // export interface User {
    //   id: string;
    //   username: string;
    //   fullName: string; // Agregado el campo fullName
    // }
    // const userToStore: User = {
    //   id: user.id,
    //   username: user.username,
    //   fullName: user.fullName || ''
    // };
    // setUser(userToStore);
    // console.log('!!!!!! USER STORE SET: ', userToStore, '.');

    // Retornar token y cookie ----------------------------------------------
    return json({ token }, { 
      status: 200, 
      headers: { 'Set-Cookie': cookie } 
    });
  } catch (error) {
    console.log('!!!!!! SERVER ERROR: : ', error);
    return json({ error: 'Error en el servidor' }, { status: 500 });    
  }
}

