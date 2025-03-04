import { url } from 'inspector';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

// const protectedRoutes = ['/dashboard', '/messages']; // Rutas que requieren autenticación

export const load: LayoutServerLoad = async ({ locals }) => {

  console.log("🟢 locals.user en layout.server.ts:", locals.user); // Verifica qué se está recibiendo en el servidor

  // const user = locals.user ?? null; 
  // console.log("🔵 User enviado desde layout.server.ts:", user); // Verificar qué se está retornando


  // const urlActual = (await import('url')).URL;
  // // console.log("🔵 URL actual:", location.href);
  // const rutaActual = new urlActual(location.href).pathname;
  // // console.log("🔵 Ruta actual:", rutaActual);

  // if (protectedRoutes.includes(rutaActual) && !locals.user) {
  //   console.log(" Acceso no autorizado, redirigiendo...");
  //   throw redirect(303, '/'); // Redirigir si no hay usuario autenticado
  // }

  // return { user }; // Enviar user correctamente  
  return { user: locals.user };
};